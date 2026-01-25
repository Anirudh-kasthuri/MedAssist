import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Audio Context & Processing Configuration
let audioContext: AudioContext | null = null;
let mediaStream: MediaStream | null = null;
let inputProcessor: ScriptProcessorNode | null = null;
let visualizerRequestId: number | null = null;
let nextStartTime = 0;
const sources = new Set<AudioBufferSourceNode>();

export const connectToLiveSession = async (
  language: string,
  onVisualData: (data: Uint8Array) => void,
  onClose: () => void
) => {
  // 1. Initialize Audio Contexts
  audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  
  // 2. Get Microphone Stream (WebRTC getUserMedia)
  mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Create Analyser for Visualizer
  const analyser = inputContext.createAnalyser();
  analyser.fftSize = 128; // 64 frequency bins
  analyser.smoothingTimeConstant = 0; // We handle smoothing in the UI component

  // Custom AI Persona definition with dynamic language
  const systemInstruction = `
    You are MedAssist, a specialized medical AI companion. 
    Your personality is: Calm, empathetic, professional, and reassuring.
    Your role: Listen to patients describe symptoms, ask clarifying questions, and provide general health education.
    Constraint: NEVER provide a definitive medical diagnosis. Always advise consulting a human doctor for serious concerns.
    Keep responses concise and conversational.
    Language: The user speaks ${language}. Reply in ${language}.
  `;
  
  // 3. Connect to Gemini Live API
  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
      },
      systemInstruction: systemInstruction,
    },
    callbacks: {
      onopen: () => {
        console.log("MedAssist Live Session Connected");
        startAudioInputStream(inputContext, mediaStream!, sessionPromise, analyser, onVisualData);
      },
      onmessage: async (message: LiveServerMessage) => {
        const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
          await playAudioChunk(base64Audio);
        }
        
        // Handle interruptions
        if (message.serverContent?.interrupted) {
          stopAudioPlayback();
        }
      },
      onclose: () => {
        console.log("Session Closed");
        onClose();
      },
      onerror: (err) => {
        console.error("Session Error", err);
        onClose();
      }
    }
  });

  // 4. Return cleanup function
  return async () => {
    if (visualizerRequestId) {
      cancelAnimationFrame(visualizerRequestId);
      visualizerRequestId = null;
    }
    // Stop input processing
    if (inputProcessor) {
      inputProcessor.disconnect();
      inputProcessor = null;
    }
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      mediaStream = null;
    }
    if (audioContext) {
      await audioContext.close();
      audioContext = null;
    }
    if (inputContext) {
      await inputContext.close();
    }
    stopAudioPlayback();
  };
};

function startAudioInputStream(
  context: AudioContext, 
  stream: MediaStream, 
  sessionPromise: Promise<any>,
  analyser: AnalyserNode,
  onVisualData: (data: Uint8Array) => void
) {
  const source = context.createMediaStreamSource(stream);
  const processor = context.createScriptProcessor(4096, 1, 1);
  
  // Connect graph: Source -> Analyser -> Destination (for vis)
  // Connect graph: Source -> Processor -> Destination (for streaming)
  // Note: We need to keep the processor connected to destination to keep it alive in some browsers, 
  // even though we don't output audio from inputContext to speakers.
  source.connect(analyser);
  source.connect(processor);
  processor.connect(context.destination);
  inputProcessor = processor;

  // Visualizer Loop
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  const updateVisuals = () => {
    if (!inputProcessor) return;
    analyser.getByteFrequencyData(dataArray);
    onVisualData(new Uint8Array(dataArray));
    visualizerRequestId = requestAnimationFrame(updateVisuals);
  };
  visualizerRequestId = requestAnimationFrame(updateVisuals);
  
  processor.onaudioprocess = (e) => {
    const inputData = e.inputBuffer.getChannelData(0);
    
    // Send to Gemini
    const pcmData = convertFloat32ToInt16(inputData);
    const base64Data = arrayBufferToBase64(pcmData);
    
    sessionPromise.then(session => {
        session.sendRealtimeInput({
            media: {
                mimeType: 'audio/pcm;rate=16000',
                data: base64Data
            }
        });
    });
  };
}

async function playAudioChunk(base64Audio: string) {
  if (!audioContext) return;
  
  const audioData = base64ToArrayBuffer(base64Audio);
  const float32Data = new Float32Array(audioData.byteLength / 2);
  const dataView = new DataView(audioData);
  
  for (let i = 0; i < float32Data.length; i++) {
    float32Data[i] = dataView.getInt16(i * 2, true) / 32768.0;
  }

  const audioBuffer = audioContext.createBuffer(1, float32Data.length, 24000);
  audioBuffer.getChannelData(0).set(float32Data);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  
  const currentTime = audioContext.currentTime;
  if (nextStartTime < currentTime) {
    nextStartTime = currentTime;
  }
  
  source.start(nextStartTime);
  nextStartTime += audioBuffer.duration;
  sources.add(source);
  
  source.onended = () => {
    sources.delete(source);
  };
}

function stopAudioPlayback() {
  sources.forEach(source => {
    try { source.stop(); } catch (e) {}
  });
  sources.clear();
  nextStartTime = 0;
}

// Utils
function convertFloat32ToInt16(float32Array: Float32Array) {
  const int16Array = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    let s = Math.max(-1, Math.min(1, float32Array[i]));
    int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return int16Array.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}
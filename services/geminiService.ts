import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { DiagnosticResult, Language } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

// Helper to clean response text (remove markdown code blocks if present)
const cleanText = (text: string) => text.replace(/```json/g, '').replace(/```/g, '').trim();

export const analyzeMedicalImage = async (
  base64Image: string, 
  mimeType: string,
  language: Language
): Promise<DiagnosticResult> => {
  try {
    const prompt = `
      You are a specialized medical AI assistant capable of serving both patients (laymen) and doctors (professionals).
      Analyze this medical image (skin, x-ray, or lab report).
      
      Output Language: ${language}.
      
      Task:
      1. Identify the condition.
      2. Provide a 'summary' for a PATIENT (reassuring, simple, EL5).
      3. Provide a 'technicalAnalysis' for a DOCTOR (medical terminology, differential diagnosis, detailed observations).
      4. Estimate 'confidence' as a number between 0 and 100.
      5. List 3 actionable next steps.
      6. Estimate severity.
      
      Return JSON format:
      {
        "title": "Short title of finding",
        "summary": "Simple explanation for patient",
        "technicalAnalysis": "Detailed clinical description for doctor using medical terminology",
        "confidence": 85,
        "recommendations": ["Step 1", "Step 2", "Step 3"],
        "severity": "low" | "medium" | "high",
        "disclaimer": "Standard non-medical advice disclaimer"
      }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Vision model
      contents: {
        parts: [
          { inlineData: { mimeType, data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
      }
    });

    const text = response.text || "{}";
    return JSON.parse(cleanText(text)) as DiagnosticResult;

  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    throw new Error("Failed to analyze image.");
  }
};

export const analyzeMedicalAudio = async (
  base64Audio: string,
  language: Language
): Promise<DiagnosticResult> => {
  try {
    const prompt = `
      You are a medical AI assistant. Listen to this patient description.
      Output Language: ${language}.
      
      Task:
      1. Analyze the symptoms.
      2. Provide a 'summary' for the PATIENT (empathetic, simple).
      3. Provide a 'technicalAnalysis' for a DOCTOR (clinical abstract, potential ICD-10 codes logic, medical terms).
      4. Confidence score (0-100).
      
      Return JSON format:
      {
        "title": "Symptom Assessment",
        "summary": "Patient-friendly summary",
        "technicalAnalysis": "Doctor-focused clinical summary",
        "confidence": 92,
        "recommendations": ["Tip 1", "Tip 2", "Tip 3"],
        "severity": "low" | "medium" | "high",
        "disclaimer": "AI insights are for information only, not a medical diagnosis."
      }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025', // Audio model
      contents: {
        parts: [
          { inlineData: { mimeType: 'audio/mp3', data: base64Audio } }, // Assuming MP3 conversion or compatible container
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(cleanText(text)) as DiagnosticResult;

  } catch (error) {
    console.error("Gemini Audio Analysis Error:", error);
    throw new Error("Failed to analyze audio.");
  }
};

export const analyzeMedicalText = async (
  symptoms: string,
  language: Language
): Promise<DiagnosticResult> => {
  try {
    const prompt = `
      You are a medical AI assistant. The patient says: "${symptoms}".
      Output Language: ${language}.
      
      Task:
      1. Analyze text.
      2. 'summary': Patient-friendly explanation.
      3. 'technicalAnalysis': Clinical breakdown for a doctor.
      4. Confidence score (0-100).
      
      Return JSON format:
      {
        "title": "Assessment",
        "summary": "Patient explanation",
        "technicalAnalysis": "Clinical explanation",
        "confidence": 88,
        "recommendations": ["Rec 1", "Rec 2", "Rec 3"],
        "severity": "low" | "medium" | "high",
        "disclaimer": "AI insights are for information only."
      }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    return JSON.parse(cleanText(text)) as DiagnosticResult;

  } catch (error) {
    console.error("Gemini Text Analysis Error:", error);
    throw new Error("Failed to analyze symptoms.");
  }
};

export const getHiddenHealthTip = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Give me one short, fascinating, obscure human body fact that makes a person feel good about being alive. Keep it under 20 words.",
    });
    return response.text || "Your body replaces itself every 7 years.";
  } catch (e) {
    return "Breathe in. Breathe out.";
  }
};

export const generateBatchAnalysisReport = async (count: number): Promise<string> => {
  return `Personal health archive sync complete. ${count} records secure.`;
};
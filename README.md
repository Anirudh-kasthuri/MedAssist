# 🧠 MedAssist AI — Intelligent Clinical Decision Support System

MedAssist AI is a full-stack project I built to explore how modern AI models can assist in early-stage medical triage. The idea was to simulate something close to a real clinical workflow—taking in symptoms, images, or even voice input, and turning that into structured, explainable insights.

Everything runs locally after setup, so there are no API dependencies once the models are downloaded.

---

## 🚀 What it can do

### 🩺 Symptom Analysis

- Takes natural language input (e.g., “persistent cough and fever”)
- Uses a locally hosted **FLAN-T5 Large** model for reasoning
- Returns structured output:
  - Observations  
  - Possible conditions  
  - Risk level  
  - Clinical reasoning  
  - Suggested next steps  

---

### 🖼️ Medical Image Analysis

- Upload X-rays, skin images, or scans
- Uses **BLIP** to generate image captions
- Feeds that into a reasoning model to produce clinical-style interpretations

---

### 🎙️ Voice-Based Consultation

- Speak your symptoms directly
- **Whisper** handles real-time speech-to-text
- Transcribed text is processed the same way as typed input

---

### 📊 Structured Output

- Clean diagnostic-style cards
- Severity levels: Low / Medium / High
- Confidence scores
- Toggle between doctor-style and patient-friendly views

---

### ⚡ Redis Caching

- Responses are cached using Redis
- Faster repeat queries
- Helps reduce unnecessary model inference

---

### 📄 PDF Reports

- Export results as a PDF
- Useful for saving or sharing outputs

---

## 🧱 Tech Stack

### Frontend
- React + TypeScript  
- Tailwind CSS  
- Component-driven structure  
- Real-time updates  

### Backend
- FastAPI  
- SQLAlchemy  
- JWT authentication  
- Rate limiting  

### AI / ML
- FLAN-T5 Large → reasoning  
- BLIP → image captioning  
- Whisper → speech recognition  
- PyTorch + HuggingFace  

### Infrastructure
- Redis (Docker)  
- PostgreSQL / SQLite (configurable)  
- Fully local inference (no paid APIs)  

---

## 🧠 Architecture Overview

```
User Input (Text / Image / Voice)
        │
        ▼
Frontend (React UI)
        │
        ▼
FastAPI Backend
        │
 ┌───────────────┬─────────────────┬──────────────┐
 │               │                 │              │
 ▼               ▼                 ▼              ▼
Image AI      Text AI         Voice AI       Redis Cache
(BLIP)        (FLAN-T5)       (Whisper)          │
        │               │                 │      ▼
        └───────────────┴─────────────────┴──► Response
```

---

## ⚙️ Setup

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd medassist
```

---

### 2. Backend setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

---

### 3. Start Redis (Docker)

```bash
docker start medassist-redis
```

Quick check:

```bash
docker exec -it medassist-redis redis-cli ping
```

You should see:

```
PONG
```

---

### 4. Run backend

```bash
uvicorn app.main:app --reload
```

---

### 5. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 First Run

- The first run will download the models:
  - BLIP (~1.2GB)  
  - FLAN-T5 Large (~3GB)  

- After that:
  - Everything runs locally  
  - No external API calls  
  - No usage costs  

---

## 🔐 Authentication

- JWT-based auth
- Protected API routes
- User-specific uploads and reports

---

## 📌 Notes / Highlights

- Built as a **multi-modal AI system** (text, image, voice)
- Runs **entirely offline after setup**
- Uses **local transformer models**, not external APIs
- Includes **Redis caching** for performance
- Focuses on **explainable outputs**, not black-box predictions
- Real-time voice pipeline using Whisper

---

## ⚠️ Disclaimer

This is a **demo / educational project**.

It is **not** a medical tool and should not be used for diagnosis or treatment decisions.

---

## 📈 Possible Improvements

- Use medical-specific vision models (e.g., BioMedCLIP)
- Integrate medical knowledge sources (PubMed, etc.)
- Stream responses in real time
- Add multilingual support
- Package everything with Docker for easier deployment

---

## 👨‍💻 About

I built this to explore what a practical, AI-assisted healthcare workflow might look like using current tools. It’s a mix of experimentation and trying to keep things production-like where possible.

---

⭐ If you found it useful or interesting, feel free to star the repo.

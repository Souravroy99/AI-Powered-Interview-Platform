
# 🚀 AI-Powered Interview Platform

An intelligent, real-time, voice-based interview simulator built with **Next.js**, **Vapi**, **Google Gemini**, and **Firebase**.
This platform allows users to practice interviews using **human-like voice agents**, receive **live feedback**, and get **AI-generated evaluations** with detailed scoring.

Live link:
👉 [https://ai-powered-interview-platform-new.vercel.app/](https://ai-powered-interview-platform-new.vercel.app/)


---

## 🧠 Why This Project?

Traditional mock interview tools rely on text.
This platform is different — it provides:

* **Real-time voice conversation**
* **AI-driven dynamic questioning**
* **Gemini-powered reasoning & feedback**
* **Detailed scoring + improvement tips**
* **Full interview transcript & session history**

A fully interactive **AI interviewer** that feels like a real interview.

---

# 🌟 Features

### 🎤 **Real-Time Voice Interviews**

* Powered by **Vapi Voice Agents**
* STT (Speech → Text)
* TTS (Text → Speech)
* Natural conversational flow

### 🤖 **AI-Powered Interviewer (Google Gemini)**

* Generates contextual follow-up questions
* Evaluates user responses
* Produces structured feedback
* Scores based on multiple criteria
* Provides strengths + improvement areas

### 📊 **Post-Interview Analytics**

* Total score (0–100)
* Category-wise breakdown:

  * Communication
  * Technical Knowledge
  * Problem Solving
  * Cultural Fit
  * Confidence

### 🔐 **User Authentication**

* Firebase Auth (Email login)

### 💾 **Cloud Storage**

* Firestore → saves:

  * Interviews
  * Transcripts
  * Feedback
  * Scores
  * Analytics

### 🖥️ **Clean UI**

* Built with **Next.js 14**, **Tailwind CSS**, **ShadCN**
* Fully responsive
* Smooth animations via **Framer Motion**

---

# 🏛️ Architecture Overview

Below is the full flow of how the system works:

### **1. User speaks into the mic**

Browser → Vapi AI Agent

### **2. Vapi performs Speech-to-Text**

User audio → Text transcript

### **3. Transcript sent to Backend**

Next.js server action receives transcript

### **4. Backend sends prompt to Google Gemini**

Gemini does:

* Question generation
* Conversation logic
* Scoring
* Evaluation

### **5. Gemini returns text response**

Backend → Vapi

### **6. Vapi converts text → speech**

TTS creates natural voice response

### **7. Firebase stores data**

Firestore stores:

* Transcript
* Score
* Feedback
* Session history

---

# ⚙️ Tech Stack

## 🎨 Frontend

* **Next.js 14 (App Router)**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **ShadCN UI**
* **React Hook Form + Zod**

## 🧠 AI & Voice Layer

* **Google Gemini 2.0 Flash**
* **Vapi.ai Voice Agents**

  * STT (Speech → Text)
  * TTS (Text → Speech)
  * Voice pipeline streaming

## 🔥 Backend

* **Next.js Server Actions (`"use server"`)**
* **Firebase Admin SDK**
* **AI SDK (`ai` library)**

## 🗄️ Database + Authentication

* **Firebase Firestore**
* **Firebase Auth**
* **Firebase Storage**

## ☁️ Deployment

* **Vercel**

---

# 🗂️ Project Structure

```
AI-Powered-Interview-Platform/
│
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   └── sign-in/page.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   └── previous-interviews/page.tsx
│   │
│   ├── (home)/
│   │   └── page.tsx
│   │
│   ├── (interview)/
│   │   ├── [id]/page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── favicon.ico
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── charts/
│   ├── dashboard/
│   ├── interview/
│   ├── ui/
│   ├── Footer.tsx
│   └── Navbar.tsx
│
├── constants/
│   ├── index.ts
│   └── feedbackSchema.ts
│
├── firebase/
│   ├── admin.ts          ← Server-side Firebase Admin SDK
│   └── config.ts         ← Client-side Firebase config
│
├── lib/
│   ├── auth.ts
│   ├── utils.ts
│   └── stripe.ts (if exists)
│
├── public/
│   ├── logo.png
│   ├── icons/
│   └── images/
│
├── types/
│   ├── index.ts
│   └── interview.types.ts
│
├── .env.local.example
├── .eslintrc.json
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.js
├── README.md
└── tailwind.config.ts
```

* **Server actions** handle AI evaluation & database operations
* **Firebase** stores all interview data
* **Vapi** manages voice agent interactions

---

# 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/Souravroy99/AI-Powered-Interview-Platform
cd AI-Powered-Interview-Platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create `.env.local`:

```
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
GEMINI_API_KEY=
VAPI_API_KEY=
```

### 4. Run app

```bash
npm run dev
```

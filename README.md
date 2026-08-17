.

<div align="center">

<img src="client/public/banner.png" alt="VoiceDoc Banner" width="800" />

<br/>

[![GitHub](https://img.shields.io/badge/GitHub-VoiceDoc-181717?style=for-the-badge&logo=github)](https://github.com/Jaanvichouhan34/VoiceDoc)
[![Backend](https://img.shields.io/badge/⚡_Backend-Live_on_Render-34d399?style=for-the-badge)](https://github.com/Jaanvichouhan34/VoiceDoc)
[![License](https://img.shields.io/badge/License-MIT-a78bfa?style=for-the-badge)](LICENSE)

<br/>

![Node.js](https://img.shields.io/badge/Node.js_18-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React+Vite-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Groq](https://img.shields.io/badge/AI-Groq%20Llama3-orange?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)

<br/>

```
██╗   ██╗ ██████╗ ██╗ ██████╗███████╗██████╗  ██████╗  ██████╗
██║   ██║██╔═══██╗██║██╔════╝██╔════╝██╔══██╗██╔═══██╗██╔════╝
██║   ██║██║   ██║██║██║     █████╗  ██║  ██║██║   ██║██║     
╚██╗ ██╔╝██║   ██║██║██║     ██╔══╝  ██║  ██║██║   ██║██║     
 ╚████╔╝ ╚██████╔╝██║╚██████╗███████╗██████╔╝╚██████╔╝╚██████╗
  ╚═══╝   ╚═════╝ ╚═╝ ╚═════╝╚══════╝╚═════╝  ╚═════╝  ╚═════╝
```

> **The AI Medical Scribe Built for India's Doctors.**
> Speak in Hindi or English. VoiceDoc transcribes, structures, 
> and generates prescriptions instantly. Spend time with patients, not paperwork.

<br/>

</div>

---

## 🧠 What is VoiceDoc?

VoiceDoc is a **production-level, AI-powered medical scribe** that revolutionizes clinical documentation. It listens to clinical consultations in real-time, supports seamless code-switching between **Hindi and English (Hinglish)**, and automatically generates structured clinical notes and prescriptions.

### Interface Previews

<div align="center">
  <img src="client/public/voicedoc%201.png" alt="VoiceDoc Dashboard" width="250" />
  &nbsp;&nbsp;
  <img src="client/public/voicedoc2.png" alt="AI Analysis" width="250" />
  &nbsp;&nbsp;
  <img src="client/public/prescription.png" alt="Generated Prescription" width="250" />
</div>
<br/>

<table>
<tr>
<td width="33%" align="center">
<br/>
🎙️<br/><b>Voice First</b><br/>
<sub>Speak naturally in Hinglish.<br/>VoiceDoc listens and understands.</sub>
<br/><br/>
</td>
<td width="33%" align="center">
<br/>
🧠<br/><b>Intelligent Structuring</b><br/>
<sub>Extracts symptoms, diagnoses,<br/>and medicines instantly.</sub>
<br/><br/>
</td>
<td width="33%" align="center">
<br/>
💊<br/><b>Smart Prescriptions</b><br/>
<sub>One-click PDF generation<br/>with dynamic tables.</sub>
<br/><br/>
</td>
</tr>
<tr>
<td width="33%" align="center">
<br/>
🌓<br/><b>Dynamic Themes</b><br/>
<sub>Premium dark mode and<br/>high-contrast light mode.</sub>
<br/><br/>
</td>
<td width="33%" align="center">
<br/>
📊<br/><b>Patient Trends (EHR)</b><br/>
<sub>Visualize health metrics<br/>over time with charts.</sub>
<br/><br/>
</td>
<td width="33%" align="center">
<br/>
🔒<br/><b>Privacy First</b><br/>
<sub>Secure, encrypted storage<br/>of sensitive clinical data.</sub>
<br/><br/>
</td>
</tr>
</table>

---

## ⚔️ VoiceDoc vs Standard Solutions

| Feature | Other Medical Scribes | **VoiceDoc** |
|---------|-----------------------|--------------|
| Language Support | ❌ English only | ✅ Fluent in Hinglish (Hindi + English) |
| Prescriptions | ❌ Manual typing | ✅ Auto-generates ready-to-print PDFs |
| Time spent | ❌ 50% of the day on docs | ✅ Documentation finishes with the consultation |
| Theme System | ❌ Boring clinical white | ✅ Beautiful Dark Mode & Light Mode |
| Patient Search | ❌ Slow page reloads | ✅ Debounced, instant live search |

> VoiceDoc is designed for **fast-paced Indian clinics** where consultations happen in mixed languages and doctors need to focus on the patient, not the screen.

---

## 🛠️ Tech Stack

### ⚛️ React + Vite — Web Dashboard

> Fast, component-based UI designed with extreme attention to detail and a premium aesthetic.

| Tool | Role |
|------|------|
| `React` | Component-based UI |
| `Vite` | Lightning-fast dev server |
| `Tailwind CSS` | Utility-first styling & responsiveness |
| `Framer Motion` | Smooth animations & transitions |
| `Web Speech API` | Browser-native real-time voice capture |

### ⚙️ Node.js + Express — API Backend

> Acts as the bridge between the UI and AI, handling data structuring, authentication, and PDF generation.

| Package | Role |
|---------|------|
| `express` | REST API server |
| `mongoose` | MongoDB database ODM |
| `groq-sdk` / `@google/generative-ai` | High-speed AI extraction pipeline |
| `jsonwebtoken` | Secure user authentication |

---

## 🏗️ Project Structure

```
VoiceDoc/
├── server/                    # ⚙️ Node.js + Express API
│   ├── index.js               # Main server entry
│   ├── routes/                # API route handlers (auth, ai, consultations)
│   ├── models/                # MongoDB database schemas
│   ├── middleware/            # JWT Auth middleware
│   └── package.json
│
├── client/                    # ⚛️ React + Vite dashboard
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Dashboard, Login, New Consultation
│   │   └── context/           # Global state management
│   ├── public/                # Static assets & screenshots
│   └── package.json
│
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js `18+`
- MongoDB URI
- Groq or Google Gemini API key

### 1. Clone the Repository

```bash
git clone https://github.com/Jaanvichouhan34/VoiceDoc.git
cd VoiceDoc
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key (Optional fallback)
```

```bash
npm run dev
```

### 3. Frontend Setup

```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

> Open `http://localhost:5173` — your VoiceDoc dashboard is live.

---

## 🗺️ Future Roadmap

- 📱 **WhatsApp Integration**: Automatically send PDF prescriptions to patients via WhatsApp Business API.
- 🎙️ **Multi-speaker diarization**: Distinguish between doctor and patient voices.

---

## 👩💻 Built By

<div align="center">

**Jaanvi Chouhan**
*B.Tech CSE · 3rd Year · Medi-Caps University, Indore*

[![GitHub](https://img.shields.io/badge/GitHub-Jaanvichouhan34-181717?style=flat-square&logo=github)](https://github.com/Jaanvichouhan34)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-jaanvi--chouhan-0A66C2?style=flat-square&logo=linkedin)](https://linkedin.com/in/jaanvi-chouhan)
[![Email](https://img.shields.io/badge/Email-jaanvichouhan18805@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:jaanvichouhan18805@gmail.com)

*Developed with ❤️ for the medical community.*

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=120&section=footer" />

*If VoiceDoc saves your time — give the repo a ⭐*

</div>

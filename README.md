# 🎓 CareerConnect – Smart Campus Placement Portal (v2)

CareerConnect is an AI-enhanced platform to help students, TPOs (Training & Placement Officers), and companies manage campus recruitment workflows: quizzes with proctoring, ATS resume scanning, DSA practice with a code runner, interview preparation, announcements, and analytics.

--

**Highlights**
- AI-powered ATS resume scanner (Groq / Llama models)
- AI-driven interview question generation & evaluation
- Online quizzes with webcam-based proctoring + evidence storage (Cloudinary)
- Coding playground (runs Python/C/C++/Java) with execution isolation via temporary files
- Admin / Company / Student roles, announcements, company listings, and dashboards

--

## Repository Structure (overview)

- `server.js` — Express backend entry (models, schemas, route mounts).
- `client/` — React frontend (Vite) with pages and components.
- `server/` — Backend modules and routes:
  - `server/routes/atsRoutes.js` — Resume PDF parsing, Groq analysis, Cloudinary upload, history save.
  - `server/routes/quizRoutes.js` — Quiz CRUD, proctoring analysis, AI quiz insights.
  - `server/routes/dsaRoutes.js` — Problem list, run/compile code, record attempts, analytics.
  - `server/routes/interviewRoutes.js` — Generate questions, feedback, session analysis (AI).
  - `server/routes/communicationRoutes.js` — Chat/roleplay/English coach using Groq.
- `Aptitude/`, `Verbal_Q/`, `CodingPract/`, `data/`, `public/` — Content, question banks, templates.
- `temp/` — Runtime temporary files created by DSA code runner and uploads.

--

## Main Features & API Summary

Backend base: express server in `server.js` (default PORT or `process.env.PORT`).

Key REST endpoints (mounted under shown prefixes):

- Announcements: `POST /announcements`, `GET /announcements`, `PUT /announcements/:id`, `PATCH /announcements/:id/status`, `DELETE /announcements/:id`
- Companies: `GET /companies`, `DELETE /companies/:id`
- Student auth & profile: `POST /register`, `POST /login`, `GET /students`, `GET|PUT|DELETE /students/:username`, `POST /students/:username/upload-photo`
- Admin auth: `POST /admin/register`, `POST /admin/login`, `GET /admin/profile`, `PUT /admin/:username`
- Company auth: `POST /company/register`, `POST /company/login`, `POST /company/announcements`

- ATS (Resume Scanner):
  - `POST /api/ats/scan` — Upload resume PDF and job description (FormData). Extracts text via `pdf-parse`, runs Groq analysis, uploads PDF to Cloudinary, stores `atsScans` on student profile when `username` provided.
  - `GET /api/ats/history/:username` — Retrieve saved ATS scan history.

- Quiz & Proctoring:
  - `GET /api/quiz/questions` — Retrieve student-safe or admin paginated questions.
  - `POST /api/quiz/submit` — Submit answers; saves attempt to student and returns results.
  - `POST /api/quiz/proctor` — Analyze webcam frame with AI; uploads suspicious snapshots to Cloudinary.
  - `GET /api/quiz/stats/:username` — User quiz statistics.

- DSA / Coding:
  - `GET /api/dsa/questions` — Query DSA problems (filters, pagination).
  - `POST /api/dsa/run` — Run code (python/c/cpp/java) using temporary files and process spawn; returns stdout/stderr.
  - `POST /api/dsa/submit` — Record a problem attempt for a student.
  - `GET /api/dsa/analytics/:username` — DSA analytics for dashboards.

- Interview & Communication (AI):
  - `POST /api/interview/questions` — Generate role-specific interview questions.
  - `POST /api/interview/feedback` — AI evaluate candidate answers and return rating + feedback.
  - `POST /api/interview/analyze-session` — Holistic session analysis.
  - `POST /api/communication/chat` — English practice, voice/chat/scenario modes.

--

## Tech Stack

- Frontend: React (via Vite), Tailwind CSS, React Router, Recharts, Monaco Editor integration for code editor.
- Backend: Node.js, Express, Mongoose (MongoDB), Multer + multer-storage-cloudinary for uploads.
- AI & NLP: Groq SDK (Llama family models) for resume analysis, interview, question generation, grading, and proctoring.
- Storage: Cloudinary for images, PDFs, and proctoring snapshots.
- Utilities: `pdf-parse` for text extraction, `bcryptjs` for hashing, `jsonwebtoken` used elsewhere if JWT is added.

--

## Required Environment Variables

Create a `.env` file at repository root with these keys (used by server.js and routes):

```
PORT=3000
MONGO_URI=<your-mongodb-uri>
GROQ_API_KEY=<your-groq-api-key>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_API_KEY=<cloudinary_api_key>
CLOUDINARY_API_SECRET=<cloudinary_api_secret>
```

Notes:
- `GROQ_API_KEY` is required for AI features (ATS analysis, interview, proctoring). If missing some routes return friendly error messages.
- Cloudinary credentials are required to upload profile pictures, resumes, and proctoring snapshots.

--

## Installation & Quick Start

1. Clone the repository

```bash
git clone <repo-url>
cd CareerConnect-Smart-Campus-Placement-Portal
```

2. Install backend deps and frontend deps

```bash
npm install            # root (backend)
cd client
npm install            # frontend
```

3. Create `.env` in repository root (see "Required Environment Variables").

4. Run servers

```bash
# In terminal 1 (backend)
cd <repo-root>
npm start              # starts Express server (server.js)

# In terminal 2 (frontend)
cd client
npm run dev            # starts Vite dev server
```

--

## Security & Operational Notes

- The DSA code runner creates temporary files under `temp/` and executes compilers/interpreters — this is intended for development and is not hardened for untrusted code execution in production. Use proper sandboxing (containers, time/memory limits, seccomp) for production.
- Store secrets securely (use environment variables or secret stores). Do not commit `.env`.
- AI responses are parsed from model outputs — the server contains defensive parsing and fallbacks but ensure rate limits and error handling when enabling production AI usage.

--

## Contributing

- Fixes and features: open issues and PRs. Please include a brief description and repro steps for bugs.
- For frontend changes, follow existing React + Tailwind patterns in `client/src/`.

--

## License

This project includes an MIT license in the repository. See [LICENSE](LICENSE) for details.

--

If you'd like, I can also:
- run a quick dependency scan (`npm audit`) and list missing scripts
- add a short badge header and example `.env.example` file

Done — README updated.
# 🎓 CareerConnect – Smart Campus Placement Portal (Version 2.0)

CareerConnect is an integrated **AI-powered platform** designed to streamline and elevate the campus placement experience for **students**, **training and placement officers (TPOs)**, and **recruiters**.

Featuring advanced modules for **ATS Analysis**, **AI-Proctored Quizzes**, and **Performance Dashboards**, CareerConnect ensures students are industry-ready while providing TPOs with actionable data.

---

## 🚀 Key Modules & AI Features

### 👨‍🎓 AI-Powered Student Portal

- **📊 Smart Quiz System with AI Proctoring**  
  - Real-time **face recognition** and attention tracking during technical tests.
  - **Automated Violation Detection**: Captures snapshots of suspicious behavior (looking away, multiple faces, etc.).
  - **Proctoring Logs**: Detailed history of attempts including webcam snapshots saved securely to Cloudinary.

- **� ATS Resume Scanner 2.0**  
  - **Groq-Powered Analysis**: High-speed resume matching using Llama 3 models.
  - **Persistent History Drawer**: Interactive side-panel to review past scans.
  - **Full State Restoration**: Restores exact **Job Descriptions**, missing keywords, and AI tips from history.
  - **Cloudinary Integration**: Secure PDF storage and instant viewability.

- **� Performance Analytics**  
  - Track quiz scores, DSA progress, and ATS trends with dynamic **Recharts** visualizations.
  - Individual student growth monitoring across technical and aptitude categories.

- **💻 DSA & Coding Hub**  
  - Interactive coding environment with question banks and attempt history.

---

## 🧠 Tech Stack

| Layer          | Technologies                                           |
|----------------|--------------------------------------------------------|
| **Frontend**   | React 18, Vite, Tailwind CSS, Lucide React, Recharts   |
| **Backend**    | Node.js, Express.js                                    |
| **Database**   | MongoDB (Mongoose)                                     |
| **AI / Cloud** | Groq SDK (Llama 3), Cloudinary (Media), PDF-Parse      |

---

## 🛡️ AI Proctoring Features

- **Continuous Face Tracking**: Uses webcam to ensure the student is focused on the screen.
- **Environment Analysis**: Detects if multiple people are present during a test.
- **Snapshot Evidence**: Automatically captures and uploads evidence of violations.
- **Violation Logging**: TPOs can review logs and snapshots for integrity audits.

---

## 🛠️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [Cloudinary Account](https://cloudinary.com/)
- [Groq API Key](https://console.groq.com/)

### 🤝 Quick Start for Collaborators
If you are cloning this for the first time:
1. **Clone the repo**: `git clone https://github.com/Pichikachandu/CareerConnect.git`
2. **Setup Environment**: Create a `.env` file (see Template below).
3. **Install Dependencies**: Even if `node_modules` exist, run `npm install` in both root and `client` folders to ensure compatibility.
4. **Run the App**: Use the "Steps to Run" section below.

### Environment Configuration
Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### Steps to Run

1. **Clone & Install Backend**
   ```bash
   npm install
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start Servers**
   - **Backend**: `npm start` (from root)
   - **Frontend**: `npm run dev` (from /client)

---

## 🪪 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

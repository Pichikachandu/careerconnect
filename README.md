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

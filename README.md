# 🚀 PrepPlus AI - Smart Student Productivity Ecosystem

PrepPlus AI is a high-performance MERN-stack application designed to revolutionize student life. It combines advanced AI-driven study planning with a powerful management suite to help students achieve academic mastery.

![Version](https://img.shields.io/badge/Version-1.0.0-blue?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Gemini_2.5-orange?style=for-the-badge)

## ✨ Core Features

### 📅 AI-Powered Study Planner
Leverages **Google Gemini 2.5 Flash** to generate scientifically optimized study schedules based on your subjects, difficulty levels, and energy cycles.

### 👑 Intelligent Admin Dashboard
A dedicated command center for system administrators to monitor global student growth, manage users, and inspect detailed academic progress across the platform.

### ⏱️ Academic Toolkit
- **Pomodoro Timer**: Integrated focus sessions to maximize deep work.
- **Subject Management**: Full CRUD capabilities with priority-based tracking.
- **Task Analytics**: Visualize pending vs. completed work in real-time.

### 🔒 Enterprise-Grade Security
- Secure JWT-based authentication.
- Cryptographically secure password recovery system with virtual email interception.
- Multi-tier role-based access control (Admin vs. Student).

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas (Cloud).
- **AI Engine**: Google Gemini Pro API.
- **Communication**: Nodemailer (with Ethereal for recovery flows).

## 🚀 Quick Start (Local Setup)

1. **Clone the Repo**
   ```bash
   git clone https://github.com/yourusername/prepplus.git
   cd prepplus
   ```

2. **Backend Configuration**
   ```bash
   cd server
   # Create a .env file and add your credentials:
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   GEMINI_API_KEY=your_google_ai_key
   ```

3. **Frontend Configuration**
   ```bash
   cd ../client
   npm install
   # Set the API URL in src/utils/api.js
   ```

4. **Run the App**
   ```bash
   # In server folder
   npm start
   
   # In client folder
   npm run dev
   ```



---

**Developed for Academic Excellence & Modern Productivity.**

# 🚀 PrepPlus Deployment Guide (Host for FREE)

To take your project online so anyone can use it, follow these 3 steps.

## 1. Database: MongoDB Atlas (FREE)
Your local database won't work online. You need a cloud database.
1.  **Sign up**: Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a Free Shared Cluster.
2.  **Security**: 
    - Go to **Network Access** > **Add IP Address** > Select **"Allow Access from Anywhere"**.
    - Go to **Database Access** > **Add New User** (e.g., `admin` / `password123`).
3.  **Connect**: Click **Connect** > **Drivers** > Copy the `mongodb+srv://...` connection string.
4.  **Update**: Paste this string into your `server/.env` file.

## 2. Backend: Render.com (FREE)
Render is the best place to host Node.js for free.
1.  **Push to GitHub**: Upload your code to a GitHub repository.
2.  **Create Web Service**: On [Render](https://render.com/), choose "New Web Service" and connect your repo.
3.  **Configuration**:
    - **Root Directory**: `server`
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
4.  **Environment Variables**: Add these in the Render Dashboard:
    - `MONGODB_URI`: (Your Atlas string)
    - `JWT_SECRET`: (Any random string)
    - `GEMINI_API_KEY`: (Your Gemini key)
    - `PORT`: `10000` (Render will provide this automatically)

## 3. Frontend: Vercel or Netlify (FREE)
1.  **Create Project**: On [Vercel](https://vercel.com/), choose "New Project" and connect your repo.
2.  **Configuration**:
    - **Root Directory**: `client`
    - **Framework Preset**: Vite
3.  **Environment Variables**:
    - `VITE_API_URL`: (The URL Render gives you, e.g., `https://prepplus-api.onrender.com/api`)
4.  **Deploy!**

---

### 💡 Pro-Tip for Submission
When you submit, provide the **Vercel URL** (e.g., `prepplus.vercel.app`). Your teachers and friends can then log in and use the AI features from anywhere in the world!

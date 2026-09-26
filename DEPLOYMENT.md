# Deployment Guide: Free Hosting for LexiClear Legal Navigator

This application is a **full-stack Node.js + Express + React (Vite)** app. Because it contains a backend server to safely keep your `GEMINI_API_KEY` private and handle PDF generation, rate-limiting, and LLM requests, it should be deployed on a free cloud platform that supports Node.js web services.

---

## Option 1: Render (Recommended - 100% Free Web Service)

[Render](https://render.com) provides a free Web Service tier with automatic HTTPS and Git-based continuous deployment.

### Steps:
1. Push your repository to **GitHub**.
2. Sign in to [dashboard.render.com](https://dashboard.render.com/) (using your GitHub account).
3. Click **New +** &rarr; **Web Service**.
4. Select your GitHub repository.
5. Fill in the settings:
   - **Name**: `lexiclear-legal-navigator` (or your preferred name)
   - **Environment**: `Node`
   - **Region**: Choose the closest region (e.g., Oregon, Frankfurt, Singapore)
   - **Branch**: `main` (or `master`)
   - **Build Command**:
     ```bash
     npm install && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Instance Type**: Select **Free**
6. Scroll down to **Environment Variables** and add:
   - `GEMINI_API_KEY`: `your_gemini_api_key_here` (from [Google AI Studio](https://aistudio.google.com/app/apikey))
   - `NODE_ENV`: `production`
7. Click **Create Web Service**.
8. Within 2 minutes, Render will build and provide you with a live URL (e.g. `https://lexiclear-legal-navigator.onrender.com`).

---

## Option 2: Koyeb (Generous Free Tier & Instant Global CDN)

[Koyeb](https://www.koyeb.com/) offers a fast free tier with built-in SSL.

### Steps:
1. Log in to [app.koyeb.com](https://app.koyeb.com/).
2. Click **Create Service** &rarr; **GitHub**.
3. Select your repository.
4. Set:
   - **Build Command**: `npm run build`
   - **Run Command**: `npm start`
   - **Port**: `3000` (or leave default HTTP)
5. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: `your_gemini_api_key_here`
6. Click **Deploy**.

---

## Option 3: Railway

[Railway](https://railway.app/) detects the `package.json` automatically:
1. Go to [railway.app](https://railway.app/) and click **Start a New Project**.
2. Select **Deploy from GitHub repo**.
3. Under **Variables**, add `GEMINI_API_KEY`.
4. Under **Settings** &rarr; **Networking**, click **Generate Domain**.

---

## Verifying Deployment Health
Once deployed, check your live endpoint:
```bash
curl https://<your-app-domain>/api/health
```
You should receive:
```json
{
  "status": "ok",
  "service": "LexiClear Legal Navigator API"
}
```

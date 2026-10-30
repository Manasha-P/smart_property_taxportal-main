# AI-Based Property Tax Self-Assessment Tracking Portal

Official digital treasury platform linking municipal property tax assessments with citizen Aadhaar identifiers and multi-bank electronic clearing.

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel%20Live-brightgreen?style=flat-square&logo=vercel)](https://smart-property-taxportal-main.vercel.app)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Manasha-P/smart_property_taxportal-main)

---

## 🌐 Live Production Deployments

* **Frontend Portal (Vercel):** [https://smart-property-taxportal-main.vercel.app](https://smart-property-taxportal-main.vercel.app)
* **Backend API Service (Render):** [https://smart-property-taxportal-main-backend.onrender.com](https://smart-property-taxportal-main-backend.onrender.com)
* **GitHub Repository:** [https://github.com/Manasha-P/smart_property_taxportal-main](https://github.com/Manasha-P/smart_property_taxportal-main)

---

### 📡 Live Backend API Endpoints (Render)
* **Health Check:** `https://smart-property-taxportal-main-backend.onrender.com/api/health`
* **Admin Overview:** `https://smart-property-taxportal-main-backend.onrender.com/api/taxpayer/admin/overview`
* **Taxpayer Search:** `POST https://smart-property-taxportal-main-backend.onrender.com/api/taxpayers/search`
* **Officer Login:** `POST https://smart-property-taxportal-main-backend.onrender.com/api/auth/login`

---

## 🚀 1-Click Backend Deployment on Render

You can deploy the backend web service instantly with the pre-configured [`render.yaml`](render.yaml) blueprint:

👉 **[Click Here to Deploy Backend on Render](https://render.com/deploy?repo=https://github.com/Manasha-P/smart_property_taxportal-main)**

Render will automatically configure:
* **Root Directory:** `server`
* **Build Command:** `npm install`
* **Start Command:** `node server.js`
* **Health Check Path:** `/api/health`
* **Environment:** Node.js (Production)

---

## 🏛️ System Architecture

* **Frontend:** React 19, Vite, React Router 7, Recharts, Responsive Institutional Design.
* **Backend:** Express.js 5, Node.js, JWT Authentication, Multi-Bank Settlement Engine.
* **Database & Persistence:** MongoDB / Mongoose with built-in resilient standalone data fallback.
* **Security:** Non-colliding Aadhaar UID hashing, 256-bit TLS enforcement, RBAC officer access.

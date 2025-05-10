# 🤖 Groq Chatbot

A fast and responsive AI chatbot built using the [Groq API](https://groq.com/), featuring a **Python backend** and a **React + Vite frontend**. The backend is hosted via **Runway**, and the frontend is deployed on **Vercel**.

## 🚀 Features

- Real-time chatbot powered by Groq’s language models.
- Modern frontend built with React and Vite.
- Lightweight Python backend with FastAPI or Flask.
- Seamless integration with the Groq API for intelligent responses.

## 🧰 Tech Stack

- **Frontend:** React + Vite (JavaScript)
- **Backend:** Python (FastAPI or Flask)
- **AI Model:** Groq API
- **Deployment:** Vercel (frontend) + Runway (backend)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Varshith00/groq-multimodal-app.git
cd groq-chatbot

cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

for frontend:
cd frontend
npm install
npm run dev

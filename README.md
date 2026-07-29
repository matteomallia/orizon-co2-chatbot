# 🌿 Orizon AI - Eco-Turismo & Chatbot CO₂ (DevOps LifeCycle)

Applicazione MERN (MongoDB, Express, React, Node) per il calcolo dell'impatto ambientale tramite un Agente AI Conversazionale. Questo repository contiene l'intero ciclo DevOps: containerizzazione Docker, pipeline CI/CD con GitHub Actions, gestione sicura delle credenziali, deploy automatico e monitoraggio in tempo reale.

---

## 🛠️ Stack Tecnologico & Architettura
* **Frontend**: React 18 + Vite
* **Backend**: Node.js + Express
* **Database**: MongoDB Atlas
* **AI & Integration**: OpenAI GPT-4o API & EcoFreight API
* **Containerization**: Docker & Docker Compose
* **CI/CD**: GitHub Actions
* **Hosting**: Vercel (Frontend) / Render (Backend)
* **Monitoring**: UptimeRobot & Sentry

---

## 🎯 Definizione degli Ambienti

| Ambiente | Runtime / Host | Database | Trigger Deploy |
| :--- | :--- | :--- | :--- |
| **Development** | Docker Compose (Locale) | MongoDB Local / Atlas Dev | Manuale (`docker compose up`) |
| **Staging** | GitHub Actions Runner | DB Test / Mock | Push / PR su branch secondari |
| **Production** | Vercel (FE) + Render (BE) | MongoDB Atlas Prod | Push automatico su `main` |

---

## 📋 Roadmap di Progetto (DevOps Workflow)

- [x] **Step 1: Esplorazione & Pianificazione** (Analisi MERN + README)
- [ ] **Step 2: Containerizzazione** (Dockerfile per Frontend/Backend e `docker-compose.yml`)
- [ ] **Step 3: Sicurezza e Gestione Secrets** (`.env`, `.gitignore` e GitHub Secrets)
- [ ] **Step 4: Pipeline CI (Continuous Integration)** (Linting + Build automatizzata su `main`)
- [ ] **Step 5: Pipeline CD & Deploy Pubblico** (Deploy automatico su Vercel/Render)
- [ ] **Step 6: Monitoraggio & Error Tracking** (Integrazione Sentry & UptimeRobot)

---

## 🚀 Guida Rapida allo Sviluppo Locale (Docker)

### 1. Clona il repository e configura le variabili
Crea un file `.env` sia nel frontend che nel backend seguendo le guide `.env.example`.

### 2. Avvia l'intero stack con Docker Compose
```bash
docker compose up --build
# 🌿 Orizon AI - Eco-Travel CO₂ Calculator

Orizon è un'applicazione web full-stack (MERN + AI) progettata per aiutare gli utenti a calcolare e comprendere l'impatto ambientale dei propri viaggi in termini di emissioni di CO₂, offrendo suggerimenti di compensazione e alternative ecologiche in tempo reale.

---

## 🏗️ Architettura del Sistema

- **Frontend**: React 18 (Vite), Lucide Icons, Architettura a componenti modulari (`Sidebar`, `ChatMessage`, `ImpactTable`).
- **Backend**: Node.js, Express.js (ES Modules).
- **Database**: MongoDB Atlas per la persistenza delle sessioni di chat e della cronologia.
- **AI Integration**: OpenAI API (`gpt-4o`) con **Function Calling / Tool Calling** per la strutturazione dei dati ambientali.
- **Security & DevOps**: CORS dinamici orientati alla produzione, gestione avanzata degli errori di parsing e Dockerization.

---

## 🛠️ Requisiti e Variabili d'Ambiente

### Backend (`/orizon-backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/orizon
OPENAI_API_KEY=sk-...
FRONTEND_URL=[https://orizon-frontend1.onrender.com](https://orizon-frontend1.onrender.com)
ECOFREIGHT_API_KEY=dummy_key_for_internal_engine
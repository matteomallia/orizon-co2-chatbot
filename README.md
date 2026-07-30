# 🌿 Orizon AI - Eco-Travel Assistant

Orizon AI è un'applicazione web full-stack (MERN + AI) progettata per aiutare gli utenti a calcolare e comprendere l'impatto ambientale dei propri viaggi in termini di emissioni di $\text{CO}_2$, offrendo suggerimenti di compensazione e alternative ecologiche in tempo reale tramite un'interfaccia conversazionale.

---

## 🎯 1. ESPLORAZIONE ED ANALISI DELL'APPLICAZIONE

### Analisi in Breve
- **Funzionamento**: L'utente interagisce tramite una chat descrivendo un itinerario di viaggio in linguaggio naturale (es. *"Voglio andare da Milano a Parigi in treno con 20kg di bagaglio"*).
- **Intelligence (LLM & Function Calling)**: Il backend Express riceve il messaggio e lo inoltra a OpenAI (`gpt-4o`). Il modello riconosce l'intento di viaggio ed attiva la **Function Calling / Tool Calling** (`calculateCO2`), estraendo i parametri in formato JSON strutturato.
- **Engine di Calcolo**: Il server elabora i dati tramite un engine interno basato su standard IPCC per calcolare i kg di $\text{CO}_2$ emessi, la distanza stimata e l'impatto equivalente in alberi da piantare per la compensazione.
- **Persistenza & UI**: Le conversazioni e i dati dell'impatto vengono salvati su **MongoDB Atlas** e renderizzati nel frontend React tramite schede grafiche e componenti modulari (`Sidebar`, `ChatMessage`, `ImpactTable`).

### Tech Stack
- **Frontend**: React 18, Vite, Lucide Icons, CSS3 Modulare.
- **Backend**: Node.js, Express.js (ES Modules), Mongoose.
- **Database**: MongoDB Atlas.
- **AI Integration**: OpenAI GPT-4o API (Tool Calling).
- **DevOps & Infrastructure**: GitHub Actions, Docker, Docker Compose, Render.

---

## 🌐 2. STRATEGIA DEGLI AMBIENTI

L'applicazione è configurata per operare su 3 ambienti distinti:

| Ambiente | Host / Server | Database | Scope & Obiettivo |
| :--- | :--- | :--- | :--- |
| **Development (Dev)** | `localhost:5173` (Vite) / `localhost:5000` (Node) | MongoDB Local / Atlas Dev | Sviluppo rapido con hot-reload e debug locale via file `.env`. |
| **Staging** | Docker Containers / Branch `staging` | MongoDB Atlas Staging | Validation E2E, test di integrazione e verifica build dei container. |
| **Production (Prod)** | Render Web Services (HTTPS) | MongoDB Atlas Prod | Rilascio pubblico con HTTPS, CORS restrittivi e secrets protetti. |

---

## 🛠️ 3. SCELTA DEGLI STRUMENTI DEVOPS

Per la gestione e l'automazione della pipeline è stato scelto **GitHub Actions**:
- **Integrazione Nativa**: Perfettamente integrato nel repository GitHub, senza necessità di amministrare server/runner esterni come Jenkins.
- **Automazione CI/CD**: Workflow YAML trasparenti per eseguire **Linting**, **Build dell'immagine Docker** e **Deploy automatico** ad ogni `push` sul branch `main`.

---

## 🐳 4. CONTAINERIZZAZIONE (DOCKER)

L'intera architettura è containerizzata per garantire parità assoluta tra l'ambiente di sviluppo locale e l'ambiente di produzione.

### Architettura dei Container
- **`orizon-frontend`**: Basato su `node:20-slim`, espone la porta `5173` servendo l'applicazione React Vite con supporto Host Hot-Reload.
- **`orizon-backend`**: Basato su `node:20-slim`, espone la porta `5000` per le API REST Express.

---

## 🚀 5. GUIDA ALL'AVVIO ED ESECUZIONE IN LOCALE

Prima di eseguire l'applicazione con qualsiasi modalità, assicurati di configurare i file delle variabili d'ambiente:
- `./orizon-backend/.env`
- `./orizon-frontend/.env`

---

### 🐳 Opzione A: Avvio tramite Docker e Docker Compose (Consigliato DevOps)

0. **Clona il repository:**
   ```bash
   git clone <URL_REPOSITORY>
   cd orizon

1. **Build e Avvio di tutti i servizi in background:**
    docker compose up --build -d

2. **Verifica dello stato dei container attivi:**
    docker compose ps

3. **Visualizzazione dei log dei container in tempo reale:**
    docker compose logs -f

4. **Arresto dei container e pulizia della rete:**
    docker compose down

---

### Opzione B: Avvio Manuale Sviluppatore (Senza Docker)

1. **Avvio del Backend (in un terminale):**
# Entra nella cartella del backend
    cd orizon-backend

# Installazione delle dipendenze
    npm install

# Avvio del server Express in modalità sviluppo
    npm run dev

2. **Avvio del Frontend (in un altro terminale):**
# Entra nella cartella del frontend
    cd orizon-frontend

# Installazione delle dipendenze
    npm install

# Avvio del server di sviluppo Vite
    npm run dev

---

## 🔒 6. SICUREZZA E GESTIONE SECRETS

### Isolamento dei Secrets
- I file `.env` di frontend e backend sono inclusi nel `.gitignore` e mai tracciati nel repository Git.
- **Produzione (Render)**: Tutte le credenziali di produzione (`OPENAI_API_KEY`, `MONGODB_URI`, `FRONTEND_URL`, `VITE_API_URL`) sono gestite direttamente tramite il pannello Environment Variables dei Web Services di Render.
- **Pipeline CI/CD (GitHub)**: Le credenziali necessarie per i job di automazione sono memorizzate in **GitHub Repository Secrets** (`Settings > Secrets and variables > Actions`).

### Mascheramento nei Log
Nelle pipeline di GitHub Actions, i secrets vengono iniettati tramite l'oggetto `${{ secrets.<NOME_SECRET> }}`. È stato verificato che l'output della console oscuri automaticamente tali valori (`***`), impedendo qualsiasi fuga accidentale nei log pubblici.

---

## ⚡ 7. PIPELINE CI (CONTINUOUS INTEGRATION)

### Automazione e Validazione
La pipeline di Continuous Integration è implementata tramite **GitHub Actions** (`.github/workflows/ci.yml`) e si attiva automaticamente ad ogni `push` o `pull_request` sul branch `main`.

### Fasi della Pipeline:
1. **Source Checkout & Node.js Setup**: Prepara l'ambiente di esecuzione su runner Linux `ubuntu-latest`.
2. **Linting & Code Quality**: Esegue l'analisi statica del codice nel frontend per prevenire l'inclusione di errori sintattici nel codebase.
3. **Docker Container Verification Build**: Esegue la build atomica delle immagini Docker sia per il `frontend` che per il `backend`. In caso di fallimento della build, la pipeline si interrompe segnalando lo stato rosso ($\times$).
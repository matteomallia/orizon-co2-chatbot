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

---

## 🌐 8. PIPELINE CD & DEPLOYMENT PUBBLICO

### Continuous Deployment Automation
Il deployment continuo è affidato a **Render.com**, integrato nativamente con il repository GitHub.

- **Trigger di Deploy**: Ogni `push` con esito positivo sul branch `main` attiva automaticamente il workflow di build e release su Render via Webhook.
- **Gestione Ambiente**: I servizi utilizzano container isolati con variabili d'ambiente iniettate in modo sicuro tramite il pannello di controllo di Render.
- **Zero-Downtime Deployment**: Render gestisce il passaggio alla nuova versione dell'applicazione sostituendo le istanze solo dopo il completamento con esito positivo dei health check.

### Link di Produzione
- **Frontend Application**: [https://orizon-frontend1.onrender.com](https://orizon-frontend1.onrender.com)
- **Backend API Service**: [https://orizon-backend1.onrender.com](https://orizon-backend1.onrender.com)

---

## 📊 9. MONITORAGGIO, LOGGING E GESTIONE ERRORE

### 1. Uptime Monitoring (UptimeRobot)
- **Stato Servizi**: Monitoraggio sintetico attivo 24/7 su endpoint HTTP/HTTPS tramite UptimeRobot.
- **Health Checks**: Intervallo di controllo impostato a 5 minuti su Frontend e Backend API.
- **Alerting System**: Configurate notifiche automatiche via email in caso di Downtime o latenza anomala (> 2000ms).

### 2. Application Error Tracking (Sentry)
- **Crash Reporting**: Integrato SDK Sentry (`@sentry/react`) per l'intercettazione in tempo reale delle eccezioni uncaught in frontend.
- **Context & Stack Trace**: Cattura automatica di metadati di sessione, browser, sistema operativo e stack trace dettagliato per accelerare il debugging in produzione.
- **Privacy & Security**: Mascheramento automatico dei dati sensibili degli utenti prima dell'invio degli eventi a Sentry.

---

## 🚨 10. GESTIONE E INTERPRETAZIONE DEGLI ALERT

In questo capitolo viene documentata la procedura di risposta rapida (**Incident Response**) agli alert inviati dai sistemi di monitoraggio.

### 🔔 1. Alert da UptimeRobot (Disponibilità)

UptimeRobot effettua controlli HTTP sintetici ogni 5 minuti. Gli alert vengono inviati via Email/Webhook in caso di anomalie.

| Notifica / Alert | Causa Probabile | Azione Correttiva (Runbook) |
| :--- | :--- | :--- |
| **HTTP 500 / 502 / 503** | Errore del server Node.js o crash dell'applicazione backend. | 1. Controllare i log di sistema sul pannello Render (`Logs`).<br>2. Verificare che la connessione al cluster MongoDB Atlas sia attiva.<br>3. Se necessario, effettuare un roll-back al commit precedente. |
| **Timeout (> 30s) / DOWN temporaneo** | **Cold Start** del container su Render (Free Tier) dopo inattività o latenza di rete eccezionale. | 1. Attendere il controllo successivo (5 min) per verificare il risveglio dell'istanza.<br>2. Verificare lo stato dei servizi globali di Render e MongoDB Atlas. |
| **SSL / Certificate Warning** | Certificato HTTPS scaduto o non rinnovato da Render. | Verificare le impostazioni del dominio e il rinnovo automatico gestito da Render. |

---

### 🐞 2. Alert da Sentry (Error Tracking)

Sentry cattura le eccezioni non gestite nel client React e invia notifica immediata quando si verifica una nuova *Issue*.

#### Come interpretare le Issue su Sentry:
1. **Uncaught Exceptions (es. `TypeError`, `ReferenceError`)**:
   - **Interpretazione**: Bug nel codice frontend o risposta inattesa dall'API (es. payload JSON malformato o campi `undefined`).
   - **Azione**: Verificare lo **Stack Trace** nella dashboard Sentry per individuare il file e la riga esatta, oltre all'impatto sul totale degli utenti (`Affected Users`).
2. **API Error / Network Failures (es. `Failed to fetch`)**:
   - **Interpretazione**: Impossibilità del frontend di raggiungere l'URL del backend Render (`VITE_API_URL`).
   - **Azione**: Verificare se il backend è in stato di downtime (incrociando i dati con UptimeRobot) o se sono presenti problemi di policy CORS.
3. **OpenAI Rate Limit / Tool Error**:
   - **Interpretazione**: Superamento della quota di token o errore durante la chiamata alle API di OpenAI.
   - **Azione**: Verificare il saldo/quota nel dashboard di OpenAI.
# 1. Utilizziamo un'immagine Node.js leggera e ufficiale come base
FROM node:20-slim

# 2. Impostiamo la cartella di lavoro all'interno del container
WORKDIR /app

# 3. Copiamo i file di configurazione delle dipendenze
COPY package*.json ./

# 4. Installiamo le dipendenze
RUN npm install

# 5. Copiamo tutto il resto del codice sorgente del frontend
COPY . .

# 6. Esponiamo la porta tipica di Vite
EXPOSE 5173

# 7. Comando per avviare l'app in modalità sviluppo
CMD ["npm", "run", "dev", "--", "--host"]
# 1. Immagine base Node.js
FROM node:20-alpine

# 2. Cartella di lavoro nel container
WORKDIR /app

# 3. Copia dei file per la gestione dei pacchetti
COPY package*.json ./

# 4. Installazione delle dipendenze backend
RUN npm install

# 5. Copia del codice sorgente backend
COPY . .

# 6. Esposizione della porta del server Express (es. 5000 o 3000)
EXPOSE 5000

# 7. Comando di avvio del server
CMD ["npm", "start"]
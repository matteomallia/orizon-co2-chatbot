import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Chat } from './models/Chat.js';
import { openai, SYSTEM_PROMPT, tools } from './services/openaiService.js';
import { fetchEcoFreightEmissions } from './services/ecofreightService.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Configurazione CORS Sicura (Suggerimento docente)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173', // Dev server Vite
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Consente richieste senza origin (Postman, cURL) o dai domini consentiti
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origine ${origin} non consentita dalle politiche CORS`));
    }
  },
  credentials: true
}));

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('🌿 Connessione a MongoDB Atlas completata con successo!'))
  .catch((err) => console.error('❌ Errore di connessione a MongoDB:', err));

app.post('/api/chat', async (req, res) => {
  const { chatId, message } = req.body;

  if (!chatId || !message) {
    return res.status(400).json({ error: 'Parametri chatId e message sono obbligatori.' });
  }

  try {
    // Recupera o crea la sessione di chat dal Database
    let chatSession = await Chat.findOne({ chatId });
    if (!chatSession) {
      chatSession = new Chat({ chatId, messages: [] });
    }

    chatSession.messages.push({ role: 'user', content: message });

    const recentMessages = chatSession.messages.slice(-8);

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...recentMessages.map(msg => ({ role: msg.role, content: msg.content }))
    ];

    let response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: apiMessages,
      tools: tools,
      tool_choice: "auto",
    });

    let assistantMessage = response.choices[0].message;

    if (assistantMessage.tool_calls && assistantMessage.tool_calls.length > 0) {
      console.log("🎯 L'LLM ha deciso di attivare la Function Calling per calcolare la CO2!");
      
      const toolCall = assistantMessage.tool_calls[0];
      
      if (toolCall.function.name === "calculateCO2") {
        
        // 2. Try/Catch dedicato per il parsing dei tool arguments (Suggerimento docente)
        let args;
        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (parseError) {
          console.error("❌ Errore durante il parsing degli argomenti del tool LLM:", parseError.message);
          return res.status(400).json({ 
            error: "Il modello AI ha generato argomenti per la funzione non validi.",
            details: parseError.message 
          });
        }
       
        const emissionResult = await fetchEcoFreightEmissions(args);

        apiMessages.push(assistantMessage);
        apiMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(emissionResult),
        });
        
        const finalResponse = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: apiMessages,
        });

        assistantMessage = finalResponse.choices[0].message;
      }
    }

    chatSession.messages.push({ role: 'assistant', content: assistantMessage.content });
    await chatSession.save();

    return res.json({
      chatId,
      response: assistantMessage.content
    });

  } catch (error) {
    console.error("❌ Errore durante l'elaborazione della chat:", error);
    return res.status(500).json({ error: "Si è verificato un errore interno nel server." });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server di Orizon in ascolto sulla porta ${PORT}`);
});
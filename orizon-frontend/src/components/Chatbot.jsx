import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, ChevronRight } from 'lucide-react';

// Importazioni relative all'interno della stessa cartella 'components'
import Sidebar from './Sidebar';
import ChatMessage from './ChatMessage';
import '../App.css'; // Importa App.css che sta nella cartella padre (src)

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Ciao! Sono l\'assistente eco-consapevole di Orizon. 🌿 Dimmi pure: dove hai intenzione di viaggiare, con quale mezzo e che peso avranno i tuoi bagagli? Ti aiuterò a calcolare l\'impatto di CO₂ per fare una scelta responsabile!'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const messagesEndRef = useRef(null);

  const quickSuggestions = [
    { label: "Milano ➔ Parigi in Treno", text: "Voglio andare da Milano a Parigi in treno con un bagaglio di 20kg" },
    { label: "Roma ➔ NY in Aereo", text: "Devo andare da Roma a New York in aereo, bagaglio da 23kg" },
    { label: "Barcellona ➔ Madrid in Auto", text: "Viaggio da Barcellona a Madrid in auto con 10kg di bagaglio" }
  ];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const uniqueId = 'chat_' + Math.random().toString(36).substring(2, 9);
    setChatId(uniqueId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    if (!textToSend.trim() || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: textToSend }]);
    setLoading(true);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://orizon-backend1.onrender.com';

      const response = await axios.post(`${backendUrl}/api/chat`, {
        chatId,
        message: textToSend
      });

      let botResponse = response.data.response;
      let extractedData = null;

      if (botResponse.includes('[DATA_START]')) {
        const parts = botResponse.split('[DATA_START]');
        botResponse = parts[0].trim();
        const jsonPart = parts[1].split('[DATA_END]')[0].trim();
        try {
          extractedData = JSON.parse(jsonPart);
        } catch (e) {
          console.error("Errore nel parsing dei dati viaggio", e);
        }
      }

      setMessages((prev) => [...prev, { 
        role: 'assistant', 
        content: botResponse,
        data: extractedData 
      }]);

    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Errore di connessione. Riprova! 🌍' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Sidebar isMobile={isMobile} />

      <div className="chat-container">
        {!isMobile && (
          <div className="chat-header">
            <Bot size={24} color="#ffffff" />
            <div style={{ marginLeft: '12px' }}>
              <h2 className="chat-title">Calcolatore CO₂ Conversazionale</h2>
              <span className="chat-status">Agent Attivo • Ottimizzazione Context Window Abilitata</span>
            </div>
          </div>
        )}

        <div className="messages-window">
          {messages.map((msg, index) => (
            <ChatMessage key={index} msg={msg} isMobile={isMobile} />
          ))}
          {loading && <ChatMessage isLoading={true} isMobile={isMobile} />}
          <div ref={messagesEndRef} />
        </div>

        <div className="suggestions-container">
          {quickSuggestions.map((sug, i) => (
            <button 
              key={i} 
              onClick={() => setInput(sug.text)} 
              className="sug-button" 
              disabled={loading}
            >
              {sug.label} <ChevronRight size={10} style={{ marginLeft: '2px' }} />
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); setInput(''); }} className="input-area">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isMobile ? "Chiedi il calcolo CO₂..." : "Descrivi il tuo viaggio o clicca su una scelta rapida..."}
            className="input-field"
            disabled={loading}
          />
          <button type="submit" className="send-button" disabled={loading || !input.trim()}>
            <Send size={isMobile ? 14 : 18} color="#ffffff" />
          </button>
        </form>
      </div>
    </div>
  );
}
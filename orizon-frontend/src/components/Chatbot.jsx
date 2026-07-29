import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Leaf, User, Bot, Loader2, Table, ChevronRight, BarChart3, ShieldCheck, Cpu } from 'lucide-react';

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
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const uniqueId = 'chat_' + Math.random().toString(36).substr(2, 9);
    setChatId(uniqueId);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div style={{ ...styles.container, flexDirection: isMobile ? 'column' : 'row' }}>
      
      <div style={{ 
        ...styles.sidebar, 
        width: isMobile ? '100%' : '30%', 
        height: isMobile ? 'auto' : '100%',
        padding: isMobile ? '15px 20px' : '35px 25px',
        borderRight: isMobile ? 'none' : '1px solid #e0e0e0',
        borderBottom: isMobile ? '1px solid #e0e0e0' : 'none',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'flex-start', width: '100%' }}>
          <div style={styles.brandContainer}>
            <Leaf size={isMobile ? 24 : 36} color="#2e7d32" />
            <h1 style={{ ...styles.brandTitle, fontSize: isMobile ? '20px' : '26px' }}>Orizon</h1>
          </div>
          {isMobile && <span style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>Eco-Travel Assistant</span>}
        </div>
        
        {!isMobile && (
          <div style={styles.sidebarScrollContent}>
            <p style={styles.brandTagline}>"Leave nothing but footprints, take nothing but memories"</p>
            
            <div style={styles.infoCard}>
              <div style={styles.cardHeaderSmall}><BarChart3 size={16} color="#2e7d32" /> <b>Community Impact (Mese Corrente)</b></div>
              <div style={styles.statGrid}>
                <div>
                  <span style={styles.statNumber}>14.2 t</span>
                  <span style={styles.statLabel}>CO₂ Evitata</span>
                </div>
                <div>
                  <span style={styles.statNumber}>712</span>
                  <span style={styles.statLabel}>Alberi Piantati</span>
                </div>
              </div>
            </div>

            <div style={styles.infoCard}>
              <div style={styles.cardHeaderSmall}><ShieldCheck size={16} color="#2e7d32" /> <b>Come Interagire con l'Agente AI</b></div>
              <ul style={styles.instructionsList}>
                <li>Fornisci liberamente dettagli sul tuo viaggio (Mezzo, Partenza, Destinazione, Peso bagaglio).</li>
                <li>L'AI Agent è multilingue: parlerà in automatico la tua lingua.</li>
                <li>Se dimentichi delle informazioni, l'AI ti guiderà passo-passo per completare i parametri necessari.</li>
              </ul>
            </div>

            <div style={{ ...styles.infoCard, backgroundColor: '#fafafa', borderLeft: '4px solid #757575' }}>
              <div style={{ ...styles.cardHeaderSmall, color: '#555' }}><Cpu size={16} color="#757575" /> <b>Architettura Certificata MERN+AI</b></div>
              <div style={styles.techBadgesContainer}>
                <span style={styles.techBadge}>React 18</span>
                <span style={styles.techBadge}>Node.js</span>
                <span style={styles.techBadge}>OpenAI GPT-4o</span>
                <span style={styles.techBadge}>MongoDB Atlas</span>
                <span style={styles.techBadge}>EcoFreight API</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ ...styles.chatContainer, width: isMobile ? '100%' : '70%', height: isMobile ? 'calc(100vh - 58px)' : '100%' }}>
        {!isMobile && (
          <div style={styles.chatHeader}>
            <Bot size={24} color="#ffffff" />
            <div style={{ marginLeft: '12px' }}>
              <h2 style={styles.chatTitle}>Calcolatore CO₂ Conversazionale</h2>
              <span style={styles.chatStatus}>Agent Attivo • Ottimizzazione Context Window Abilitata</span>
            </div>
          </div>
        )}

        <div style={{ ...styles.messagesWindow, padding: isMobile ? '15px' : '30px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ ...styles.messageRow, flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', width: '100%', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {msg.role !== 'user' && <div style={{ ...styles.avatar, backgroundColor: '#e8f5e9' }}><Bot size={18} color="#2e7d32" /></div>}
                <div style={{ 
                  ...styles.messageBubble, 
                  backgroundColor: msg.role === 'user' ? '#2e7d32' : '#ffffff', 
                  color: msg.role === 'user' ? '#ffffff' : '#333333', 
                  border: msg.role === 'user' ? 'none' : '1px solid #e0e0e0',
                  maxWidth: isMobile ? '85%' : '75%'
                }}>
                  <p style={{ margin: 0, whiteSpace: 'pre-line', fontSize: isMobile ? '14px' : '15px' }}>{msg.content}</p>
                </div>
                {msg.role === 'user' && <div style={{ ...styles.avatar, backgroundColor: '#e0f2f1' }}><User size={18} color="#00796b" /></div>}
              </div>

              {msg.data && (
                <div style={{ ...styles.tableContainer, width: isMobile ? '95%' : '72%', marginLeft: isMobile ? '0px' : '42px', alignSelf: isMobile ? 'center' : 'auto' }}>
                  <div style={styles.tableHeader}><Table size={14} /> <span>Riepilogo Impatto Ambientale</span></div>
                  <table style={styles.table}>
                    <tbody>
                      <tr><td style={styles.tdLabel}>Tratta:</td><td style={styles.tdValue}>{msg.data.origin} ➔ {msg.data.destination}</td></tr>
                      <tr><td style={styles.tdLabel}>Dettagli:</td><td style={styles.tdValue}>{msg.data.transport} ({msg.data.weight} kg)</td></tr>
                      <tr style={{ backgroundColor: '#e8f5e9' }}><td style={styles.tdLabel}><b>Emissioni:</b></td><td style={{ ...styles.tdValue, color: '#1b5e20', fontWeight: 'bold' }}>{msg.data.co2} kg CO₂</td></tr>
                      <tr><td style={styles.tdLabel}>Compensazione:</td><td style={styles.tdValue}>🌳 {msg.data.trees} alberi da piantare</td></tr>
                      {msg.data.best_alternative && (
                        <tr style={{ backgroundColor: '#fff8e1' }}><td style={styles.tdLabel}>💡 Alternativa:</td><td style={{ ...styles.tdValue, color: '#b78103', fontSize: '12px', lineHeight: '1.3' }}>{msg.data.best_alternative}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.messageRow, justifyContent: 'flex-start' }}>
              <div style={{ ...styles.avatar, backgroundColor: '#e8f5e9' }}><Bot size={18} color="#2e7d32" /></div>
              <div style={{ ...styles.messageBubble, backgroundColor: '#f5f5f5', color: '#757575', display: 'flex', alignItems: 'center', fontSize: isMobile ? '13px' : '14px' }}>
                <Loader2 size={14} className="animate-spin" style={{ marginRight: '6px' }} />
                Elaborazione impatto...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ ...styles.suggestionsContainer, padding: isMobile ? '10px 15px' : '12px 30px' }}>
          {quickSuggestions.map((sug, i) => (
            <button key={i} onClick={() => { setInput(sug.text); }} style={styles.sugButton} disabled={loading}>
              {sug.label} <ChevronRight size={10} style={{ marginLeft: '2px' }} />
            </button>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSend(input); setInput(''); }} style={{ ...styles.inputArea, padding: isMobile ? '12px 15px' : '20px 30px' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isMobile ? "Chiedi il calcolo CO₂..." : "Descrivi il tuo viaggio o clicca su una scelta rapida..."}
            style={{ ...styles.inputField, padding: isMobile ? '10px 15px' : '15px 20px', fontSize: isMobile ? '14px' : '15px' }}
            disabled={loading}
          />
          <button type="submit" style={{ ...styles.sendButton, width: isMobile ? '40px' : '48px', height: isMobile ? '40px' : '48px' }} disabled={loading || !input.trim()}>
            <Send size={isMobile ? 14 : 18} color="#ffffff" />
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', width: '100vw', height: '100vh', backgroundColor: '#f4f6f4', fontFamily: 'system-ui, sans-serif', overflow: 'hidden' },
  sidebar: { backgroundColor: '#ffffff', boxSizing: 'border-box', overflowY: 'auto' },
  sidebarScrollContent: { display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, marginTop: '10px' },
  brandContainer: { display: 'flex', alignItems: 'center' },
  brandTitle: { color: '#1b5e20', margin: '0 0 0 10px', fontWeight: '700' },
  brandTagline: { fontSize: '13px', fontStyle: 'italic', color: '#666', lineHeight: '1.4', margin: '0 0 10px 0' },
  
  infoCard: { backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e6eae6', borderLeft: '4px solid #2e7d32', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' },
  cardHeaderSmall: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#2e7d32', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' },
  statGrid: { display: 'flex', gap: '20px', marginTop: '5px' },
  statNumber: { display: 'block', fontSize: '20px', fontWeight: 'bold', color: '#1b5e20' },
  statLabel: { fontSize: '11px', color: '#666' },
  instructionsList: { paddingLeft: '16px', margin: 0, fontSize: '12px', color: '#444', lineHeight: '1.5', display: 'flex', flexDirection: 'column', gap: '6px' },
  techBadgesContainer: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '5px' },
  techBadge: { backgroundColor: '#eeeeee', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', color: '#444', fontWeight: '500' },

  chatContainer: { display: 'flex', flexDirection: 'column' },
  chatHeader: { backgroundColor: '#2e7d32', padding: '20px 30px', display: 'flex', alignItems: 'center', color: '#ffffff' },
  chatTitle: { margin: 0, fontSize: '18px', fontWeight: '600' },
  chatStatus: { fontSize: '12px', color: '#c8e6c9', opacity: 0.9 },
  messagesWindow: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' },
  messageRow: { display: 'flex', width: '100%', gap: '8px' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  messageBubble: { padding: '12px 18px', borderRadius: '16px', lineHeight: '1.5', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' },
  
  tableContainer: { border: '1px solid #e0e0e0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', backgroundColor: '#ffffff' },
  tableHeader: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f5f5f5', padding: '10px 14px', fontSize: '12px', fontWeight: 'bold', color: '#555', borderBottom: '1px solid #e0e0e0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  tdLabel: { padding: '8px 12px', color: '#666', width: '35%', borderBottom: '1px solid #f0f0f0' },
  tdValue: { padding: '8px 12px', color: '#222', borderBottom: '1px solid #f0f0f0' },

  suggestionsContainer: { display: 'flex', gap: '8px', overflowX: 'auto', backgroundColor: '#ffffff', borderTop: '1px solid #f0f0f0', WebkitOverflowScrolling: 'touch' },
  sugButton: { backgroundColor: '#f0f4f0', border: '1px solid #d0ded0', borderRadius: '20px', padding: '6px 12px', fontSize: '11px', color: '#2e7d32', cursor: 'pointer', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' },
  
  inputArea: { backgroundColor: '#ffffff', borderTop: '1px solid #e0e0e0', display: 'flex', gap: '10px', alignItems: 'center' },
  inputField: { flex: 1, borderRadius: '25px', border: '1px solid #cccccc', outline: 'none' },
  sendButton: { backgroundColor: '#2e7d32', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }
};

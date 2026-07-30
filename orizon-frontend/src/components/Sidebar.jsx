import React from 'react';
import { Leaf, BarChart3, ShieldCheck, Cpu } from 'lucide-react';

export default function Sidebar({ isMobile }) {
  return (
    <div className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'space-between' : 'flex-start', width: '100%' }}>
        <div className="brand-container">
          <Leaf size={isMobile ? 24 : 36} color="#2e7d32" />
          <h1 className="brand-title">Orizon</h1>
        </div>
        {isMobile && <span style={{ fontSize: '11px', color: '#666', fontStyle: 'italic' }}>Eco-Travel Assistant</span>}
      </div>

      {!isMobile && (
        <div className="sidebar-scroll-content">
          <p className="brand-tagline">"Leave nothing but footprints, take nothing but memories"</p>
          
          <div className="info-card">
            <div className="card-header-small"><BarChart3 size={16} color="#2e7d32" /> <b>Community Impact (Mese Corrente)</b></div>
            <div className="stat-grid">
              <div>
                <span className="stat-number">14.2 t</span>
                <span className="stat-label">CO₂ Evitata</span>
              </div>
              <div>
                <span className="stat-number">712</span>
                <span className="stat-label">Alberi Piantati</span>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header-small"><ShieldCheck size={16} color="#2e7d32" /> <b>Come Interagire con l'Agente AI</b></div>
            <ul className="instructions-list">
              <li>Fornisci liberamente dettagli sul tuo viaggio (Mezzo, Partenza, Destinazione, Peso bagaglio).</li>
              <li>L'AI Agent è multilingue: parlerà in automatico la tua lingua.</li>
              <li>Se dimentichi delle informazioni, l'AI ti guiderà passo-passo per completare i parametri necessari.</li>
            </ul>
          </div>

          <div className="info-card tech">
            <div className="card-header-small" style={{ color: '#555' }}><Cpu size={16} color="#757575" /> <b>Architettura Certificata MERN+AI</b></div>
            <div className="tech-badges-container">
              <span className="tech-badge">React 18</span>
              <span className="tech-badge">Node.js</span>
              <span className="tech-badge">OpenAI GPT-4o</span>
              <span className="tech-badge">MongoDB Atlas</span>
              <span className="tech-badge">EcoEngine API</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
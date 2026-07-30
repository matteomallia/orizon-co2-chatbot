import React from 'react';
import { User, Bot, Loader2 } from 'lucide-react';
import ImpactTable from './ImpactTable';

export default function ChatMessage({ msg, isLoading, isMobile }) {
  if (isLoading) {
    return (
      <div className="message-row assistant">
        <div className="message-wrapper assistant">
          <div className="avatar assistant"><Bot size={18} color="#2e7d32" /></div>
          <div className="message-bubble loading">
            <Loader2 size={14} className="animate-spin" style={{ marginRight: '6px' }} />
            Elaborazione impatto...
          </div>
        </div>
      </div>
    );
  }

  const isUser = msg.role === 'user';

  return (
    <div className={`message-row ${isUser ? 'user' : 'assistant'}`}>
      <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}>
        {!isUser && (
          <div className="avatar assistant"><Bot size={18} color="#2e7d32" /></div>
        )}
        <div className={`message-bubble ${isUser ? 'user' : 'assistant'}`}>
          <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{msg.content}</p>
        </div>
        {isUser && (
          <div className="avatar user"><User size={18} color="#00796b" /></div>
        )}
      </div>

      {msg.data && <ImpactTable data={msg.data} />}
    </div>
  );
}
import React from 'react';
import * as Sentry from '@sentry/react';
import Chatbot from './components/Chatbot';

// Componente di test fornito da Sentry per verificare l'Error Tracking
function ErrorButton() {
  return (
    <button
      onClick={() => {
        throw new Error('This is your first error!');
      }}
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        padding: '8px 12px',
        background: '#e1567c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      Break the world
    </button>
  );
}

function App() {
  return (
    <div className="App">
      <ErrorButton />
      <Chatbot />
    </div>
  );
}

export default App;
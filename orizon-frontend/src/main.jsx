import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from "@sentry/react"
import './index.css'
import App from './App.jsx'

// Inizializzazione di Sentry per Error Tracking
Sentry.init({
  dsn: "https://a33cbc6fda97bf909e7158cfdb1e6085@o4511823495823360.ingest.de.sentry.io/4511823500476496",
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  // Sample rate per il performance monitoring (1.0 = 100% delle transazioni)
  tracesSampleRate: 1.0,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
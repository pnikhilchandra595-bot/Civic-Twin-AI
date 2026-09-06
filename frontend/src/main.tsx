import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CalibratedTwinApp } from './CalibratedTwinApp.tsx'
import './index.css'

const isCalibratedRoute = 
  typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/calibrated') || 
    window.location.pathname.includes('calibrated.html') ||
    window.location.search.includes('mode=calibrated') ||
    window.location.search.includes('calibrated=true')
  );

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isCalibratedRoute ? <CalibratedTwinApp /> : <App />}
  </React.StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Optimisations de performance et prévention du cache
if (import.meta.env.DEV) {
  // En développement, forcer le rechargement des modules
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('/src/')) {
      args[0] = url + (url.includes('?') ? '&' : '?') + '_t=' + Date.now();
    }
    return originalFetch.apply(this, args);
  };
}

// Optimisation du rendu React
const root = ReactDOM.createRoot(document.getElementById('root')!);

// Force le re-rendu en cas de mise à jour
const renderApp = () => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

// Re-rendu automatique en cas de changement de version
let currentVersion = '1.0.0';
const checkForUpdates = () => {
  const newVersion = document.querySelector('meta[name="version"]')?.getAttribute('content');
  if (newVersion && newVersion !== currentVersion) {
    currentVersion = newVersion;
    renderApp();
  }
};

// Vérifier les mises à jour toutes les 30 secondes
setInterval(checkForUpdates, 30000);

renderApp();

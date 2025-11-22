import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Optimisations de performance
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

// Rendu optimisé - pas de StrictMode en production pour éviter les doubles rendus
if (import.meta.env.DEV) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
} else {
  // En production, éviter StrictMode pour de meilleures performances
  root.render(<App />);
}

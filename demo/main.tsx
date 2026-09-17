import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// The library stylesheet, exactly as a consumer would import it.
import '../src/styles/index.css';
// Demo-only global styles (reset, page layout, documentation chrome).
import './demo.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

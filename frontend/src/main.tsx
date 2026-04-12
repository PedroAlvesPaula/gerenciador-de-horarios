import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './locales/i18n';
import App from './App/App.view'

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

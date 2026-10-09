import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ModalProvider } from './hooks/ModalProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <App />
      </ModalProvider>
    </BrowserRouter>
  </StrictMode>,
)

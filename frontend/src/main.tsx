import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClientProvider } from '@/context/ClientContext'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* BrowserRouter maneja la navegación entre rutas */}
    <BrowserRouter>
      {/* ClientProvider hace que el cliente seleccionado
          esté disponible en cualquier componente de la app */}
      <ClientProvider>
        <App />
      </ClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { StoreContextProvider } from './store.jsx'
import App from './components/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreContextProvider>
      <App />
    </StoreContextProvider>
  </StrictMode>,
)

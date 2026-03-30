import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'
import { ThemeProvider } from './lib/theme-context';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)


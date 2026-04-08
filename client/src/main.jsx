import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from "react-hot-toast";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#111827',
              color: '#f9fafb',
              border: '1px solid #374151',
              borderRadius: '12px',
              padding: '16px 20px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
              style: {
                background: '#111827',
                color: '#f9fafb',
                border: '1px solid #374151',
              },
            },
            error: {
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #ef4444',
              },
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
  </StrictMode>,
)

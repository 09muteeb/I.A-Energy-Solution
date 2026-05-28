import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { TRPCProvider } from '@/providers/trpc'
import { CartProvider } from '@/context/CartContext'
import ToastContainer from '@/components/ToastContainer'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <TRPCProvider>
      <CartProvider>
        <ToastContainer>
          <App />
        </ToastContainer>
      </CartProvider>
    </TRPCProvider>
  </BrowserRouter>
)
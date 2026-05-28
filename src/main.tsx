import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { TRPCProvider } from '@/providers/trpc'
import { CartProvider } from '@/context/CartContext'
import ToastContainer from '@/components/ToastContainer'
// @ts-ignore: side-effect import for global CSS
import './index.css'
import App from './App'

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
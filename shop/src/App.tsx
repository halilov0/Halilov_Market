import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { ToastHost } from './components/Toast'
import { CatalogPage } from './pages/CatalogPage'
import { ProductPage } from './pages/ProductPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { useAuth } from './auth/authStore'

function App() {
  const fetchMe = useAuth(s => s.fetchMe)
  const loc = useLocation()

  useEffect(() => {
    fetchMe()
  }, [fetchMe])

  // Auth pages render their own split layout (no global header)
  const hideHeader = loc.pathname === '/login' || loc.pathname === '/register'

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/p/:slug" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders/:orderNumber" element={<OrderConfirmationPage />} />
        <Route path="*" element={<div className="hm-page"><h1>404</h1></div>} />
      </Routes>
      <ToastHost />
    </>
  )
}

export default App

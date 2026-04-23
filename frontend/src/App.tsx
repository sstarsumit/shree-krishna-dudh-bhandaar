import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthSuccess from './pages/AuthSuccess';
import CompleteProfile from './pages/CompleteProfile';
import { useAuthStore } from './context/authStore';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCustomers from './pages/admin/AdminCustomers';
import AccessDenied from './pages/admin/AccessDenied';
import MyOrdersPage from './pages/MyOrdersPage';

function AppRoutes() {
  const { loadUser, isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
            {/* Main Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/success" element={<AuthSuccess />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/myorders" element={<MyOrdersPage />} />

            {/* Admin Routes */}
            <Route path="/admin" element={isAuthenticated && user?.role === 'admin' ? <AdminDashboard /> : <AccessDenied />} />
            <Route path="/admin/orders" element={isAuthenticated && user?.role === 'admin' ? <AdminOrders /> : <AccessDenied />} />
            <Route path="/admin/products" element={isAuthenticated && user?.role === 'admin' ? <AdminProducts /> : <AccessDenied />} />
            <Route path="/admin/customers" element={isAuthenticated && user?.role === 'admin' ? <AdminCustomers /> : <AccessDenied />} />
          </Routes>
        </main>
        {!isAdminRoute && <Footer />}
      </div>
    );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

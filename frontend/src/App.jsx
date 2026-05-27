import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import useProducts from './hooks/useProducts';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CustomerStorePage from './pages/CustomerStorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const {
    isAdmin,
    authChecking,
    loading: authLoading,
    error: authError,
    login: authLogin,
    logout: authLogout,
  } = useAuth();

  const {
    products,
    loading: productsLoading,
    error: productsError,
    success: productsSuccess,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useProducts();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const success = await authLogin(adminEmail, adminPassword);
    if (success) {
      setAdminEmail('');
      setAdminPassword('');
    }
  };

  const handleAdminLogout = async () => {
    await authLogout();
  };

  const handleAddProduct = async (formData) => addProduct(formData);

  const handleUpdateProduct = async (productId, formData) => updateProduct(productId, formData);

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return false;
    return deleteProduct(productId);
  };

  if (authChecking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          color: '#e2e8f0',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        Loading secure session...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <CustomerStorePage
              products={products}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              loading={productsLoading}
              error={productsError}
            />
          }
        />
        <Route
          path="/admin/login"
          element={
            isAdmin ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <AdminLoginPage
                email={adminEmail}
                password={adminPassword}
                onEmailChange={setAdminEmail}
                onPasswordChange={setAdminPassword}
                onSubmit={handleAdminLogin}
                loading={authLoading}
                error={authError}
              />
            )
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
        <Route
          path="/admin/dashboard"
          element={
            isAdmin ? (
              <AdminDashboardPage
                products={products}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onLogout={handleAdminLogout}
                loading={productsLoading || authLoading}
                error={productsError || authError}
                success={productsSuccess}
              />
            ) : (
              <Navigate to="/admin/login" replace />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
}
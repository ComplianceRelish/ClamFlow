import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginPage } from './components/LoginPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Dashboard } from './pages/Dashboard';
import { RawMaterialForm } from './pages/RawMaterialForm';
import { LotCreationPage } from './pages/LotCreation';
import { ProcessingForm } from './pages/ProcessingForm';
import { FinalPackingForm } from './pages/FinalPackingForm';
import { QualityControl } from './pages/QualityControl';
import { AdminPanel } from './pages/AdminPanel';
import { useAuthStore } from './store/authStore';
import { Home } from './pages/Home';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
        } />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={['admin', 'supervisor', 'management']}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/raw-material" element={
          <ProtectedRoute allowedRoles={['operator']}>
            <Layout>
              <RawMaterialForm />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/lot-creation" element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <Layout>
              <LotCreationPage />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/processing/:lotId" element={
          <ProtectedRoute allowedRoles={['operator']}>
            <Layout>
              <ProcessingForm />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/final-packing/:lotId" element={
          <ProtectedRoute allowedRoles={['operator']}>
            <Layout>
              <FinalPackingForm />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/quality" element={
          <ProtectedRoute allowedRoles={['quality']}>
            <Layout>
              <QualityControl />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminPanel />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
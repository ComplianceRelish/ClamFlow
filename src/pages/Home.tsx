import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { OperatorDashboard } from '../components/OperatorDashboard';
import { ProductionDashboard } from '../components/ProductionDashboard';

export function Home() {
  const { user } = useAuthStore();

  if (!user) return null;

  // Show operator dashboard for operators
  if (user.role === 'operator') {
    return <OperatorDashboard />;
  }

  // Show production dashboard for supervisors, management, and admin
  if (['supervisor', 'management', 'admin'].includes(user.role)) {
    return <ProductionDashboard />;
  }

  // Show quality dashboard for quality control users
  if (user.role === 'quality') {
    return <Navigate to="/quality" replace />;
  }

  return null;
}
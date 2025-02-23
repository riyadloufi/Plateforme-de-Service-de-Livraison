import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const isAdmin = useSelector(state => state.isAdmin);

  if (!isAdmin) {
    return <Navigate to="/admin/login" />;
  }

  return children;
} 
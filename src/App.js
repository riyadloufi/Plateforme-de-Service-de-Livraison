import React, { useState } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from './component/logIn-singIn/SignUp';
import LogIn from './component/logIn-singIn/logIn';
import Home from "./component/client side/home/Home";
import ManageAds from "./component/client side/Manage/ManageAds";
import ViewAds from "./component/client side/View/ViewAds";
import Profile from './component/client side/profil/Profil';
import AdminLogin from './component/admin side/AdminLogin';
import AdminRoute from './component/admin side/AdminRoute';
import PrivateRoute from './component/routes/PrivateRoute';
import AdminSidebar from './component/admin side/AdminSidebar';
import PendingAds from './component/admin side/PendingAds';
import PublishedAds from './component/admin side/PublishedAds';
import UserManagement from './component/admin side/UserManagement';
import { useSelector } from 'react-redux';
import Navbar from './component/NavBar/NavBar';
import { useLocation } from 'react-router-dom';

export default function App() {
  const isAdmin = useSelector(state => state.isAdmin);
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);

  // Ne pas afficher la navbar sur la page de login admin
  const hideNavbar = location.pathname === '/admin/login';

  return (
    <div className="app">
      {isAdmin ? (
        <div className="admin-layout">
          {showSidebar && <AdminSidebar />}
          <div className="admin-content">
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/pending-ads" element={
                <AdminRoute>
                  <PendingAds />
                </AdminRoute>
              } />
              <Route path="/admin/published-ads" element={
                <AdminRoute>
                  <PublishedAds />
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <UserManagement />
                </AdminRoute>
              } />
              <Route path="*" element={<Navigate to="/admin/pending-ads" />} />
            </Routes>
          </div>
        </div>
      ) : (
        <>
          {!hideNavbar && <Navbar />}
          <Routes>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/view-ads" element={<ViewAds />} />
            <Route path="/manage-ads" element={
              <PrivateRoute>
                <ManageAds />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
          </Routes>
        </>
      )}
    </div>
  );
}
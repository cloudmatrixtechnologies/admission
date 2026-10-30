// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import CollegesPage from './pages/CollegesPage'; // <-- Add this import
import AdminLoginPage from './pages/auth/AdminLoginPage';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';

function SuperAdminWrapper() {
  const navigate = useNavigate();
  return <SuperAdminDashboard onLogout={() => navigate('/login')} />;
}

export default function App() {
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* 1. Prabhu: Student Public Website */}
        <Route
          path="/"
          element={
            <div className="app-shell">
              <Navbar wishlistCount={wishlistCount} />
              <main className="main-content">
                <HomePage onWishlistUpdate={setWishlistCount} />
              </main>
              <Footer />
            </div>
          }
        />

        {/* 2. Prabhu: Colleges Catalog Page */}
        <Route
          path="/colleges"
          element={
            <div className="app-shell">
              <Navbar wishlistCount={wishlistCount} />
              <main className="main-content">
                <CollegesPage onWishlistUpdate={setWishlistCount} />
              </main>
              <Footer />
            </div>
          }
        />

        {/* 3. Dhanush: Auth & Dashboards (Unchanged) */}
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/superadmin" element={<SuperAdminWrapper />} />
        <Route path="/admin/super-admin" element={<SuperAdminWrapper />} />
        <Route path="/admin" element={<SuperAdminWrapper />} />
      </Routes>
    </Router>
  );
}
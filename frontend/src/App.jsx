import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import './App.css';

// SuperAdmin wrapper to pass logout handler with router navigation
function SuperAdminWrapper() {
  const navigate = useNavigate();
  return <SuperAdminDashboard onLogout={() => navigate('/login')} />;
}

export default function App() {
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Admin Login Page */}
        <Route path="/login" element={<AdminLoginPage />} />

        {/* Super Admin Dashboard */}
        <Route path="/superadmin" element={<SuperAdminWrapper />} />

        {/* Public Home Page */}
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
      </Routes>
    </Router>
  );
}
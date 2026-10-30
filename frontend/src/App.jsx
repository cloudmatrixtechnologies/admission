import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// 1. Prabhu: Student Public Website Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import CollegesPage from './pages/CollegesPage';

// 2. Dhanush: Admin Auth Component
import AdminLoginPage from './pages/auth/AdminLoginPage';

// 3. Dhanush: Admin Dashboards & Role Pages
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';


// ==========================================
// Role Wrappers with Router Logout Handlers
// ==========================================
function SuperAdminWrapper() {
  const navigate = useNavigate();
  return <SuperAdminDashboard onLogout={() => navigate('/login')} />;
}

function ManagerAdminWrapper() {
  const navigate = useNavigate();
  return <ManagerDashboard onLogout={() => navigate('/login')} />;
}

export default function App() {
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* ======================================================== */}
        {/* 1. Prabhu: Student Public Website Routes                 */}
        {/* ======================================================== */}
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

        {/* ======================================================== */}
        {/* 2. Dhanush: Admin Authentication (Login Viewport)        */}
        {/* ======================================================== */}
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* ======================================================== */}
        {/* 3. Dhanush: Super Admin Portal Routes                    */}
        {/* ======================================================== */}
        <Route path="/superadmin" element={<SuperAdminWrapper />} />
        <Route path="/admin/super-admin" element={<SuperAdminWrapper />} />
        <Route path="/admin" element={<SuperAdminWrapper />} />
        <Route path="/super-admin/dashboard" element={<SuperAdminWrapper />} />

        {/* ======================================================== */}
        {/* 4. Dhanush: Manager Admin Portal Routes                  */}
        {/* ======================================================== */}
        <Route path="/manager" element={<ManagerAdminWrapper />} />
        <Route path="/admin/manager" element={<ManagerAdminWrapper />} />
    


        {/* Fallback route */}
        <Route path="*" element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
}
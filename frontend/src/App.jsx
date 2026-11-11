
// src/App.jsx
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

// 1. Prabhu: Student Public Website Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import CollegesPage from './pages/CollegesPage';

import CollegeDetailsPage from './pages/CollegeDetailsPage'; // <-- Integrated College Details View
import CollegeCoursesPage from './pages/CollegeCoursesPage';
import WishlistPage from './pages/WishlistPage';
import StudentSignInPage from './pages/auth/StudentSignInPage'; // <-- Added Student Sign-In Page

import CollegeDetailsPage from './pages/CollegeDetailsPage';


// 2. Dhanush: Admin Auth Components
import AdminLoginPage from './pages/auth/AdminLoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// 3. Dhanush: Admin Dashboards & Role Pages
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import TelecallerDashboard from './pages/telecaller/TelecallerDashboard';


import CollegeAdminDashboard from './pages/college-admin/CollegeAdminDashboard'; // <--- College Admin Import


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

// Telecaller Logout Wrapper
function TelecallerWrapper() {
  const navigate = useNavigate();
  return <TelecallerDashboard onLogout={() => navigate('/login')} />;
}

// College Admin Logout Wrapper
function CollegeAdminWrapper() {
  const navigate = useNavigate();
  return <CollegeAdminDashboard onLogout={() => navigate('/login')} />; // <--- College Admin Wrapper
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

        {/* Dynamic Detail Route */}
        <Route
          path="/colleges/:id"
          element={
            <div className="app-shell">
              <Navbar wishlistCount={wishlistCount} />
              <main className="main-content">
                <CollegeDetailsPage onWishlistUpdate={setWishlistCount} />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Dedicated View Courses Route: Matches "/colleges/:collegeId/courses" */}
        <Route
          path="/colleges/:collegeId/courses"
          element={
            <div className="app-shell">
              <Navbar wishlistCount={wishlistCount} />
              <main className="main-content">
                <CollegeCoursesPage />
              </main>
              <Footer />
            </div>
          }
        />

        {/* Dedicated Student Sign In & Register Page */}
        <Route
          path="/student/login"
          element={
            <div className="app-shell">
              <Navbar wishlistCount={wishlistCount} />
              <main className="main-content">
                <StudentSignInPage />
              </main>
              <Footer />
            </div>
          }
        />
        <Route
  path="/wishlist"
  element={
    <div className="app-shell">
      <Navbar wishlistCount={wishlistCount} />
      <main className="main-content">
        <WishlistPage onWishlistUpdate={setWishlistCount} />
      </main>
      <Footer />
    </div>
  }
/>

        {/* ======================================================== */}
        {/* 2. Dhanush: Admin Authentication (Login & Recovery)      */}
        {/* ======================================================== */}
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

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

        {/* ======================================================== */}
        {/* 5. Dhanush: Telecaller Portal Routes                     */}
        {/* ======================================================== */}
        <Route path="/telecaller" element={<TelecallerWrapper />} />
        <Route path="/telecaller/dashboard" element={<TelecallerWrapper />} />

        {/* ======================================================== */}
        {/* 6. Dhanush: College Admin Portal Routes                  */}
        {/* ======================================================== */}
        <Route path="/college-admin" element={<CollegeAdminWrapper />} />
        <Route path="/college-admin/dashboard" element={<CollegeAdminWrapper />} />

        {/* Fallback route */}
        <Route path="*" element={<AdminLoginPage />} />
      </Routes>
    </Router>
  );
}
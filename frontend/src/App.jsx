// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import './App.css';

export default function App() {
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <Router>
      <Routes>
        {/* Admin Login Page: Thaniya open aagum (No Navbar/Footer) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Home Page: Navbar, Footer kooda load aagum */}
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
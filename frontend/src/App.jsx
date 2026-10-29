
// src/App.jsx
import React, { useState } from 'react';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import './App.css';

export default function App() {
  const [wishlistCount, setWishlistCount] = useState(0);

  return (
    <div className="app-shell">
      <Navbar wishlistCount={wishlistCount} />
      <main className="">
        <HomePage onWishlistUpdate={setWishlistCount} />
      </main>
      <Footer />
    </div>
  );
  //demo check
  <h1>demo</h1>
}
=======
<h1>hello, World!</h1>


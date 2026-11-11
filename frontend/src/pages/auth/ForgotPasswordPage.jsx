import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setStatusMsg({ type: 'error', text: 'Per piacè inserite un indirizzu email validu.' });
      return;
    }

    // Simulazione di mandamentu di u ligame
    setStatusMsg({
      type: 'success',
      text: 'U ligame per resettà a vostra password hè statu inviatu cù successu!',
    });
  };

  return (
    <div className="fp-viewport">
      {/* Intestatura Logò è Titulu di a Marca */}
      <div className="fp-brand-header">
        <div className="fp-brand-icon">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>
        <div>
          <h1 className="fp-brand-title">
            Admizan <span>Panel</span>
          </h1>
          <p className="fp-brand-sub"></p>
        </div>
      </div>

      {/* Carta Centrale Bianca */}
      <div className="fp-card">
        <h5 className="fp-heading">Forgot Password?</h5>
        <p className="fp-desc">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>

        {statusMsg.text && (
          <div className={`fp-alert ${statusMsg.type}`}>
            {statusMsg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="fp-form">
          <label className="fp-label">Email Address</label>
          <div className="fp-input-wrapper">
            <span className="fp-input-icon">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="fp-input"
              required
            />
          </div>

          <button type="submit" className="fp-submit-btn">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            <span>Send Reset Link</span>
          </button>
        </form>

        <a
          href="/login"
          onClick={(e) => {
            e.preventDefault();
            navigate('/login');
          }}
          className="fp-back-link"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Back to Login</span>
        </a>
      </div>
    </div>
  );
}
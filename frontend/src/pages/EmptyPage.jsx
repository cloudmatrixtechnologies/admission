// src/pages/EmptyPage.jsx
import React from 'react';

export default function EmptyPage({ title }) {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          width: '54px',
          height: '54px',
          borderRadius: '12px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          marginBottom: '16px',
        }}
      >
        📄
      </div>

      <h2
        style={{
          fontSize: '22px',
          fontWeight: '700',
          color: '#0f172a',
          margin: '0 0 8px 0',
        }}
      >
        {title || 'Details Coming Soon'}
      </h2>

      <p
        style={{
          fontSize: '14px',
          color: '#64748b',
          maxWidth: '440px',
          margin: 0,
          lineHeight: 1.6,
        }}
      >
        This section is reserved and will be populated once the data and modules
        are updated.
      </p>
    </div>
  );
}
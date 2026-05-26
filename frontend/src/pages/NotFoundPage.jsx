import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f172a',
        color: '#e2e8f0',
        padding: '2rem',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '460px',
          width: '100%',
          textAlign: 'center',
          borderRadius: '24px',
          background: '#111827',
          padding: '2.5rem',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          boxShadow: '0 32px 80px rgba(15, 23, 42, 0.35)',
        }}
      >
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem' }}>404</h1>
        <p style={{ margin: '0 0 1.5rem', color: '#cbd5e1', fontSize: '1.1rem' }}>
          Page not found. The route you requested does not exist.
        </p>
        <Link
          to="/"
          style={{
            display: 'inline-block',
            background: '#6366f1',
            color: '#fff',
            padding: '0.95rem 1.5rem',
            borderRadius: '999px',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Back to Store
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

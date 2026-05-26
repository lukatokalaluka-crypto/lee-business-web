import React from 'react';
import { globalStyles, colors } from '../styles/common.js';

const AdminLoginPage = ({ email, password, onEmailChange, onPasswordChange, onSubmit, loading, error }) => {
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #0f172a 0%, #111827 100%)',
      padding: '2rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#e2e8f0',
    },
    card: {
      width: 'min(460px, 100%)',
      background: '#0f172a',
      border: '1px solid rgba(148, 163, 184, 0.15)',
      borderRadius: '28px',
      boxShadow: '0 32px 100px rgba(15, 23, 42, 0.35)',
      padding: '3rem',
    },
    title: {
      margin: '0 0 1rem',
      fontSize: '2.35rem',
      color: '#f8fafc',
      fontWeight: 700,
    },
    subtitle: {
      margin: '0 0 1.75rem',
      color: '#94a3b8',
      lineHeight: 1.7,
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    formGroup: {
      marginBottom: '1rem',
    },
    label: {
      ...globalStyles.label,
      color: '#cbd5e1',
    },
    input: {
      ...globalStyles.input,
      background: '#111827',
      color: '#f8fafc',
      borderColor: 'rgba(148, 163, 184, 0.2)',
    },
    button: {
      ...globalStyles.button,
      padding: '1rem 1.2rem',
      background: colors.primary,
      color: 'white',
      width: '100%',
      fontSize: '1rem',
      opacity: loading ? 0.6 : 1,
      cursor: loading ? 'not-allowed' : 'pointer',
    },
    errorBox: {
      ...globalStyles.messageBox,
      ...globalStyles.errorMessage,
      marginBottom: '1.5rem',
    },
    backLink: {
      display: 'inline-block',
      marginTop: '1.25rem',
      color: '#93c5fd',
      textDecoration: 'none',
      fontSize: '0.95rem',
      fontWeight: 500,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Login</h1>
        <p style={styles.subtitle}>Only authorized admins may access this panel.</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={onSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="admin-email" style={styles.label}>
              Email Address
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="business@gmail.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="admin-password" style={styles.label}>
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="123456"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login to Admin Panel'}
          </button>
        </form>

        <a href="/" style={styles.backLink}>
          ← Back to Store
        </a>
      </div>
    </div>
  );
};

export default AdminLoginPage;

// Common styles used across the application
export const globalStyles = {
  container: {
    minHeight: '100vh',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  button: {
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.95rem',
    transition: 'background 0.2s, transform 0.2s',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '0.95rem',
    color: '#0f172a',
    background: '#ffffff',
    boxSizing: 'border-box',
  },
  label: {
    display: 'block',
    marginBottom: '0.4rem',
    fontWeight: 600,
    color: '#334155',
    fontSize: '0.95rem',
  },
  section: {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  messageBox: {
    padding: '1rem',
    borderRadius: '12px',
    border: '1px solid',
    fontSize: '0.95rem',
    fontWeight: 500,
  },
  successMessage: {
    background: 'rgba(34,197,94,0.1)',
    borderColor: '#22c55e',
    color: '#22c55e',
  },
  errorMessage: {
    background: 'rgba(248,113,113,0.1)',
    borderColor: '#f87171',
    color: '#f87171',
  },
};

export const colors = {
  primary: '#6366f1',
  secondary: '#e2e8f0',
  danger: '#ef4444',
  success: '#22c55e',
  background: '#f8fafc',
  card: '#ffffff',
  border: '#e2e8f0',
  text: '#0f172a',
  textMuted: '#64748b',
};

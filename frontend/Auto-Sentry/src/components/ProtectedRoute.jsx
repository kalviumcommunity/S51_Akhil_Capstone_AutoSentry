import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';

/**
 * Wraps a route that requires authentication.
 * - If Auth0 is still loading: shows a full-screen spinner.
 * - If not authenticated: immediately triggers Auth0 loginWithRedirect,
 *   passing the current path as `appState.returnTo` so the user lands
 *   back on the page they tried to visit after login.
 * - If authenticated: renders the children normally.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({
        appState: { returnTo: window.location.pathname },
      });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  // Still checking auth state
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8f9fa',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <div style={{
          width: '44px', height: '44px',
          border: '3px solid #e5e7eb',
          borderTopColor: '#5de0a5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#9ca3af', fontSize: '15px', margin: 0 }}>Loading…</p>
      </div>
    );
  }

  // Redirect in progress — render nothing
  if (!isAuthenticated) return null;

  return children;
};

export default ProtectedRoute;

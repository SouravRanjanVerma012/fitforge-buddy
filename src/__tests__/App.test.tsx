import * as React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { AuthContextType, AuthProvider, AuthContext } from '../lib/auth';

const TestAuthProvider: React.FC<{ value: Partial<AuthContextType>; children: React.ReactNode }> = ({ value, children }) => {
  const defaultValue: AuthContextType = {
    token: value.token ?? null,
    login: value.login ?? (() => {}),
    logout: value.logout ?? (() => {}),
    isAuthenticated: value.isAuthenticated ?? false,
    role: value.role ?? null,
  };
  return (
    <AuthProvider>
      <AuthContext.Provider value={defaultValue as AuthContextType}>
        {children}
      </AuthContext.Provider>
    </AuthProvider>
  );
};

describe('App', () => {
  it('renders the dashboard when authenticated', () => {
    render(
      <TestAuthProvider value={{ isAuthenticated: true, token: 'test', role: 'user' }}>
        <App />
      </TestAuthProvider>
    );
    expect(screen.getByText(/Welcome to FitBuddy!/i)).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    render(
      <TestAuthProvider value={{ isAuthenticated: false, token: null, role: null }}>
        <App />
      </TestAuthProvider>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
}); 
import * as React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../auth';

const TestComponent = () => {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span>{isAuthenticated ? 'Logged in' : 'Logged out'}</span>
      <button onClick={() => login('test-token', 'user')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthProvider', () => {
  it('toggles authentication state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText('Logged out')).toBeInTheDocument();
    act(() => {
      screen.getByText('Login').click();
    });
    expect(screen.getByText('Logged in')).toBeInTheDocument();
    act(() => {
      screen.getByText('Logout').click();
    });
    expect(screen.getByText('Logged out')).toBeInTheDocument();
  });
}); 
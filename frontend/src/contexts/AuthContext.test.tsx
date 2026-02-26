import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const makeJwt = (payload: Record<string, unknown>) => {
  const enc = (obj: Record<string, unknown>) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  return `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${enc(payload)}.sig`;
};

const DisplayUser = () => {
  const { currentUser, isAuthenticated } = useAuth();
  return (
    <div>
      <span data-testid="auth">{isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="email">{currentUser?.email ?? 'none'}</span>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => localStorage.clear());

  it('is unauthenticated when no token in localStorage', () => {
    render(<AuthProvider><DisplayUser /></AuthProvider>);
    expect(screen.getByTestId('auth')).toHaveTextContent('no');
    expect(screen.getByTestId('email')).toHaveTextContent('none');
  });

  it('decodes a valid JWT from localStorage', () => {
    // JWT with payload: {"sub":"abc123","email":"test@example.com","role":"Admin","exp":9999999999}
    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhYmMxMjMiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiQWRtaW4iLCJleHAiOjk5OTk5OTk5OTl9.signature';
    localStorage.setItem('token', fakeToken);

    render(<AuthProvider><DisplayUser /></AuthProvider>);
    expect(screen.getByTestId('auth')).toHaveTextContent('yes');
    expect(screen.getByTestId('email')).toHaveTextContent('test@example.com');
  });

  it('clears an expired JWT from localStorage', () => {
    const expiredToken = makeJwt({
      sub: 'abc123',
      email: 'test@example.com',
      role: 'Free',
      exp: 1,
    });
    localStorage.setItem('token', expiredToken);

    render(<AuthProvider><DisplayUser /></AuthProvider>);
    expect(screen.getByTestId('auth')).toHaveTextContent('no');
    expect(localStorage.getItem('token')).toBeNull();
  });
});

import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

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
});

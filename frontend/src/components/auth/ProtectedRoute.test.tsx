import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import type { CurrentUser } from '../../types/auth';
import { UserRole } from '../../types/auth';

const mockUser: CurrentUser = { id: '1', email: 'a@b.com', role: UserRole.Free };

const renderWithAuth = (isAuthenticated: boolean) =>
  render(
    <AuthContext.Provider
      value={{
        currentUser: isAuthenticated ? mockUser : null,
        isAuthenticated,
        token: isAuthenticated ? 'tok' : null,
        logout: () => {},
      }}
    >
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div>secret</div></ProtectedRoute>} />
          <Route path="/login" element={<div>login page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe('ProtectedRoute', () => {
  it('renders children when authenticated', () => {
    renderWithAuth(true);
    expect(screen.getByText('secret')).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', () => {
    renderWithAuth(false);
    expect(screen.getByText('login page')).toBeInTheDocument();
  });
});

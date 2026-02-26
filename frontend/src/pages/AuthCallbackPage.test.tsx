import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

vi.mock('../contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../contexts/AuthContext';
import { AuthCallbackPage } from './AuthCallbackPage';

describe('AuthCallbackPage', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({ login: mockLogin });
  });

  it('calls login with the token from the URL and shows loading text', () => {
    render(
      <MemoryRouter initialEntries={['/auth/callback?token=abc123']}>
        <AuthCallbackPage />
      </MemoryRouter>
    );
    expect(mockLogin).toHaveBeenCalledWith('abc123');
    expect(screen.getByText(/signing you in/i)).toBeInTheDocument();
  });

  it('does not call login when token is missing', () => {
    render(
      <MemoryRouter initialEntries={['/auth/callback']}>
        <AuthCallbackPage />
      </MemoryRouter>
    );
    expect(mockLogin).not.toHaveBeenCalled();
  });
});

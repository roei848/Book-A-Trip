import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock the auth module before importing the component
vi.mock('../api/auth', () => ({
  saveToken: vi.fn(),
}));

import { saveToken } from '../api/auth';
import { AuthCallbackPage } from './AuthCallbackPage';

describe('AuthCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('saves the token from the URL and shows loading text', () => {
    render(
      <MemoryRouter initialEntries={['/auth/callback?token=abc123']}>
        <AuthCallbackPage />
      </MemoryRouter>
    );
    expect(saveToken).toHaveBeenCalledWith('abc123');
    expect(screen.getByText(/signing you in/i)).toBeInTheDocument();
  });
});

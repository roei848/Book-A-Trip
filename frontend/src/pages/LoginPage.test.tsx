import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('renders a sign in link pointing to the backend login URL', () => {
    render(<MemoryRouter><LoginPage /></MemoryRouter>);
    const link = screen.getByRole('link', { name: /sign in with google/i });
    expect(link).toHaveAttribute('href', 'http://localhost:5000/api/auth/login');
  });

  it('shows error message when error param is auth_failed', () => {
    render(
      <MemoryRouter initialEntries={['/login?error=auth_failed']}>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/sign in failed/i)).toBeInTheDocument();
  });
});

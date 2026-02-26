import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../context/LanguageContext';
import { LoginPage } from './LoginPage';

describe('LoginPage', () => {
  it('renders a sign in link pointing to the backend login URL', () => {
    render(
      <LanguageProvider>
        <MemoryRouter><LoginPage /></MemoryRouter>
      </LanguageProvider>
    );
    const link = screen.getByRole('link', { name: /google/i });
    expect(link).toHaveAttribute('href', 'http://localhost:5000/api/auth/login');
  });

  it('shows error message when error param is auth_failed', () => {
    render(
      <LanguageProvider>
        <MemoryRouter initialEntries={['/login?error=auth_failed']}>
          <LoginPage />
        </MemoryRouter>
      </LanguageProvider>
    );
    expect(screen.getByText(/ההתחברות נכשלה/)).toBeInTheDocument();
  });
});

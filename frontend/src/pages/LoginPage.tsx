import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../styles/theme';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const hasError = searchParams.get('error') === 'auth_failed';

  return (
    <LoginPageWrapper>
      <h1>Book A Trip</h1>
      <p>Sign in to plan your next adventure</p>
      {hasError && <p className="error">Sign in failed. Please try again.</p>}
      <a href="http://localhost:5000/api/auth/login" className="signin-link">
        Sign in with Google
      </a>
    </LoginPageWrapper>
  );
};

const LoginPageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  gap: ${theme.spacing.lg};
  font-family: ${theme.fonts.body};

  h1 {
    color: ${theme.colors.text};
    margin: 0;
  }

  p {
    color: ${theme.colors.textLight};
    margin: 0;
  }

  .error {
    color: ${theme.colors.error};
  }

  .signin-link {
    padding: ${theme.spacing.md} ${theme.spacing.xl};
    background: ${theme.colors.primary};
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
`;

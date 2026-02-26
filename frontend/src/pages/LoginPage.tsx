import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../styles/theme';

export const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const hasError = searchParams.get('error') === 'auth_failed';

  return (
    <LoginPageWrapper>
      <h1>{t('loginPage', 'title')}</h1>
      <p>{t('loginPage', 'subtitle')}</p>
      {hasError && <p className="error">{t('loginPage', 'error')}</p>}
      <a href="http://localhost:5000/api/auth/login" className="signin-link">
        {t('loginPage', 'signInButton')}
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
    color: ${theme.colors.surface};
    text-decoration: none;
    border-radius: ${theme.borderRadius};
  }
`;

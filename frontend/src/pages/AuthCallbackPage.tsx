import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { saveToken } from '../api/auth';
import { theme } from '../styles/theme';

export const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      saveToken(token);
      navigate('/', { replace: true });
    } else {
      navigate('/login?error=auth_failed', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <AuthCallbackPageWrapper>
      <p className="message">Signing you in...</p>
    </AuthCallbackPageWrapper>
  );
};

const AuthCallbackPageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;

  .message {
    font-family: ${theme.fonts.body};
    color: ${theme.colors.textLight};
  }
`;

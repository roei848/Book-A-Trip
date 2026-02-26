import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <ThemeToggleWrapper onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      {isDark ? '☀️' : '🌙'}
    </ThemeToggleWrapper>
  );
};

const ThemeToggleWrapper = styled.button`
  background: transparent;
  border: 1px solid ${theme.colors.border};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    background: ${theme.colors.surface};
  }
`;

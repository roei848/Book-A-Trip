import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <HeaderWrapper>
      <div className="nav-right" onClick={() => navigate('/')}>
        <div className="logo-icon">&#9992;</div>
        <span className="brand-name">Book-A-Trip</span>
      </div>

      <div className="nav-center">
        <button
          className={`nav-btn ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}
        >
          <span className="home-icon">&#8962;</span>
          <span>הטיולים שלי</span>
        </button>
        <button className="nav-link" onClick={() => navigate('/create')}>
          + טיול חדש
        </button>
      </div>

      <div className="nav-left">
        <button className="icon-btn moon-btn" aria-label="Toggle dark mode">
          &#9789;
        </button>
        <div className="avatar" aria-label="User profile">
          <span>&#128100;</span>
        </div>
      </div>

      <div className="gradient-line" />
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  direction: rtl;
  padding: 0 ${theme.spacing.xl};
  height: 64px;
  background: ${theme.colors.surface};
  font-family: ${theme.fonts.body};

  .nav-right {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    cursor: pointer;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentEnd});
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${theme.colors.surface};
    font-size: 18px;
  }

  .brand-name {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentEnd});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-center {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.lg};
    direction: rtl;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: none;
    border-radius: 20px;
    font-family: ${theme.fonts.body};
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    background: transparent;
    color: ${theme.colors.textLight};
    transition: all 0.2s;

    &:hover {
      background: ${theme.colors.background};
    }

    &.active {
      background: ${theme.colors.text};
      color: ${theme.colors.surface};
    }
  }

  .home-icon {
    font-size: 16px;
  }

  .nav-link {
    border: none;
    background: transparent;
    font-family: ${theme.fonts.body};
    font-size: 14px;
    font-weight: 500;
    color: ${theme.colors.textLight};
    cursor: pointer;
    padding: ${theme.spacing.sm} ${theme.spacing.sm};
    transition: color 0.2s;

    &:hover {
      color: ${theme.colors.text};
    }
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.md};
  }

  .icon-btn {
    width: 36px;
    height: 36px;
    border: 1px solid ${theme.colors.border};
    border-radius: 50%;
    background: ${theme.colors.surface};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    color: ${theme.colors.textLight};
    transition: background 0.2s;

    &:hover {
      background: ${theme.colors.background};
    }
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${theme.colors.warning}, ${theme.colors.error});
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    cursor: pointer;
    overflow: hidden;
  }

  .gradient-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, ${theme.colors.accent}, ${theme.colors.accentEnd}, ${theme.colors.primary});
    opacity: 0.5;
  }
`;

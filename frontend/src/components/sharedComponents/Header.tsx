import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { theme } from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types/auth';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const { t, isRtl, toggleLang, lang } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const emailInitial = currentUser?.email?.[0]?.toUpperCase() ?? '?';

  const roleLabelMap: Record<UserRole, string> = {
    [UserRole.Free]: 'Free',
    [UserRole.Premium]: 'Premium',
    [UserRole.Admin]: 'Admin',
  };

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
        {currentUser?.role === UserRole.Admin && (
          <button
            className={`nav-btn ${isActive('/admin/users') ? 'active' : ''}`}
            onClick={() => navigate('/admin/users')}
          >
            ניהול משתמשים
          </button>
        )}
        <button className="nav-link" onClick={() => navigate('/create')}>
          + טיול חדש
        </button>
      </div>

      <div className="nav-left">
        <button className="lang-toggle" onClick={toggleLang} aria-label="Toggle language">
          🌐 {lang === 'he' ? 'EN' : 'עב'}
        </button>
        <button className="icon-btn moon-btn" onClick={toggleTheme} aria-label="Toggle dark mode">
          {isDark ? '\u2600' : '\u263D'}
        </button>
        <div className="avatar-wrapper" ref={avatarRef}>
          <div
            className="avatar"
            aria-label="User profile"
            onClick={() => setDropdownOpen((o) => !o)}
          >
            <span>{emailInitial}</span>
          </div>
          {dropdownOpen && (
            <div className="dropdown">
              <div className="dropdown-email">{currentUser?.email}</div>
              <div className="dropdown-role">
                {currentUser ? roleLabelMap[currentUser.role] : ''}
              </div>
              <div className="dropdown-divider" />
              <button className="dropdown-logout" onClick={handleLogout}>
                התנתק
              </button>
            </div>
          )}
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

  .avatar-wrapper {
    position: relative;
  }

  .avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${theme.colors.warning}, ${theme.colors.error});
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    overflow: hidden;
    user-select: none;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    min-width: 180px;
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    padding: ${theme.spacing.sm} 0;
    z-index: 100;
    direction: rtl;
  }

  .dropdown-email {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    font-size: 13px;
    color: ${theme.colors.text};
    font-weight: 500;
    word-break: break-all;
  }

  .dropdown-role {
    padding: 0 ${theme.spacing.md} ${theme.spacing.sm};
    font-size: 12px;
    color: ${theme.colors.textLight};
  }

  .dropdown-divider {
    height: 1px;
    background: ${theme.colors.border};
    margin: 0 0 ${theme.spacing.sm};
  }

  .dropdown-logout {
    display: block;
    width: 100%;
    padding: ${theme.spacing.sm} ${theme.spacing.md};
    border: none;
    background: transparent;
    font-family: ${theme.fonts.body};
    font-size: 14px;
    color: ${theme.colors.error};
    cursor: pointer;
    text-align: right;
    transition: background 0.15s;

    &:hover {
      background: ${theme.colors.background};
    }
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

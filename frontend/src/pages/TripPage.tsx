import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { getTripById } from '../api/trips';
import { DayCard } from '../components/trips/DayCard';
import { Button } from '../components/sharedComponents/Button';
import { theme } from '../styles/theme';
import type { Trip } from '../types/models';
import { useLanguage } from '../context/LanguageContext';

const formatDateRange = (start: string, end: string, locale: string): string => {
  const fmt = (d: string) =>
    new Date(d).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(start)} – ${fmt(end)}`;
};

export const TripPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { t, isRtl, lang } = useLanguage();

  useEffect(() => {
    if (!id) return;
    getTripById(id)
      .then(setTrip)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <TripPageWrapper dir={isRtl ? 'rtl' : 'ltr'}>
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-icon">✈</span>
          <span className="nav-name">Book-A-Trip</span>
        </div>
        <span className="back-link" onClick={() => navigate('/')}>
          {t('tripPage', 'backLink')}
        </span>
      </nav>

      {loading && (
        <div className="main">
          <div className="skeleton skeleton-hero" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-meta" />
          <div className="skeleton skeleton-card" />
          <div className="skeleton skeleton-card" />
        </div>
      )}

      {!loading && error && (
        <div className="main center">
          <p className="error-text">{t('tripPage', 'notFound')}</p>
          <Button onClick={() => navigate('/')}>{t('tripPage', 'backButton')}</Button>
        </div>
      )}

      {!loading && trip && (
        <div className="main">
          <div className="hero">
            <img
              className="hero-image"
              src={`https://picsum.photos/seed/${encodeURIComponent(trip.destination)}/1200/500`}
              alt={trip.destination}
            />
            <div className="hero-overlay">
              <div className="hero-content">
                <div className="destination-badge">
                  <span>📍</span>
                  {trip.destination}
                </div>
                <h1 className="trip-title">{trip.title}</h1>
                <p className="date-range">{formatDateRange(trip.startDate, trip.endDate, lang === 'he' ? 'he-IL' : 'en-US')}</p>
              </div>
            </div>
          </div>

          <div className="meta-strip">
            <div className="meta-chip">
              <span className="meta-icon">👥</span>
              <span className="meta-label">
                {trip.travelersCount} {trip.travelersCount !== 1 ? t('tripPage', 'travelers') : t('tripPage', 'traveler')}
              </span>
            </div>
            <div className="meta-chip">
              <span className="meta-icon">💰</span>
              <span className="meta-label">{t('tripPage', trip.budget)}</span>
            </div>
            <div className="meta-chip">
              <span className="meta-icon">🚶</span>
              <span className="meta-label">{t('tripPage', trip.pace)}</span>
            </div>
            <div className="meta-chip">
              <span className="meta-icon">🚌</span>
              <span className="meta-label">{t('tripPage', trip.transport)}</span>
            </div>
            {trip.food !== 'none' && (
              <div className="meta-chip">
                <span className="meta-icon">🍽</span>
                <span className="meta-label">{t('tripPage', trip.food)}</span>
              </div>
            )}
          </div>

          <div className="itinerary">
            <h2 className="section-title">{t('tripPage', 'itinerary')}</h2>
            <div className="days-list">
              {trip.days.map((day) => (
                <DayCard key={day.dayNumber} day={day} />
              ))}
            </div>
          </div>
        </div>
      )}
    </TripPageWrapper>
  );
};

const TripPageWrapper = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  font-family: ${theme.fonts.body};

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${theme.spacing.xl};
    height: 64px;
    background: ${theme.colors.gradientStart};
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    color: ${theme.colors.surface};
    font-size: 18px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }

  .nav-icon {
    font-size: 20px;
  }

  .back-link {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius};
    transition: color 0.15s;

    &:hover {
      color: ${theme.colors.surface};
    }
  }

  .main {
    max-width: 860px;
    margin: 0 auto;
    padding: ${theme.spacing.xl} ${theme.spacing.xl} ${theme.spacing.xxl};

    &.center {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: ${theme.spacing.xxl};
      gap: ${theme.spacing.lg};
    }
  }

  .hero {
    position: relative;
    border-radius: ${theme.borderRadius};
    overflow: hidden;
    margin-bottom: ${theme.spacing.lg};
    height: 320px;
  }

  .hero-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(15, 23, 42, 0.75) 0%,
      rgba(15, 23, 42, 0.1) 60%,
      transparent 100%
    );
    display: flex;
    align-items: flex-end;
  }

  .hero-content {
    padding: ${theme.spacing.xl};
  }

  .destination-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.85);
    background: rgba(255, 255, 255, 0.15);
    border-radius: 20px;
    padding: 3px 10px;
    margin-bottom: ${theme.spacing.sm};
    backdrop-filter: blur(4px);
  }

  .trip-title {
    font-size: 28px;
    font-weight: 700;
    color: ${theme.colors.surface};
    margin: 0 0 ${theme.spacing.xs} 0;
    line-height: 1.2;
  }

  .date-range {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.75);
    margin: 0;
  }

  .meta-strip {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
    flex-wrap: wrap;
    margin-bottom: ${theme.spacing.xl};
  }

  .meta-chip {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: 20px;
    font-size: 13px;
    color: ${theme.colors.text};
  }

  .meta-icon {
    font-size: 14px;
  }

  .meta-label {
    font-weight: 500;
  }

  .section-title {
    font-size: 20px;
    font-weight: 700;
    color: ${theme.colors.text};
    margin: 0 0 ${theme.spacing.lg} 0;
  }

  .days-list {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
  }

  .error-text {
    font-size: 16px;
    color: ${theme.colors.textLight};
    margin: 0;
  }

  .skeleton {
    background: linear-gradient(
      90deg,
      ${theme.colors.border} 25%,
      ${theme.colors.background} 50%,
      ${theme.colors.border} 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite;
    border-radius: ${theme.borderRadius};
    margin-bottom: ${theme.spacing.lg};
  }

  .skeleton-hero {
    height: 320px;
  }

  .skeleton-title {
    height: 36px;
    width: 55%;
  }

  .skeleton-meta {
    height: 36px;
    width: 75%;
  }

  .skeleton-card {
    height: 160px;
  }

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getTrips } from '../api/trips';
import { Button } from '../components/sharedComponents/Button';
import { Input } from '../components/sharedComponents/Input';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../styles/theme';
import type { TripSummary } from '../types/models';

export const Home = () => {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { t, isRtl } = useLanguage();

  useEffect(() => {
    getTrips().then(setTrips);
  }, []);

  const filtered = trips.filter(
    (trip) =>
      trip.destination.toLowerCase().includes(search.toLowerCase()) ||
      trip.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <HomeWrapper dir={isRtl ? 'rtl' : 'ltr'}>
      <main className="main">
        <div className="header-row">
          <div className="header-text">
            <h1 className="page-title">{t('home', 'myTrips')}</h1>
            <p className="page-subtitle">{t('home', 'subtitle')}</p>
          </div>
          <Button onClick={() => navigate('/create')}>{t('home', 'createButton')}</Button>
        </div>

        <div className="search-bar">
          <Input
            placeholder={t('home', 'searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <p className="empty-text">{t('home', 'emptyState')}</p>
            <Button onClick={() => navigate('/create')}>{t('home', 'createButton')}</Button>
          </div>
        ) : (
          <div className="trip-grid">
            {filtered.map((trip) => (
              <div key={trip.id} className="trip-card" onClick={() => navigate(`/trip/${trip.id}`)}>
                <div className="trip-image-wrap">
                  <img
                    className="trip-image"
                    src={`https://picsum.photos/seed/${encodeURIComponent(trip.destination)}/600/300`}
                    alt={trip.destination}
                  />
                </div>
                <div className="trip-body">
                  <div className="trip-location">
                    <span className="pin-icon">📍</span>
                    <span className="trip-destination">{trip.destination}</span>
                  </div>
                  <p className="trip-title-text">{trip.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.div`
  min-height: 100vh;
  background: ${theme.colors.background};
  font-family: ${theme.fonts.body};

  .main {
    max-width: 1100px;
    margin: 0 auto;
    padding: ${theme.spacing.xxl} ${theme.spacing.xl};
  }

  .header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: ${theme.spacing.xl};
  }

  .page-title {
    font-size: 32px;
    font-weight: 700;
    color: ${theme.colors.text};
    margin: 0 0 ${theme.spacing.xs} 0;
  }

  .page-subtitle {
    font-size: 15px;
    color: ${theme.colors.textLight};
    margin: 0;
  }

  .search-bar {
    margin-bottom: ${theme.spacing.xl};

    > div {
      width: 100%;
    }

    input {
      width: 100%;
      font-size: 15px;
      padding: ${theme.spacing.md};
      box-sizing: border-box;
    }
  }

  .trip-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: ${theme.spacing.xl};
  }

  .trip-card {
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius};
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.2s, transform 0.15s;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07);

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }
  }

  .trip-image-wrap {
    width: 100%;
    height: 200px;
    overflow: hidden;
  }

  .trip-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .trip-body {
    padding: ${theme.spacing.lg};
  }

  .trip-location {
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs};
    margin-bottom: ${theme.spacing.xs};
  }

  .pin-icon {
    font-size: 16px;
  }

  .trip-destination {
    font-size: 18px;
    font-weight: 600;
    color: ${theme.colors.text};
  }

  .trip-title-text {
    font-size: 13px;
    color: ${theme.colors.textLight};
    margin: 0;
  }

  .empty-state {
    text-align: center;
    padding: ${theme.spacing.xxl};
  }

  .empty-text {
    font-size: 16px;
    color: ${theme.colors.textLight};
    margin-bottom: ${theme.spacing.lg};
  }
`;

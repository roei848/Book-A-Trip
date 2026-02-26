import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { generateEquipmentList, getTripById } from '../api/trips';
import { DayCard } from '../components/trips/DayCard';
import { Button } from '../components/sharedComponents/Button';
import { theme } from '../styles/theme';
import type { EquipmentList, Trip } from '../types/models';
import { useLanguage } from '../context/LanguageContext';

type Tab = 'itinerary' | 'map' | 'budget' | 'equipment';

const tabs: { id: Tab }[] = [
  { id: 'itinerary' },
  { id: 'map' },
  { id: 'budget' },
  { id: 'equipment' },
];

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
  const [activeTab, setActiveTab] = useState<Tab>('itinerary');
  const [equipmentList, setEquipmentList] = useState<EquipmentList | null>(null);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());
  const [extraItems, setExtraItems] = useState<string[]>([]);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!id) return;
    getTripById(id)
      .then(setTrip)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (activeTab !== 'equipment' || equipmentList || equipmentLoading || !id || hasFetched.current) return;
    hasFetched.current = true;
    setEquipmentLoading(true);
    generateEquipmentList(id)
      .then(setEquipmentList)
      .finally(() => setEquipmentLoading(false));
  }, [activeTab, id]);

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const addItem = () => {
    const trimmed = newItem.trim();
    if (!trimmed) return;
    setExtraItems((prev) => [...prev, trimmed]);
    setNewItem('');
  };

  const allItems = [
    ...(equipmentList?.items.map((item) => item.name) ?? []),
    ...extraItems,
  ];

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

          {/* Tab bar */}
          <div className="tab-bar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {t('tripPage', `tab_${tab.id}`)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'itinerary' && (
            <div className="tab-content">
              <div className="days-list">
                {trip.days.map((day) => (
                  <DayCard key={day.dayNumber} day={day} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'map' && (
            <div className="tab-content empty-state">
              <span className="empty-icon">🗺️</span>
              <p className="empty-text">{t('tripPage', 'mapComingSoon')}</p>
            </div>
          )}

          {activeTab === 'budget' && (
            <div className="tab-content empty-state">
              <span className="empty-icon">💰</span>
              <p className="empty-text">{t('tripPage', 'budgetComingSoon')}</p>
            </div>
          )}

          {activeTab === 'equipment' && (
            <div className="tab-content">
              {equipmentLoading && (
                <div className="equip-card">
                  <div className="skeleton skeleton-equip-title" />
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton skeleton-equip-row" />
                  ))}
                </div>
              )}

              {!equipmentLoading && equipmentList && (
                <div className="equip-card">
                  <h2 className="equip-card-title">{t('tripPage', 'packingListTitle')}</h2>
                  <ul className="equip-list">
                    {allItems.map((name, i) => {
                      const checked = checkedItems.has(i);
                      return (
                        <li
                          key={i}
                          className={`equip-row${checked ? ' checked' : ''}`}
                          onClick={() => toggleItem(i)}
                        >
                          <span className="equip-circle">
                            {checked && (
                              <svg viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="11" stroke="#22c55e" strokeWidth="2" fill="#22c55e" fillOpacity="0.12"/>
                                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                            {!checked && (
                              <svg viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="11" stroke="#d1d5db" strokeWidth="2"/>
                                <path d="M7 12.5l3.5 3.5 6.5-7" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </span>
                          <span className="equip-name">{name}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="equip-add-row">
                    <button
                      className="equip-add-btn"
                      onClick={() => {
                        const val = window.prompt(t('tripPage', 'addItemPrompt'));
                        if (val?.trim()) setExtraItems((prev) => [...prev, val.trim()]);
                      }}
                    >
                      {t('tripPage', 'addItem')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
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

  .nav-icon { font-size: 20px; }

  .back-link {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    cursor: pointer;
    padding: ${theme.spacing.xs} ${theme.spacing.sm};
    border-radius: ${theme.borderRadius};
    transition: color 0.15s;
    &:hover { color: ${theme.colors.surface}; }
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

  .hero-image { width: 100%; height: 100%; object-fit: cover; display: block; }

  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.1) 60%, transparent 100%);
    display: flex;
    align-items: flex-end;
  }

  .hero-content { padding: ${theme.spacing.xl}; }

  .destination-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    font-weight: 500;
    color: rgba(255,255,255,0.85);
    background: rgba(255,255,255,0.15);
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

  .date-range { font-size: 14px; color: rgba(255,255,255,0.75); margin: 0; }

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

  .meta-icon { font-size: 14px; }
  .meta-label { font-weight: 500; }

  /* Tab bar */
  .tab-bar {
    display: flex;
    background: #f0f0f0;
    border-radius: 12px;
    padding: 4px;
    margin-bottom: ${theme.spacing.xl};
  }

  .tab-btn {
    flex: 1;
    padding: 10px 0;
    border: none;
    background: transparent;
    border-radius: 9px;
    font-size: 15px;
    font-weight: 500;
    color: ${theme.colors.textLight};
    cursor: pointer;
    transition: background 0.15s, color 0.15s, box-shadow 0.15s;
    font-family: ${theme.fonts.body};

    &.active {
      background: #ffffff;
      color: ${theme.colors.text};
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }

    &:not(.active):hover { color: ${theme.colors.text}; }
  }

  /* Tab content */
  .tab-content { min-height: 200px; }

  .days-list {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.lg};
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing.xxl} 0;
    gap: ${theme.spacing.md};
  }

  .empty-icon { font-size: 48px; opacity: 0.4; }
  .empty-text { font-size: 15px; color: ${theme.colors.textLight}; margin: 0; }

  /* Equipment card */
  .equip-card {
    background: ${theme.colors.surface};
    border: 1px solid ${theme.colors.border};
    border-radius: 16px;
    overflow: hidden;
  }

  .equip-card-title {
    font-size: 16px;
    font-weight: 700;
    color: ${theme.colors.text};
    margin: 0;
    padding: 20px 20px 16px;
    border-bottom: 1px solid ${theme.colors.border};
  }

  .equip-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .equip-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 20px;
    border-bottom: 1px solid ${theme.colors.border};
    cursor: pointer;
    transition: background 0.1s;

    &:last-child { border-bottom: none; }
    &:hover { background: ${theme.colors.background}; }
  }

  .equip-circle {
    width: 24px;
    height: 24px;
    flex-shrink: 0;

    svg { width: 24px; height: 24px; display: block; }
  }

  .equip-name {
    font-size: 15px;
    color: ${theme.colors.text};
    flex: 1;

    .checked & {
      color: ${theme.colors.textLight};
      text-decoration: line-through;
    }
  }

  .equip-add-row {
    padding: 4px;
  }

  .equip-add-btn {
    width: 100%;
    padding: 14px;
    border: none;
    background: transparent;
    font-size: 15px;
    font-weight: 500;
    color: ${theme.colors.textLight};
    cursor: pointer;
    font-family: ${theme.fonts.body};
    transition: color 0.15s;

    &:hover { color: ${theme.colors.text}; }
  }

  /* Skeletons */
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

  .skeleton-hero { height: 320px; }
  .skeleton-title { height: 36px; width: 55%; }
  .skeleton-meta { height: 36px; width: 75%; }
  .skeleton-card { height: 160px; }

  .skeleton-equip-title {
    height: 20px;
    width: 40%;
    margin: 20px;
    border-radius: 6px;
  }

  .skeleton-equip-row {
    height: 52px;
    border-radius: 0;
    margin: 0;
    border-bottom: 1px solid ${theme.colors.border};
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

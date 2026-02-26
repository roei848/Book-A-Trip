import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { apiClient } from '../api/client';
import { Button } from '../components/sharedComponents/Button';
import { Card } from '../components/sharedComponents/Card';
import { theme } from '../styles/theme';
import type { TripSummary } from '../types/models';

export const Home = () => {
  const [trips, setTrips] = useState<TripSummary[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get<TripSummary[]>('/itinerary').then((res) => {
      console.log('Fetched trips:', res.data);
      setTrips(res.data);
    });
  }, []);

  return (
    <HomeWrapper>
      <div className="content">
        <h1 className="title">Book A Trip</h1>
        <Button onClick={() => navigate('/create')}>Book a Trip</Button>
        <div className="trip-list">
          {trips.map((trip) => (
            <Card key={trip.id}>
              <h3 className="trip-title">{trip.title}</h3>
              <p className="trip-destination">{trip.destination}</p>
            </Card>
          ))}
        </div>
      </div>
    </HomeWrapper>
  );
};

const HomeWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    ${theme.colors.gradientStart} 0%,
    ${theme.colors.gradientMid} 50%,
    ${theme.colors.gradientEnd} 100%
  );
  padding: ${theme.spacing.xl};

  .content {
    max-width: 800px;
    margin: 0 auto;
  }

  .title {
    font-family: ${theme.fonts.body};
    color: ${theme.colors.text};
    margin-bottom: ${theme.spacing.lg};
  }

  .trip-list {
    display: flex;
    flex-direction: column;
    gap: ${theme.spacing.md};
    margin-top: ${theme.spacing.lg};
  }

  .trip-title {
    font-family: ${theme.fonts.body};
    color: ${theme.colors.text};
    margin: 0 0 ${theme.spacing.xs} 0;
  }

  .trip-destination {
    font-family: ${theme.fonts.body};
    color: ${theme.colors.textLight};
    margin: 0;
  }
`;

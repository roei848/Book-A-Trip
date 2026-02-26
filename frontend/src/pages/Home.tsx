import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getTrips, getTripById } from '../api/trips';
import { Card } from '../components/sharedComponents/Card';
import { theme } from '../styles/theme';
import type { TripSummary } from '../types/models';

export const Home = () => {
  const [trips, setTrips] = useState<TripSummary[]>([]);

  useEffect(() => {
    getTrips().then((data) => {
      console.log('trips from DB:', data);
      setTrips(data);
    });
  }, []);

  return (
    <Container>
      <div className="content">
        <Title>Book A Trip</Title>
        <TripList>
          {trips.map((trip) => (
            <Card
              key={trip.id}
              onClick={() => getTripById(trip.id).then((data) => console.log('trip model:', data))}
            >
              <TripTitle>{trip.title}</TripTitle>
              <TripDestination>{trip.destination}</TripDestination>
            </Card>
          ))}
        </TripList>
      </div>
    </Container>
  );
};

const Container = styled.div`
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
`;

const Title = styled.h1`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.lg};
`;

const TripList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const TripTitle = styled.h3`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.text};
  margin: 0 0 ${theme.spacing.xs} 0;
`;

const TripDestination = styled.p`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.textLight};
  margin: 0;
`;

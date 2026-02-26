import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { apiClient } from '../api/client';
import { Card } from '../components/sharedComponents/Card';
import { theme } from '../styles/theme';
import type { TripSummary } from '../types/models';

export const Home = () => {
  const [trips, setTrips] = useState<TripSummary[]>([]);

  useEffect(() => {
    apiClient.get<TripSummary[]>('/itinerary').then((res) => {
      console.log('Fetched trips:', res.data);
      setTrips(res.data);
    });
  }, []);

  return (
    <Container>
      <Content>
        <Title>Book A Trip</Title>
        <TripList>
          {trips.map((trip) => (
            <Card key={trip.id}>
              <TripTitle>{trip.title}</TripTitle>
              <TripDestination>{trip.destination}</TripDestination>
            </Card>
          ))}
        </TripList>
      </Content>
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

const Content = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

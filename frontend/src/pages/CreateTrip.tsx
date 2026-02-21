import styled from "styled-components";
import { theme } from "../styles/theme";

export const CreateTrip = () => {
  return (
    <Container>
      <Title>Create a New Trip</Title>
      <p>Form coming soon...</p>
    </Container>
  );
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-family: ${theme.fonts.body};
  color: ${theme.colors.text};
`;

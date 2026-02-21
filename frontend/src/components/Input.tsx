import styled from "styled-components";
import { theme } from "../styles/theme";

interface InputProps {
  label?: string;
}

export const Input = ({
  label,
  ...props
}: InputProps & React.InputHTMLAttributes<HTMLInputElement>) => (
  <Wrapper>
    {label && <Label>{label}</Label>}
    <StyledInput {...props} />
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const Label = styled.label`
  font-family: ${theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const StyledInput = styled.input`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius};
  font-family: ${theme.fonts.body};
  font-size: 14px;
  color: ${theme.colors.text};
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
  }
`;

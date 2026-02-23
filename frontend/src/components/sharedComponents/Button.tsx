import styled from "styled-components";
import { theme } from "../../styles/theme";

interface ButtonProps {
  variant?: "primary" | "secondary";
}

export const Button = ({
  variant = "primary",
  ...props
}: ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <StyledButton variant={variant} {...props} />
);

const StyledButton = styled.button<ButtonProps>`
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border: none;
  border-radius: ${theme.borderRadius};
  font-family: ${theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  background-color: ${({ variant }) =>
    variant === "secondary" ? theme.colors.secondary : theme.colors.primary};
  color: ${theme.colors.surface};

  &:hover {
    background-color: ${({ variant }) =>
      variant === "secondary"
        ? theme.colors.secondaryHover
        : theme.colors.primaryHover};
  }
`;

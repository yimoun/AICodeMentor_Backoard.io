import React from 'react';
import { CircularProgress } from '@mui/material';
import { StyledButton, ButtonBadge } from '../../styles/ButtonStyles';

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'social';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  /** Variante du bouton */
  variant?: ButtonVariant;
  /** Taille du bouton */
  size?: ButtonSize;
  /** Prend toute la largeur */
  fullWidth?: boolean;
  /** Affiche un loader */
  isLoading?: boolean;
  /** Badge sur le bouton (ex: "50 crédits offerts") */
  badge?: string;
  /** Icône à gauche */
  startIcon?: React.ReactNode;
  /** Icône à droite */
  endIcon?: React.ReactNode;
  /** Contenu du bouton */
  children: React.ReactNode;
  /** URL si le bouton est un lien */
  href?: string;
  /** Type du bouton */
  type?: 'button' | 'submit' | 'reset';
  /** Bouton désactivé */
  disabled?: boolean;
  /** Callback au clic */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Classe CSS */
  className?: string;
  /** Styles inline */
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  badge,
  startIcon,
  endIcon,
  children,
  disabled,
  href,
  type = 'button',
  onClick,
  className,
  style,
}) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <StyledButton
      // @ts-ignore - Custom props for StyledButton
      variant={variant}
       // @ts-ignore - Custom props for StyledButton
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || isLoading}
      onClick={handleClick}
      href={href}
      type={type}
      component={href ? 'a' : 'button'}
      className={className}
      style={style}
    >
      {isLoading ? (
        <CircularProgress
          size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16}
          color="inherit"
          sx={{ mr: 1 }}
        />
      ) : (
        startIcon
      )}
      
      {children}
      
      {!isLoading && endIcon}
      
      {badge && <ButtonBadge>{badge}</ButtonBadge>}
    </StyledButton>
  );
};

export { Button };
export default Button;
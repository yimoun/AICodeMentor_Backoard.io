

import { styled } from '@mui/material/styles';
import { Box, Typography, Link, Divider } from '@mui/material';

/**
 * Container principal de la page auth (login/signup)
 * Centré verticalement avec background gradient
 */
export const AuthContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    background: `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.grey[800]} 100%)`,
  }),
}));

/**
 * Card contenant le formulaire d'authentification
 */
export const AuthCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(5),
  borderRadius: (theme.shape.borderRadius as number) * 3,
  boxShadow: theme.shadows[10],
  width: '100%',
  maxWidth: 420,
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    borderRadius: (theme.shape.borderRadius as number) * 2,
  },
}));

/**
 * Header de la card auth (icône, titre, sous-titre)
 */
export const AuthHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

/**
 * Icône du brand dans le header
 */
export const AuthBrandIcon = styled('span')(({ theme }) => ({
  fontSize: '3rem',
  display: 'block',
  marginBottom: theme.spacing(2),
  lineHeight: 1,
}));

/**
 * Titre du header auth
 */
export const AuthTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

/**
 * Sous-titre du header auth
 */
export const AuthSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  fontSize: '0.875rem',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Container du formulaire
 */
export const AuthForm = styled('form')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

/**
 * Groupe de champ de formulaire
 */
export const FormGroup = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
}));

/**
 * Label de champ
 */
export const FormLabel = styled(Typography)(({ theme }) => ({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1),
  color: theme.palette.grey[700],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[300],
  }),
}));

/**
 * Lien "Mot de passe oublié"
 */
export const ForgotLink = styled(Link)(({ theme }) => ({
  display: 'block',
  textAlign: 'right',
  fontSize: '0.75rem',
  marginTop: theme.spacing(1),
  color: theme.palette.primary.main,
  textDecoration: 'none',
  cursor: 'pointer',
  
  '&:hover': {
    textDecoration: 'underline',
  },
}));

/**
 * Barre de force du mot de passe
 */
export const PasswordStrengthContainer = styled(Box)(({ theme }) => ({
  height: 4,
  backgroundColor: theme.palette.grey[200],
  borderRadius: (theme.shape.borderRadius as number) * 4,
  marginTop: theme.spacing(1),
  overflow: 'hidden',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));

interface PasswordStrengthBarProps {
  strength: number; // 0-100
}

export const PasswordStrengthBar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'strength',
})<PasswordStrengthBarProps>(({ theme, strength }) => ({
  height: '100%',
  width: `${strength}%`,
  backgroundColor:
    strength < 33
      ? theme.palette.error.main
      : strength < 66
      ? theme.palette.warning.main
      : theme.palette.success.main,
  transition: 'width 0.3s ease, background-color 0.3s ease',
}));

/**
 * Divider avec texte "ou"
 */
export const AuthDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  
  '&::before, &::after': {
    borderColor: theme.palette.grey[200],
    
    // Dark mode
    ...(theme.palette.mode === 'dark' && {
      borderColor: theme.palette.grey[700],
    }),
  },
}));

/**
 * Texte dans le divider
 */
export const AuthDividerText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  fontSize: '0.75rem',
  padding: theme.spacing(0, 2),
}));

/**
 * Footer de la card auth (lien vers signup/login)
 */
export const AuthFooter = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  
  '& a': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
    fontWeight: 600,
    
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Lien de retour à l'accueil
 */
export const BackLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'component',
})(({ theme }) => ({
  marginTop: theme.spacing(3),
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  
  '&:hover': {
    color: theme.palette.primary.main,
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
    
    '&:hover': {
      color: theme.palette.primary.light,
    },
  }),
}));

/**
 * Container pour les boutons sociaux
 */
export const SocialButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

/**
 * Message d'erreur global du formulaire
 */
export const AuthErrorMessage = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.dark,
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  fontSize: '0.875rem',
  textAlign: 'center',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    color: theme.palette.error.light,
  }),
}));

/**
 * Message de succès
 */
export const AuthSuccessMessage = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  fontSize: '0.875rem',
  textAlign: 'center',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    color: theme.palette.success.light,
  }),
}));


export const ForgotPasswordLink = styled(Box)(({ theme }) => ({
  textAlign: 'right',
  marginTop: theme.spacing(1),
  
  '& a': {
    fontSize: '0.8125rem',
    color: theme.palette.text.secondary,
    textDecoration: 'none',
    
    '&:hover': {
      color: theme.palette.primary.main,
      textDecoration: 'underline',
    },
  },
}));
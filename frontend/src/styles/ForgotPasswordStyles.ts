import { styled } from '@mui/material/styles';
import { Box, Typography, Link } from '@mui/material';


export const ForgotPasswordContainer = styled(Box)(({ theme }) => ({
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


export const ForgotPasswordCard = styled(Box)(({ theme }) => ({
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
 * Header de la card (icône, titre, sous-titre)
 */
export const ForgotPasswordHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(4),
}));

/**
 * Icône du header
 */
export const ForgotPasswordIcon = styled('span')(({ theme }) => ({
  fontSize: '3.5rem',
  display: 'block',
  marginBottom: theme.spacing(2),
  lineHeight: 1,
}));

/**
 * Titre du header
 */
export const ForgotPasswordTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

/**
 * Sous-titre / description
 */
export const ForgotPasswordSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  fontSize: '0.875rem',
  lineHeight: 1.6,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Container du formulaire
 */
export const ForgotPasswordForm = styled('form')(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

/**
 * Message d'erreur
 */
export const ErrorMessage = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.dark,
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  fontSize: '0.875rem',
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: 'rgba(244, 67, 54, 0.15)',
    color: theme.palette.error.light,
  }),
}));

/**
 * Message de succès
 */
export const SuccessMessage = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.light,
  color: theme.palette.success.dark,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  fontSize: '0.875rem',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    color: theme.palette.success.light,
  }),
}));

/**
 * Icône de succès
 */
export const SuccessIcon = styled('span')({
  fontSize: '2.5rem',
  lineHeight: 1,
});

/**
 * Texte de succès principal
 */
export const SuccessTitle = styled(Typography)(() => ({
  fontWeight: 600,
  fontSize: '1rem',
  color: 'inherit',
}));

/**
 * Texte de succès secondaire
 */
export const SuccessText = styled(Typography)(() => ({
  fontSize: '0.875rem',
  color: 'inherit',
  opacity: 0.9,
}));

/**
 * Footer avec lien vers login
 */
export const ForgotPasswordFooter = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  marginTop: theme.spacing(2),
  
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
 * Lien de retour
 */
export const BackLink = styled(Link)(({ theme }) => ({
  marginTop: theme.spacing(3),
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  transition: 'color 0.2s ease',
  
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
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
 * Container pour les informations supplémentaires
 */
export const InfoBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.info.light,
  color: theme.palette.info.dark,
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(2),
  fontSize: '0.8125rem',
  lineHeight: 1.5,
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: 'rgba(33, 150, 243, 0.15)',
    color: theme.palette.info.light,
  }),
}));

/**
 * Container du bouton
 */
export const ButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));
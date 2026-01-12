import { styled } from '@mui/material/styles';
import { Box, Typography, LinearProgress } from '@mui/material';

/**
 * Container principal du widget crédits
 */
export const CreditsWidgetContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  borderRadius: (theme.shape.borderRadius as number) * 2,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

/**
 * Header du widget (icône + label)
 */
export const CreditsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

/**
 * Icône des crédits
 */
export const CreditsIcon = styled('span')({
  fontSize: '1.25rem',
  lineHeight: 1,
});

/**
 * Label "Crédits"
 */
export const CreditsLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.grey[600],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Container du montant
 */
export const CreditsAmountContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(0.5),
}));

/**
 * Nombre de crédits actuels
 */
export const CreditsCurrent = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
  lineHeight: 1,
}));

/**
 * Total des crédits
 */
export const CreditsTotal = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.grey[500],
}));

/**
 * Barre de progression des crédits
 */
export const CreditsProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  backgroundColor: theme.palette.grey[200],
  marginBottom: theme.spacing(1.5),
  
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: (theme.shape.borderRadius as number) * 2,
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));

/**
 * Container pour le bouton d'achat
 */
export const CreditsBuyContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));
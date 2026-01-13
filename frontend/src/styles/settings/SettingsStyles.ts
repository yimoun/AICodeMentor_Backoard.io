import { styled } from '@mui/material/styles';
import { Box, Typography, Switch, Chip } from '@mui/material';

/**
 * Container principal des settings
 */
export const SettingsMainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  overflowY: 'auto',
  backgroundColor: theme.palette.grey[50],
  minHeight: '100vh',
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[900],
  }),
}));

/**
 * Header des settings
 */
export const SettingsHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

/**
 * Titre des settings
 */
export const SettingsTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
}));

/**
 * Grille des settings (2 colonnes)
 */
export const SettingsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(3),
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

/**
 * Card de settings générique
 */
export const SettingsCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[1],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

/**
 * Titre de card
 */
export const CardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/**
 * Description de card
 */
export const CardDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(3),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/* ==================== SUBSCRIPTION CARD ==================== */

/**
 * Header de la subscription card
 */
export const SubscriptionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

/**
 * Badge du plan
 */
interface PlanBadgeProps {
  plan?: 'free' | 'starter' | 'pro' | 'enterprise';
}

export const PlanBadge = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'plan',
})<PlanBadgeProps>(({ theme, plan = 'pro' }) => {
  const colors: Record<string, { bg: string; color: string }> = {
    free: { bg: theme.palette.grey[200], color: theme.palette.grey[700] },
    starter: { bg: theme.palette.info.main, color: theme.palette.common.white },
    pro: { bg: theme.palette.primary.main, color: theme.palette.common.white },
    enterprise: { bg: theme.palette.warning.main, color: theme.palette.common.white },
  };

  return {
    backgroundColor: colors[plan].bg,
    color: colors[plan].color,
    fontSize: '0.75rem',
    fontWeight: 600,
    height: 26,
    
    '& .MuiChip-label': {
      padding: '0 12px',
    },
  };
});

/**
 * Détails de l'abonnement
 */
export const SubscriptionDetails = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

/**
 * Ligne de détail
 */
export const DetailRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  
  '&:last-child': {
    borderBottom: 'none',
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    borderBottomColor: theme.palette.grey[700],
  }),
}));

/**
 * Label de détail
 */
export const DetailLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  fontSize: '0.875rem',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Valeur de détail
 */
export const DetailValue = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
}));

/**
 * Actions de l'abonnement
 */
export const SubscriptionActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  flexWrap: 'wrap',
}));

/* ==================== CREDIT PACKS ==================== */

/**
 * Container des packs de crédits
 */
export const CreditPacksContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

/**
 * Pack de crédits (label wrapper)
 */
export const CreditPackLabel = styled('label')({
  flex: 1,
  cursor: 'pointer',
});

/**
 * Input radio caché
 */
export const CreditPackInput = styled('input')({
  display: 'none',
});

/**
 * Card du pack
 */
interface PackCardProps {
  selected?: boolean;
}

export const PackCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<PackCardProps>(({ theme, selected }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  backgroundColor: selected 
    ? 'rgba(237, 27, 47, 0.05)' 
    : theme.palette.grey[50],
  border: `2px solid ${selected ? theme.palette.primary.main : theme.palette.grey[200]}`,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  position: 'relative',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    borderColor: theme.palette.primary.main,
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: selected 
      ? 'rgba(237, 27, 47, 0.1)' 
      : theme.palette.grey[800],
    borderColor: selected ? theme.palette.primary.main : theme.palette.grey[700],
  }),
}));

/**
 * Badge du pack (Populaire)
 */
export const PackBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -10,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: '0.625rem',
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: (theme.shape.borderRadius as number) * 2,
}));

/**
 * Montant du pack
 */
export const PackAmount = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  lineHeight: 1.2,
}));

/**
 * Prix du pack
 */
export const PackPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  color: theme.palette.primary.main,
  marginTop: theme.spacing(0.5),
}));

/**
 * Économies du pack
 */
export const PackSavings = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.success.main,
  marginTop: theme.spacing(0.5),
}));

/* ==================== PREFERENCES ==================== */

/**
 * Liste des préférences
 */
export const PreferencesList = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

/**
 * Item de préférence
 */
export const PreferenceItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  cursor: 'pointer',
  
  '&:last-child': {
    borderBottom: 'none',
  },
  
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    borderBottomColor: theme.palette.grey[700],
    
    '&:hover': {
      backgroundColor: theme.palette.grey[700],
    },
  }),
}));

/**
 * Info de préférence
 */
export const PreferenceInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

/**
 * Nom de la préférence
 */
export const PreferenceName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
}));

/**
 * Description de la préférence
 */
export const PreferenceDesc = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.grey[500],
  marginTop: theme.spacing(0.25),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Toggle switch personnalisé
 */
export const PreferenceToggle = styled(Switch)(({ theme }) => ({
  width: 44,
  height: 24,
  padding: 0,
  
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 3,
    transitionDuration: '200ms',
    
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: theme.palette.common.white,
      
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary.main,
        opacity: 1,
        border: 0,
      },
    },
  },
  
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 18,
    height: 18,
  },
  
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.grey[300],
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 200,
    }),
    
    // Dark mode
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: theme.palette.grey[600],
    }),
  },
}));

/* ==================== PROFILE FORM ==================== */

/**
 * Formulaire de profil
 */
export const ProfileForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

/**
 * Ligne de formulaire (2 colonnes)
 */
export const FormRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

/**
 * Container du bouton de formulaire
 */
export const FormButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(1),
}));
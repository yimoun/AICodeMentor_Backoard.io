

import { styled } from '@mui/material/styles';
import { Box, Typography, Switch, Chip } from '@mui/material';


export const PricingSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 4),
  backgroundColor: theme.palette.grey[50],
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 3),
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5, 2),
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[900],
  }),
}));

/**
 * Titre de la section
 */
export const PricingTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '2.25rem',
  fontWeight: 800,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  
  [theme.breakpoints.down('md')]: {
    fontSize: '1.875rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

/**
 * Texte highlight dans le titre
 */
export const PricingHighlight = styled('span')(() => ({
  color: '#ED1B2F',
}));

/**
 * Sous-titre
 */
export const PricingSubtitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(4),
  fontSize: '1rem',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Container du toggle mensuel/annuel
 */
export const PricingToggle = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(5),
}));

/**
 * Label du toggle
 */
interface ToggleLabelProps {
  active?: boolean;
}

export const ToggleLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<ToggleLabelProps>(({ theme, active }) => ({
  fontSize: '0.875rem',
  color: active ? theme.palette.grey[900] : theme.palette.grey[500],
  fontWeight: active ? 600 : 400,
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: active ? theme.palette.common.white : theme.palette.grey[500],
  }),
}));

/**
 * Badge d'économie (-17%)
 */
export const SaveBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  fontSize: '0.625rem',
  fontWeight: 600,
  height: 20,
  
  '& .MuiChip-label': {
    padding: '0 6px',
  },
}));

/**
 * Switch personnalisé
 */
export const BillingSwitch = styled(Switch)(({ theme }) => ({
  width: 50,
  height: 26,
  padding: 0,
  
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 3,
    transitionDuration: '200ms',
    
    '&.Mui-checked': {
      transform: 'translateX(24px)',
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
    width: 20,
    height: 20,
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
      backgroundColor: theme.palette.grey[700],
    }),
  },
}));

/**
 * Grille de pricing cards
 */
export const PricingGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto',
  marginBottom: theme.spacing(6),
  
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
  },
}));

/**
 * Card de pricing individuelle
 */
interface PricingCardProps {
  popular?: boolean;
}

export const PricingCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'popular',
})<PricingCardProps>(({ theme, popular }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 3,
  padding: theme.spacing(4),
  border: `2px solid ${popular ? '#ED1B2F' : theme.palette.grey[200]}`,
  position: 'relative',
  transition: 'all 0.3s ease',
  
  ...(popular && {
    transform: 'scale(1.02)',
    zIndex: 1,
  }),
  
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[8],
  },
  
  [theme.breakpoints.down('lg')]: {
    transform: 'none',
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
    borderColor: popular ? theme.palette.primary.main : theme.palette.grey[700],
  }),
}));

/**
 * Badge "Le plus populaire"
 */
export const PopularBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -12,
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#ED1B2F',
  color: theme.palette.primary.contrastText,
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: '4px 16px',
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 4,
  whiteSpace: 'nowrap',
}));

/**
 * Header du plan (nom + prix)
 */
export const PlanHeader = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

/**
 * Nom du plan
 */
export const PlanName = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
}));

/**
 * Container du prix
 */
export const PlanPrice = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'baseline',
  gap: theme.spacing(0.5),
}));

/**
 * Prix principal
 */
export const Price = styled(Typography)(({ theme }) => ({
  fontSize: '2.25rem',
  fontWeight: 800,
  color: theme.palette.grey[900],
  lineHeight: 1,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.common.white,
  }),
}));

/**
 * Période (/mois)
 */
export const PricePeriod = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.grey[500],
}));

/**
 * Total annuel
 */
export const YearlyTotal = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.grey[500],
  marginBottom: theme.spacing(1),
}));

/**
 * Container des crédits
 */
export const PlanCredits = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),
  fontSize: '0.875rem',
  textAlign: 'center',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));

/**
 * Nombre de crédits
 */
export const CreditsAmount = styled('span')(() => ({
  fontWeight: 700,
  color: '#ED1B2F',
}));

/**
 * Liste des features
 */
export const PlanFeatures = styled('ul')(({ theme }) => ({
  listStyle: 'none',
  padding: 0,
  margin: 0,
  marginBottom: theme.spacing(3),
}));

/**
 * Feature item
 */
interface PlanFeatureItemProps {
  disabled?: boolean;
}

export const PlanFeatureItem = styled('li', {
  shouldForwardProp: (prop) => prop !== 'disabled',
})<PlanFeatureItemProps>(({ theme, disabled }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
  fontSize: '0.875rem',
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
  color: disabled ? theme.palette.grey[400] : theme.palette.text.primary,
  
  '&:last-child': {
    borderBottom: 'none',
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    borderBottomColor: theme.palette.grey[700],
    color: disabled ? theme.palette.grey[600] : theme.palette.grey[300],
  }),
}));

/**
 * Icône check
 */
export const CheckIcon = styled('span')(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 'bold',
  fontSize: '1rem',
}));

/**
 * Icône cross
 */
export const CrossIcon = styled('span')(({ theme }) => ({
  color: theme.palette.grey[400],
  fontSize: '1rem',
}));

/**
 * Section info crédits
 */
export const CreditsInfoSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 2,
  maxWidth: 800,
  margin: '0 auto',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

/**
 * Titre de la section crédits
 */
export const CreditsInfoTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/**
 * Table des crédits
 */
export const CreditsTable = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

/**
 * Item de crédit
 */
export const CreditItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  textAlign: 'center',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));

/**
 * Action du crédit
 */
export const CreditAction = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(0.5),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Coût du crédit
 */
export const CreditCost = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 700,
  color: theme.palette.primary.main,
}));

/**
 * Note des crédits
 */
export const CreditsNote = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  textAlign: 'center',
  
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
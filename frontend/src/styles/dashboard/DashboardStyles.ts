import { styled } from '@mui/material/styles';
import { Box, Typography, Select, LinearProgress, Chip } from '@mui/material';

/**
 * Container principal du dashboard
 */
export const DashboardMainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  overflowY: 'auto',
  backgroundColor: theme.palette.grey[50],
  minHeight: '100vh',
  width: '120vh',
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[900],
  }),
}));

/**
 * Header du dashboard
 */
export const DashboardHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
  },
}));

/**
 * Titre du dashboard
 */
export const DashboardTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.primary,
}));

/**
 * Sous-titre du dashboard
 */
export const DashboardSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  fontSize: '0.875rem',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Actions du header
 */
export const HeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

/**
 * Select de période
 */
export const PeriodSelect = styled(Select)(({ theme }) => ({
  minWidth: 150,
  fontSize: '0.875rem',
  
  '& .MuiSelect-select': {
    padding: theme.spacing(1, 2),
  },
  
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.grey[300],
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.grey[700],
    },
  }),
}));

/**
 * Grille du dashboard
 */
export const DashboardGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

/**
 * Row de stats (4 colonnes)
 */
export const StatsRow = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(3),
  
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

/**
 * Card de statistique
 */
export const StatCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[1],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

/**
 * Icône de stat
 */
export const StatIcon = styled('span')({
  fontSize: '2rem',
  lineHeight: 1,
});

/**
 * Contenu de la stat
 */
export const StatContent = styled(Box)({
  flex: 1,
});

/**
 * Valeur de la stat
 */
export const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  lineHeight: 1.2,
  color: theme.palette.text.primary,
}));

/**
 * Label de la stat
 */
export const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.grey[600],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Changement de stat (positif/négatif)
 */
interface StatChangeProps {
  positive?: boolean;
}

export const StatChange = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'positive',
})<StatChangeProps>(({ theme, positive = true }) => ({
  marginLeft: 'auto',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: positive ? theme.palette.success.main : theme.palette.error.main,
  whiteSpace: 'nowrap',
}));

/**
 * Card générique du dashboard
 */
export const DashboardCard = styled(Box)(({ theme }) => ({
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
 * Sous-titre de card
 */
export const CardSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.grey[500],
  marginTop: theme.spacing(-2),
  marginBottom: theme.spacing(3),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Card de graphique (span 2 colonnes)
 */
export const ChartCard = styled(DashboardCard)(({ theme }) => ({
  // Cette card peut être étendue pour span 2 colonnes si on utilise grid
}));

/**
 * Container du graphique
 */
export const ChartPlaceholder = styled(Box)(({ theme }) => ({
  height: 200,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
}));

/**
 * Bar chart container
 */
export const BarChart = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(2),
  height: '100%',
  paddingBottom: theme.spacing(3),
}));

/**
 * Bar individuelle
 */
interface BarProps {
  isToday?: boolean;
}

export const Bar = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isToday',
})<BarProps>(({ theme, isToday }) => ({
  width: 40,
  backgroundColor: isToday ? theme.palette.primary.main : theme.palette.grey[200],
  borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
  position: 'relative',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  
  '&:hover': {
    backgroundColor: isToday 
      ? theme.palette.primary.dark 
      : theme.palette.primary.light,
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: isToday ? theme.palette.primary.main : theme.palette.grey[700],
  }),
}));

/**
 * Label de la bar
 */
export const BarLabel = styled('span')(({ theme }) => ({
  position: 'absolute',
  bottom: -24,
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: '0.6875rem',
  color: theme.palette.grey[500],
}));
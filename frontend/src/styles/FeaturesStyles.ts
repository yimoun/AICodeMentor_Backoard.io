import { styled } from '@mui/material/styles';
import { Box, Typography, Chip } from '@mui/material';


export const FeaturesSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 4),
  backgroundColor: theme.palette.background.paper,
  
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 3),
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(5, 2),
  },
}));

/**
 * Titre de la section
 */
export const FeaturesTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '2.25rem',
  fontWeight: 800,
  marginBottom: theme.spacing(6),
  color: theme.palette.text.primary,
  
  [theme.breakpoints.down('md')]: {
    fontSize: '1.875rem',
    marginBottom: theme.spacing(4),
  },
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));

/**
 * Mot en surbrillance dans le titre (rouge)
 */
export const FeaturesTitleHighlight = styled('span')(({ theme }) => ({
  color: '#ED1B2F',
}));

/**
 * Sous-titre optionnel
 */
export const FeaturesSubtitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  fontSize: '1.125rem',
  color: theme.palette.grey[600],
  maxWidth: 600,
  margin: '0 auto',
  marginBottom: theme.spacing(6),
  lineHeight: 1.7,
  
  [theme.breakpoints.down('md')]: {
    fontSize: '1rem',
    marginBottom: theme.spacing(4),
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Grille de features (4 colonnes)
 */
export const FeaturesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto',
  
  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: theme.spacing(2.5),
  },
  
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(2),
  },
}));

/**
 * Card de feature individuelle
 */
export const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(4),
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 2,
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'default',
  
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
    
    '&:hover': {
      boxShadow: `0 8px 30px rgba(0, 0, 0, 0.4)`,
    },
  }),
}));

/**
 * Icône de la feature (emoji ou icône)
 */
export const FeatureIcon = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  marginBottom: theme.spacing(2),
  lineHeight: 1,
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

/**
 * Titre de la feature
 */
export const FeatureTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
  color: theme.palette.text.primary,
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

/**
 * Description de la feature
 */
export const FeatureDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(2),
  lineHeight: 1.6,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));


export const FeatureTag = styled(Chip)(({ theme }) => ({
  backgroundColor: '#ED1B2F',
  color: theme.palette.primary.contrastText,
  fontSize: '0.6875rem',
  fontWeight: 600,
  height: 24,
  
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));

/**
 * Container pour tag secondaire/outline
 */
export const FeatureTagOutline = styled(Chip)(({ theme }) => ({
  backgroundColor: 'transparent',
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
  fontSize: '0.6875rem',
  fontWeight: 600,
  height: 24,
  
  '& .MuiChip-label': {
    padding: '0 12px',
  },
}));


export const FeaturesWithImageContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(8),
  maxWidth: 1200,
  margin: '0 auto',
  alignItems: 'center',
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    gap: theme.spacing(4),
  },
}));

/**
 * Liste de features (pour layout avec image)
 */
export const FeaturesList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

/**
 * Item de feature horizontal (pour liste)
 */
export const FeatureListItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'background-color 0.2s ease',
  
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    
    // Dark mode
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: theme.palette.grey[800],
    }),
  },
}));

/**
 * Icône pour feature list item
 */
export const FeatureListIcon = styled(Box)(({ theme }) => ({
  fontSize: '1.5rem',
  flexShrink: 0,
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.primary.light,
  borderRadius: theme.shape.borderRadius,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: 'rgba(237, 27, 47, 0.15)',
  }),
}));

/**
 * Contenu texte du feature list item
 */
export const FeatureListContent = styled(Box)({
  flex: 1,
});

/**
 * Titre pour feature list item
 */
export const FeatureListTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
  color: theme.palette.text.primary,
}));

/**
 * Description pour feature list item
 */
export const FeatureListDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  lineHeight: 1.5,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));
import { styled } from '@mui/material/styles';
import { Box, Typography, LinearProgress, Chip } from '@mui/material';

/**
 * Container de la liste des skills
 */
export const SkillsList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

/**
 * Row d'un skill
 */
export const SkillRow = styled(Box)(() => ({
  // Container principal
}));

/**
 * Header d'un skill
 */
export const SkillHeader = styled(Box)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

/**
 * Icône du skill
 */
export const SkillIcon = styled('span')({
  fontSize: '1.25rem',
  lineHeight: 1,
});

/**
 * Nom du skill
 */
export const SkillName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
}));

/**
 * Badge de niveau du skill
 */
interface SkillLevelBadgeProps {
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export const SkillLevelBadge = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'level',
})<SkillLevelBadgeProps>(({ theme, level }) => {
  const colors = {
    beginner: {
      bg: theme.palette.success.light,
      color: theme.palette.success.dark,
    },
    intermediate: {
      bg: theme.palette.info.light,
      color: theme.palette.info.dark,
    },
    advanced: {
      bg: theme.palette.warning.light,
      color: '#856404',
    },
    expert: {
      bg: theme.palette.error.light,
      color: theme.palette.error.dark,
    },
  };

  return {
    marginLeft: 'auto',
    backgroundColor: colors[level].bg,
    color: colors[level].color,
    fontSize: '0.6875rem',
    fontWeight: 600,
    height: 22,
    
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

/**
 * Barre de progression du skill
 */
export const SkillProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  backgroundColor: theme.palette.grey[200],
  marginBottom: theme.spacing(0.5),
  
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
 * XP du skill
 */
export const SkillXp = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.grey[500],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/* ==================== REVIEW LIST ==================== */

/**
 * Container de la liste de review
 */
export const ReviewList = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

/**
 * Item de review
 */
interface ReviewItemProps {
  urgent?: boolean;
}

export const ReviewItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'urgent',
})<ReviewItemProps>(({ theme, urgent }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: urgent 
    ? theme.palette.error.light 
    : theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: urgent 
      ? 'rgba(244, 67, 54, 0.15)' 
      : theme.palette.grey[800],
  }),
}));

/**
 * Icône de review
 */
export const ReviewIcon = styled('span')({
  fontSize: '1.25rem',
  lineHeight: 1,
});

/**
 * Contenu de review
 */
export const ReviewContent = styled(Box)({
  flex: 1,
});

/**
 * Topic de review
 */
export const ReviewTopic = styled(Typography)(({ theme }) => ({
  display: 'block',
  fontWeight: 600,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
}));

/**
 * Raison de review
 */
export const ReviewReason = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.grey[600],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/* ==================== BADGES GRID ==================== */

/**
 * Grille de badges
 */
export const BadgesGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(2),
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

/**
 * Item de badge
 */
interface BadgeItemProps {
  earned?: boolean;
}

export const BadgeItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'earned',
})<BadgeItemProps>(({ theme, earned }) => ({
  textAlign: 'center',
  padding: theme.spacing(2),
  backgroundColor: earned 
    ? theme.palette.warning.light 
    : theme.palette.grey[50],
  borderRadius: (theme.shape.borderRadius as number) * 2,
  opacity: earned ? 1 : 0.5,
  transition: 'opacity 0.2s ease, transform 0.2s ease',
  
  ...(earned && {
    '&:hover': {
      transform: 'scale(1.02)',
    },
  }),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: earned 
      ? 'rgba(255, 193, 7, 0.2)' 
      : theme.palette.grey[800],
  }),
}));

/**
 * Icône de badge
 */
export const BadgeIcon = styled('span')({
  fontSize: '2rem',
  display: 'block',
  marginBottom: 8,
  lineHeight: 1,
});

/**
 * Nom du badge
 */
export const BadgeName = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.text.primary,
}));

/**
 * Progression du badge
 */
export const BadgeProgress = styled(Typography)(({ theme }) => ({
  fontSize: '0.625rem',
  color: theme.palette.grey[500],
  marginTop: theme.spacing(0.5),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/* ==================== CREDITS USAGE ==================== */

/**
 * Container de l'utilisation des crédits
 */
export const CreditsUsageContainer = styled(Box)(() => ({
  // Container principal
}));

/**
 * Barre d'utilisation
 */
export const UsageBar = styled(Box)(({ theme }) => ({
  height: 24,
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  overflow: 'hidden',
  marginBottom: theme.spacing(2),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));

/**
 * Segment de la barre d'utilisation
 */
interface UsageSegmentProps {
  variant: 'questions' | 'reviews' | 'debug';
}

export const UsageSegment = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<UsageSegmentProps>(({ theme, variant }) => {
  const colors = {
    questions: theme.palette.primary.main,
    reviews: theme.palette.info.main,
    debug: theme.palette.warning.main,
  };

  return {
    height: '100%',
    backgroundColor: colors[variant],
    transition: 'width 0.5s ease',
  };
});

/**
 * Légende de l'utilisation
 */
export const UsageLegend = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
}));

/**
 * Item de légende
 */
export const LegendItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
}));

/**
 * Couleur de légende
 */
interface LegendColorProps {
  variant: 'questions' | 'reviews' | 'debug';
}

export const LegendColor = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<LegendColorProps>(({ theme, variant }) => {
  const colors = {
    questions: theme.palette.primary.main,
    reviews: theme.palette.info.main,
    debug: theme.palette.warning.main,
  };

  return {
    width: 12,
    height: 12,
    borderRadius: (theme.shape.borderRadius as number) / 2,
    backgroundColor: colors[variant],
  };
});

/**
 * Résumé des crédits
 */
export const CreditsSummary = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.8125rem',
  color: theme.palette.grey[600],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));
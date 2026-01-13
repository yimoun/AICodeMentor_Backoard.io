import { styled } from '@mui/material/styles';
import { Box, Typography, Chip, LinearProgress } from '@mui/material';

/* ==================== VARIABLES ==================== */
const colors = {
  gold: '#FFD700',
  goldDark: '#B8860B',
  silver: '#C0C0C0',
  silverDark: '#A8A8A8',
  bronze: '#CD7F32',
  bronzeDark: '#8B4513',
  linkedinBlue: '#0A66C2',
  success: '#28A745',
  warning: '#FFC107',
};

/* ==================== MAIN CONTENT ==================== */
export const BadgesMainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  overflowY: 'auto',
  backgroundColor: theme.palette.grey[50],
  minHeight: '100vh',

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[900],
  }),
}));

/* ==================== PAGE HEADER ==================== */
export const PageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: theme.spacing(4),

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
}));

export const PageTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 700,
  marginBottom: theme.spacing(0.5),
}));

export const PageSubtitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  fontSize: '0.875rem',
}));

export const HeaderActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),

  [theme.breakpoints.down('sm')]: {
    width: '100%',
    flexDirection: 'column',
  },
}));

/* ==================== STATS ==================== */
export const BadgesStatsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: theme.spacing(2.5),
  marginBottom: theme.spacing(5),

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const StatCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2.5),
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 1.5 : 12,
  boxShadow: theme.shadows[1],
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const StatIcon = styled(Box)({
  fontSize: '2rem',
});

export const StatValue = styled(Typography)(({ theme }) => ({
  display: 'block',
  fontSize: '1.5rem',
  fontWeight: 700,
}));

export const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.grey[600],
}));

/* ==================== SECTIONS ==================== */
export const Section = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2.5),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
}));

export const SectionBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: colors.linkedinBlue,
  color: theme.palette.common.white,
  fontSize: '0.6875rem',
  fontWeight: 600,
  height: 24,
}));

/* ==================== CERTIFICATIONS ==================== */
export const CertificationsGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(2.5),

  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: '1fr',
  },
}));

interface CertificationCardContainerProps {
  status?: 'earned' | 'in-progress';
}

export const CertificationCardContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'status',
})<CertificationCardContainerProps>(({ theme, status = 'earned' }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : 16,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[2],
  display: 'grid',
  gridTemplateColumns: 'auto 1fr',
  gap: theme.spacing(2.5),
  transition: 'all 0.25s ease',
  border: '2px solid transparent',

  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },

  ...(status === 'earned' && {
    borderColor: theme.palette.grey[200],
  }),

  ...(status === 'in-progress' && {
    borderColor: colors.warning,
    background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, #FFFEF5 100%)`,
  }),

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const CertBadge = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 8,
});

interface LevelRingProps {
  level?: 'gold' | 'silver' | 'bronze' | 'empty';
}

export const CertIcon = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'level',
})<{ level: 'gold' | 'silver' | 'bronze' | 'empty' }>({
  position: 'relative',
  width: 80,
  height: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const SkillEmoji = styled(Box)({
  fontSize: '2.5rem',
  zIndex: 1,
});

export const LevelRing = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'level',
})<LevelRingProps>(({ level = 'empty' }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  border: '4px solid',

  ...(level === 'gold' && {
    borderColor: colors.gold,
    boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
  }),

  ...(level === 'silver' && {
    borderColor: colors.silver,
    boxShadow: '0 0 15px rgba(192, 192, 192, 0.4)',
  }),

  ...(level === 'bronze' && {
    borderColor: colors.bronze,
    boxShadow: '0 0 15px rgba(205, 127, 50, 0.4)',
  }),

  ...(level === 'empty' && {
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  }),
}));

export const CertLevel = styled(Typography)(({ theme }) => ({
  fontSize: '0.625rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 1,
  color: theme.palette.grey[600],
}));

export const CertInfo = styled(Box)({});

export const CertTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  fontWeight: 700,
  marginBottom: theme.spacing(1),
}));

export const CertDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(1.5),
}));

export const CertMeta = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  fontSize: '0.75rem',
  color: theme.palette.grey[500],
  marginBottom: theme.spacing(1.5),
}));

export const CertTopics = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

interface TopicTagProps {
  variant?: 'success' | 'partial' | 'locked';
}

export const TopicTag = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<TopicTagProps>(({ theme, variant = 'success' }) => ({
  fontSize: '0.6875rem',
  padding: '4px 10px',
  borderRadius: 9999,

  ...(variant === 'success' && {
    backgroundColor: colors.success,
    color: theme.palette.common.white,
  }),

  ...(variant === 'partial' && {
    backgroundColor: colors.warning,
    color: theme.palette.grey[800],
  }),

  ...(variant === 'locked' && {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[500],
  }),
}));

export const CertProgress = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export const ProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 9999,
  backgroundColor: theme.palette.grey[200],
  marginBottom: theme.spacing(1),

  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: 9999,
  },
}));

export const ProgressText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.grey[600],
}));

export const CertActions = styled(Box)(({ theme }) => ({
  gridColumn: 'span 2',
  display: 'flex',
  gap: theme.spacing(1),
  paddingTop: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.grey[100]}`,

  [theme.breakpoints.down('sm')]: {
    gridColumn: 'span 1',
    flexWrap: 'wrap',
  },
}));

/* ==================== BADGES ==================== */
export const BadgesCategoriesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

export const BadgeCategoryContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : 16,
  boxShadow: theme.shadows[1],

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

export const BadgesRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

interface BadgeItemContainerProps {
  earned?: boolean;
  locked?: boolean;
  rare?: boolean;
}

export const BadgeItemContainer = styled(Box, {
  shouldForwardProp: (prop) => !['earned', 'locked', 'rare'].includes(prop as string),
})<BadgeItemContainerProps>(({ theme, earned, locked, rare }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 1.5 : 12,
  backgroundColor: theme.palette.grey[50],
  minWidth: 100,
  transition: 'all 0.25s ease',
  cursor: 'pointer',
  position: 'relative',

  '&:hover': {
    transform: 'scale(1.05)',
  },

  ...(earned && {
    background: 'linear-gradient(135deg, #FFF9E6 0%, #FFFEF5 100%)',
    border: `1px solid ${colors.gold}`,
  }),

  ...(locked && {
    opacity: 0.4,
    filter: 'grayscale(1)',
  }),

  ...(rare && {
    background: 'linear-gradient(135deg, #E8F4FD 0%, #F0E6FF 100%)',
    border: '1px solid #9B59B6',
  }),

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));

export const BadgeVisual = styled(Box)({
  position: 'relative',
  width: 60,
  height: 60,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const BadgeEmoji = styled(Box)({
  fontSize: '2.25rem',
});

export const BadgeCount = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: -4,
  right: -4,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  fontSize: '0.6875rem',
  fontWeight: 700,
  padding: '2px 6px',
  borderRadius: 9999,
  minWidth: 20,
  textAlign: 'center',
}));

export const BadgeProgress = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: -4,
  right: -4,
  backgroundColor: theme.palette.grey[600],
  color: theme.palette.common.white,
  fontSize: '0.5625rem',
  fontWeight: 600,
  padding: '2px 6px',
  borderRadius: 9999,
}));

export const BadgeName = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 600,
  textAlign: 'center',
  color: theme.palette.grey[700],

  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[300],
  }),
}));

/* ==================== BADGE PROGRESS INDICATOR ==================== */
interface BadgeProgressIndicatorProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export const BadgeProgressIndicatorContainer = styled(Box, {
  shouldForwardProp: (prop) => !['value', 'size'].includes(prop as string),
})<BadgeProgressIndicatorProps>(({ theme, size = 'md' }) => {
  const sizes = {
    sm: { width: 40, height: 40, fontSize: '0.625rem', strokeWidth: 3 },
    md: { width: 60, height: 60, fontSize: '0.75rem', strokeWidth: 4 },
    lg: { width: 80, height: 80, fontSize: '0.875rem', strokeWidth: 5 },
  };

  return {
    position: 'relative',
    width: sizes[size].width,
    height: sizes[size].height,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
});

export const ProgressRingSvg = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  transform: 'rotate(-90deg)',
});

export const ProgressRingBg = styled('circle')(({ theme }) => ({
  fill: 'none',
  stroke: theme.palette.grey[200],
  strokeWidth: 4,
}));

interface ProgressRingFillProps {
  progress: number;
  color?: 'primary' | 'gold' | 'silver' | 'bronze' | 'success';
}

export const ProgressRingFill = styled('circle', {
  shouldForwardProp: (prop) => !['progress', 'color'].includes(prop as string),
})<ProgressRingFillProps>(({ theme, progress, color = 'primary' }) => {
  const colors: Record<string, string> = {
    primary: theme.palette.primary.main,
    gold: '#FFD700',
    silver: '#A8A8A8',
    bronze: '#CD7F32',
    success: theme.palette.success.main,
  };

  // Calcul du dasharray pour un cercle de rayon 15.9155 (circumference ≈ 100)
  const circumference = 100;
  const strokeDasharray = `${progress}, ${circumference}`;

  return {
    fill: 'none',
    stroke: colors[color],
    strokeWidth: 4,
    strokeLinecap: 'round',
    strokeDasharray,
    transition: 'stroke-dasharray 0.5s ease',
  };
});

export const ProgressRingText = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  zIndex: 1,
}));

/* ==================== TOOLTIP ==================== */
export const BadgeTooltip = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: '6px 12px',
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.6875rem',
  whiteSpace: 'nowrap',
  marginBottom: theme.spacing(1),
  zIndex: 10,
  opacity: 0,
  visibility: 'hidden',
  transition: 'all 0.2s ease',

  '.badge-item:hover &': {
    opacity: 1,
    visibility: 'visible',
  },
}));
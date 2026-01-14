import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

/* ==================== VARIABLES ==================== */
const colors = {
  gold: '#FFD700',
  goldDark: '#B8860B',
  silver: '#C0C0C0',
  silverDark: '#A8A8A8',
  bronze: '#CD7F32',
  bronzeDark: '#8B4513',
  success: '#28A745',
  warning: '#FFC107',
  mcgillRed: '#ED1B2F',
  // Heatmap colors
  level0: '#EBEDF0',
  level1: '#9BE9A8',
  level2: '#40C463',
  level3: '#30A14E',
  level4: '#216E39',
};

/* ==================== CONTAINER ==================== */
export const PublicProfileContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.grey[50],

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[900],
  }),
}));

/* ==================== BANNER ==================== */
export const ProfileBanner = styled(Box)(() => ({
  position: 'relative',
  height: 280,
  background: `linear-gradient(135deg, ${colors.mcgillRed} 0%, #8B0000 100%)`,
  overflow: 'hidden',
}));

export const BannerGradient = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
});

export const ProfileHeaderContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  maxWidth: 1000,
  margin: '0 auto',
  padding: theme.spacing(5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  height: '100%',

  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(3),
  },
}));

export const ProfileAvatarLarge = styled(Box)(({ theme }) => ({
  width: 120,
  height: 120,
  backgroundColor: theme.palette.common.white,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.5rem',
  fontWeight: 700,
  color: colors.mcgillRed,
  position: 'relative',
  boxShadow: theme.shadows[8],

  [theme.breakpoints.down('md')]: {
    width: 100,
    height: 100,
    fontSize: '2rem',
  },
}));

export const AvatarBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  right: 0,
  fontSize: '1.75rem',
  backgroundColor: theme.palette.common.white,
  borderRadius: '50%',
  padding: 4,
}));

export const ProfileIdentity = styled(Box)(({ theme }) => ({
  flex: 1,
  color: theme.palette.common.white,

  [theme.breakpoints.down('md')]: {
    flex: 'unset',
  },
}));

export const ProfileName = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 700,
  marginBottom: 4,
});

export const ProfileTagline = styled(Typography)({
  fontSize: '1rem',
  opacity: 0.9,
  marginBottom: 12,
});

export const ProfileStatsInline = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2.5),

  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
}));

export const ProfileStat = styled(Typography)({
  fontSize: '0.875rem',
  opacity: 0.9,
});

export const ProfileShareActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),

  [theme.breakpoints.down('md')]: {
    flexDirection: 'row',
    marginTop: theme.spacing(2),
  },
}));

/* ==================== CONTENT ==================== */
export const ProfileContent = styled(Box)(({ theme }) => ({
  maxWidth: 1000,
  margin: '0 auto',
  padding: theme.spacing(5),

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  },
}));

export const ProfileSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.25rem',
  fontWeight: 700,
  marginBottom: theme.spacing(2.5),
}));

export const SectionDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  fontSize: '0.875rem',
  marginTop: theme.spacing(-1.5),
  marginBottom: theme.spacing(2.5),
}));

/* ==================== SKILLS SHOWCASE ==================== */
export const SkillsShowcaseGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: theme.spacing(2.5),

  [theme.breakpoints.down('lg')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },

  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const SkillShowcaseCardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  padding: theme.spacing(3),
  boxShadow: theme.shadows[2],
  transition: 'all 0.25s ease',

  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const ShowcaseHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(2),
}));

export const ShowcaseIcon = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  backgroundColor: theme.palette.grey[100],
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.75rem',

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));

export const ShowcaseInfo = styled(Box)({
  flex: 1,
});

export const ShowcaseSkillName = styled(Typography)({
  fontSize: '1rem',
  fontWeight: 700,
  marginBottom: 4,
});

interface ShowcaseLevelProps {
  level?: 'gold' | 'silver' | 'bronze';
}

export const ShowcaseLevel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'level',
})<ShowcaseLevelProps>(({ level = 'gold' }) => {
  const gradients: Record<string, { bg: string; color: string }> = {
    gold: {
      bg: `linear-gradient(135deg, ${colors.gold} 0%, ${colors.goldDark} 100%)`,
      color: '#1A1A1A',
    },
    silver: {
      bg: `linear-gradient(135deg, ${colors.silver} 0%, ${colors.silverDark} 100%)`,
      color: '#1A1A1A',
    },
    bronze: {
      bg: `linear-gradient(135deg, ${colors.bronze} 0%, ${colors.bronzeDark} 100%)`,
      color: '#FFFFFF',
    },
  };

  return {
    display: 'inline-block',
    fontSize: '0.6875rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    padding: '2px 8px',
    borderRadius: 4,
    background: gradients[level].bg,
    color: gradients[level].color,
  };
});

export const ShowcaseScore = styled(Box)({
  marginLeft: 'auto',
});

export const ScoreRing = styled(Box)({
  position: 'relative',
  width: 50,
  height: 50,
});

export const ScoreRingSvg = styled('svg')({
  transform: 'rotate(-90deg)',
  width: '100%',
  height: '100%',
});

export const ScoreRingBg = styled('path')(({ theme }) => ({
  fill: 'none',
  stroke: theme.palette.grey[200],
  strokeWidth: 3,
}));

interface ScoreRingFillProps {
  color?: 'gold' | 'silver' | 'bronze';
}

export const ScoreRingFill = styled('path', {
  shouldForwardProp: (prop) => prop !== 'color',
})<ScoreRingFillProps>(({ color = 'gold' }) => {
  const strokeColors: Record<string, string> = {
    gold: colors.gold,
    silver: colors.silverDark,
    bronze: colors.bronze,
  };

  return {
    fill: 'none',
    stroke: strokeColors[color],
    strokeWidth: 3,
    strokeLinecap: 'round',
  };
});

export const ScoreText = styled(Typography)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '0.75rem',
  fontWeight: 700,
});

export const ShowcaseTopics = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(0.75),
  marginBottom: theme.spacing(2),
}));

interface TopicPillProps {
  variant?: 'default' | 'success' | 'warning';
}

export const TopicPill = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'variant',
})<TopicPillProps>(({ theme, variant = 'default' }) => ({
  fontSize: '0.6875rem',
  padding: '4px 10px',
  borderRadius: 9999,

  ...(variant === 'default' && {
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.grey[600],
  }),

  ...(variant === 'success' && {
    backgroundColor: colors.success,
    color: theme.palette.common.white,
  }),

  ...(variant === 'warning' && {
    backgroundColor: colors.warning,
    color: theme.palette.grey[800],
  }),
}));

export const ShowcaseFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingTop: theme.spacing(1.5),
  borderTop: `1px solid ${theme.palette.grey[100]}`,
  fontSize: '0.6875rem',

  ...(theme.palette.mode === 'dark' && {
    borderTopColor: theme.palette.grey[700],
  }),
}));

export const VerifiedBadge = styled(Typography)({
  color: colors.success,
  fontSize: '0.6875rem',
});

export const CertDate = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[500],
  fontSize: '0.6875rem',
}));

/* ==================== FEATURED BADGES ==================== */
export const FeaturedBadgesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
}));

export const FeaturedBadgeItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(1.5, 2.5),
  borderRadius: 9999,
  boxShadow: theme.shadows[1],

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const FeaturedBadgeIcon = styled(Box)({
  fontSize: '1.5rem',
});

export const FeaturedBadgeLabel = styled(Typography)({
  fontSize: '0.875rem',
  fontWeight: 600,
});

/* ==================== ACTIVITY HEATMAP ==================== */
export const ActivityHeatmapContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[1],

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const HeatmapGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 4,
  marginBottom: theme.spacing(2),
  justifyContent: 'center',
}));

export const HeatmapWeek = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

interface HeatmapDayProps {
  level?: 0 | 1 | 2 | 3 | 4;
  isToday?: boolean;
}

export const HeatmapDay = styled(Box, {
  shouldForwardProp: (prop) => !['level', 'isToday'].includes(prop as string),
})<HeatmapDayProps>(({ level = 0, isToday }) => {
  const levelColors: Record<number, string> = {
    0: colors.level0,
    1: colors.level1,
    2: colors.level2,
    3: colors.level3,
    4: colors.level4,
  };

  return {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: levelColors[level],

    ...(isToday && {
      outline: `2px solid ${colors.mcgillRed}`,
    }),
  };
});

export const HeatmapLegend = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  fontSize: '0.6875rem',
  color: theme.palette.grey[500],
}));

export const LegendSquares = styled(Box)({
  display: 'flex',
  gap: 2,
});

/* ==================== EMBED SECTION ==================== */
export const EmbedSectionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[1],

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const EmbedOptions = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: theme.spacing(4),

  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const EmbedOption = styled(Box)({});

export const EmbedOptionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 600,
  marginBottom: theme.spacing(1.5),
}));

export const EmbedPreview = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

/* Mini Badge */
export const MiniBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 10,
  backgroundColor: theme.palette.background.paper,
  padding: '8px 16px',
  borderRadius: 9999,
  border: `1px solid ${theme.palette.grey[200]}`,
  boxShadow: theme.shadows[1],
}));

export const MiniAvatar = styled(Box)(({ theme }) => ({
  width: 32,
  height: 32,
  backgroundColor: colors.mcgillRed,
  color: theme.palette.common.white,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 700,
}));

export const MiniInfo = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

export const MiniName = styled(Typography)({
  fontSize: '0.8125rem',
  fontWeight: 600,
});

export const MiniLevel = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.grey[500],
}));

export const MiniLogo = styled(Box)({
  fontSize: '1.25rem',
});

/* Detailed Badge */
export const DetailedBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
  padding: theme.spacing(2),
  maxWidth: 280,
  boxShadow: theme.shadows[1],
}));

export const DbHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderBottom: `1px solid ${theme.palette.grey[100]}`,
}));

export const DbAvatar = styled(Box)(({ theme }) => ({
  width: 40,
  height: 40,
  backgroundColor: colors.mcgillRed,
  color: theme.palette.common.white,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700,
}));

export const DbInfo = styled(Box)({});

export const DbName = styled(Typography)({
  display: 'block',
  fontSize: '0.875rem',
  fontWeight: 600,
});

export const DbSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.grey[500],
}));

export const DbSkills = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1.5),
}));

export const DbSkill = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.grey[50]}`,

  '&:last-child': {
    borderBottom: 'none',
  },
}));

export const DbSkillIcon = styled(Box)({
  fontSize: '1.25rem',
});

export const DbSkillName = styled(Typography)({
  flex: 1,
  fontSize: '0.8125rem',
  fontWeight: 500,
});

export const DbLevel = styled(Box)(({ theme }) => ({
  fontSize: '0.625rem',
  backgroundColor: theme.palette.grey[100],
  padding: '2px 6px',
  borderRadius: 4,
}));

export const DbFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1.5),
  fontSize: '0.75rem',
  color: theme.palette.grey[600],
}));

/* Embed Code */
export const EmbedCode = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.grey[900],
  padding: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
}));

export const EmbedCodeText = styled('code')(({ theme }) => ({
  flex: 1,
  fontFamily: '"Fira Code", monospace',
  fontSize: '0.6875rem',
  color: theme.palette.grey[300],
  overflowX: 'auto',
  whiteSpace: 'nowrap',
}));

export const CopyButton = styled('button')({
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: 0,
});

/* ==================== FOOTER ==================== */
export const ProfileFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  padding: theme.spacing(2.5),
}));

export const FooterContent = styled(Box)({
  maxWidth: 1000,
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

export const FooterBrand = styled(Typography)({
  fontWeight: 600,
});

export const FooterLink = styled(Box)(() => ({
  '& a': {
    color: '#FF6B6B',
    textDecoration: 'none',

    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

/* ==================== BACK BUTTON ==================== */
export const BackToDashboard = styled('button')(({ theme }) => ({
  position: 'fixed',
  top: 20,
  left: 20,
  backgroundColor: theme.palette.common.white,
  border: 'none',
  padding: '10px 16px',
  borderRadius: 9999,
  boxShadow: theme.shadows[4],
  cursor: 'pointer',
  fontWeight: 600,
  zIndex: 100,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),

  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  },
}));
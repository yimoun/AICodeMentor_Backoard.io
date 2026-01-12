import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

/**
 * Container principal du widget streak
 */
export const StreakWidgetContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  background: `linear-gradient(135deg, #FF6B6B 0%, ${theme.palette.primary.main} 100%)`,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  color: theme.palette.common.white,
}));

/**
 * Icône du streak (feu)
 */
export const StreakIcon = styled('span')({
  fontSize: '1.5rem',
  lineHeight: 1,
});

/**
 * Nombre de jours de streak
 */
export const StreakCount = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 800,
  lineHeight: 1,
}));

/**
 * Label du streak
 */
export const StreakLabel = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.9,
});
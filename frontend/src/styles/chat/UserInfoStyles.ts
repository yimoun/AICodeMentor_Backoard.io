import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar } from '@mui/material';

/**
 * Container principal UserInfo
 */
export const UserInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

/**
 * Avatar de l'utilisateur
 */
export const UserAvatar = styled(Avatar)(({ theme }) => ({
  width: 44,
  height: 44,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 700,
  fontSize: '1rem',
}));

/**
 * Container des détails utilisateur
 */
export const UserDetails = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
});

/**
 * Nom de l'utilisateur
 */
export const UserName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.9375rem',
  color: theme.palette.text.primary,
  lineHeight: 1.3,
}));

/**
 * Plan de l'utilisateur
 */
export const UserPlan = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.grey[500],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));
import { styled } from '@mui/material/styles';
import { Box, ListItemButton, Typography } from '@mui/material';

/**
 * Container de la navigation sidebar
 */
export const SidebarNavContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
}));

/**
 * Container d'un item de navigation
 */
interface NavItemContainerProps {
  active?: boolean;
}

export const NavItemContainer = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<NavItemContainerProps>(({ theme, active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  color: active ? theme.palette.primary.main : theme.palette.grey[600],
  backgroundColor: active ? 'rgba(237, 27, 47, 0.1)' : 'transparent',
  transition: 'all 0.2s ease',
  marginBottom: theme.spacing(0.5),
  textDecoration: 'none',
  
  '&:hover': {
    backgroundColor: active ? 'rgba(237, 27, 47, 0.1)' : theme.palette.grey[50],
    color: active ? theme.palette.primary.main : theme.palette.grey[900],
  },
  
  '&:last-child': {
    marginBottom: 0,
  },
  
  '&.Mui-disabled': {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: active ? theme.palette.primary.light : theme.palette.grey[400],
    backgroundColor: active ? 'rgba(237, 27, 47, 0.15)' : 'transparent',
    
    '&:hover': {
      backgroundColor: active ? 'rgba(237, 27, 47, 0.15)' : theme.palette.grey[800],
      color: active ? theme.palette.primary.light : theme.palette.common.white,
    },
  }),
}));

/**
 * Icône de navigation
 */
export const NavIcon = styled('span')(() => ({
  fontSize: '1.25rem',
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flexShrink: 0,
}));

/**
 * Texte de navigation
 */
export const NavText = styled(Typography)(() => ({
  fontWeight: 500,
  fontSize: '0.875rem',
  flex: 1,
}));

/**
 * Badge de notification
 */
export const NavBadge = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '0.75rem',
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 2 : 16,
  minWidth: 20,
  textAlign: 'center',
}));

/**
 * Divider entre sections de navigation
 */
export const NavDivider = styled(Box)(({ theme }) => ({
  height: 1,
  backgroundColor: theme.palette.grey[200],
  margin: theme.spacing(2, 0),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));

/**
 * Titre de section de navigation
 */
export const NavSectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: theme.palette.grey[500],
  padding: theme.spacing(2, 2, 1, 2),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[500],
  }),
}));
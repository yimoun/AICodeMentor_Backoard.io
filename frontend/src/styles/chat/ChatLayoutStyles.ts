import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

/**
 * Layout principal Chat/Dashboard (grid 2 colonnes)
 */
export const ChatLayoutContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '280px 1fr',
  minHeight: '100vh',
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

/**
 * Layout Dashboard (même structure)
 */
export const DashboardLayoutContainer = styled(ChatLayoutContainer)({});
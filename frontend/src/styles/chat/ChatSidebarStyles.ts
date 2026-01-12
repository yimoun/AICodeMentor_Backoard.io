import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

/**
 * Sidebar principale du chat (colonne gauche)
 */
export const ChatSidebarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.grey[200]}`,
  display: 'flex',
  flexDirection: 'column',
  position: 'sticky',
  top: 0,
  height: '100vh',
  overflowY: 'auto',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[900],
    borderRightColor: theme.palette.grey[800],
  }),
  
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

/**
 * Header de la sidebar
 */
export const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    borderBottomColor: theme.palette.grey[800],
  }),
}));
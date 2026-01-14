import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

/**
 * Container principal de la zone de chat
 */
export const ChatMainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: theme.palette.grey[50],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[900],
  }),
}));

/**
 * Header bar du chat
 */
export const ChatHeaderBar = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 3),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.grey[200]}`,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
    borderBottomColor: theme.palette.grey[700],
  }),
}));

/**
 * Contexte du chat (skill + topic)
 */
export const ChatContext = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: '0.875rem',
}));

/**
 * Skill dans le contexte
 */
export const ContextSkill = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '0.875rem',
  color: theme.palette.text.primary,
}));

/**
 * Séparateur dans le contexte
 */
export const ContextSeparator = styled('span')(({ theme }) => ({
  color: theme.palette.grey[400],
}));

/**
 * Topic dans le contexte
 */
export const ContextTopic = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Actions du chat (historique, nouveau chat)
 */
export const ChatActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}));

/**
 * Container des messages
 */
export const MessagesContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  overflowY: 'auto',
}));
import { styled, keyframes } from '@mui/material/styles';
import { Box, Typography, IconButton, Chip } from '@mui/material';

/**
 * Animation pour les dots de typing
 */
const typingAnimation = keyframes`
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
`;

/**
 * Container principal de l'input
 */
export const ChatInputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2, 3, 3),
  backgroundColor: theme.palette.background.paper,
  borderTop: `1px solid ${theme.palette.grey[200]}`,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
    borderTopColor: theme.palette.grey[700],
  }),
}));

/**
 * Contexte de l'input (typing indicator)
 */
export const InputContext = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  minHeight: 20,
}));

/**
 * Indicateur de frappe (Claude réfléchit...)
 */
export const TypingIndicator = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  fontSize: '0.8125rem',
  color: theme.palette.grey[500],
}));

/**
 * Dot animé pour le typing indicator
 */
export const TypingDot = styled('span')<{ delay?: number }>(({ theme, delay = 0 }) => ({
  width: 6,
  height: 6,
  backgroundColor: theme.palette.grey[400],
  borderRadius: '50%',
  animation: `${typingAnimation} 1.4s infinite`,
  animationDelay: `${delay}s`,
}));

/**
 * Wrapper de l'input
 */
export const InputWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-end',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.grey[50],
  border: `1px solid ${theme.palette.grey[200]}`,
  borderRadius: (Number(theme.shape.borderRadius) || 4) * 2,
  padding: theme.spacing(1),
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 3px rgba(237, 27, 47, 0.1)`,
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[900],
    borderColor: theme.palette.grey[700],
  }),
}));

/**
 * Bouton d'action (joindre du code)
 */
export const InputActionButton = styled(IconButton)(({ theme }) => ({
  fontSize: '1.25rem',
  padding: theme.spacing(1),
  color: theme.palette.grey[500],
  
  '&:hover': {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
  },
}));

/**
 * Textarea de l'input
 */
export const ChatTextArea = styled('textarea')(({ theme }) => ({
  flex: 1,
  border: 'none',
  backgroundColor: 'transparent',
  fontFamily: theme.typography.fontFamily,
  fontSize: '0.875rem',
  resize: 'none',
  padding: theme.spacing(1),
  minHeight: 44,
  maxHeight: 120,
  outline: 'none',
  color: theme.palette.text.primary,
  
  '&::placeholder': {
    color: theme.palette.grey[400],
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    '&::placeholder': {
      color: theme.palette.grey[500],
    },
  }),
}));

/**
 * Info de l'input (estimation de coût)
 */
export const InputInfo = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
}));

/**
 * Estimation du coût
 */
export const CostEstimate = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.grey[500],
  whiteSpace: 'nowrap',
}));

/**
 * Container des suggestions
 */
export const InputSuggestions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
  flexWrap: 'wrap',
}));

/**
 * Bouton de suggestion
 */
export const SuggestionChip = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.grey[200]}`,
  fontSize: '0.75rem',
  color: theme.palette.grey[600],
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
  },
  
  '& .MuiChip-label': {
    padding: '0 12px',
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
    borderColor: theme.palette.grey[700],
    color: theme.palette.grey[400],
    
    '&:hover': {
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
    },
  }),
}));

/**
 * Bouton d'envoi
 */
export const SendButtonContainer = styled(Box)(({ theme }) => ({
  '& .MuiButton-root': {
    padding: theme.spacing(1, 3),
    minWidth: 'auto',
  },
}));
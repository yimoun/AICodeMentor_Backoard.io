import { styled } from '@mui/material/styles';
import { Box, Typography, Chip } from '@mui/material';

/**
 * Container d'un message
 */
interface MessageContainerProps {
  sender: 'user' | 'assistant';
}

export const MessageContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sender',
})<MessageContainerProps>(({ theme, sender }) => ({
  marginBottom: theme.spacing(3),
  maxWidth: '80%',
  
  ...(sender === 'user' && {
    marginLeft: 'auto',
  }),
  
  ...(sender === 'assistant' && {
    marginRight: 'auto',
  }),
}));

/**
 * Header du message (indicateur LLM + temps)
 */
export const MessageHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

/**
 * Indicateur LLM (Claude, GPT, etc.)
 */
interface LlmIndicatorProps {
  llm?: 'claude' | 'gpt' | 'mistral' | 'gemini';
}

export const LlmIndicator = styled(Chip, {
  shouldForwardProp: (prop) => prop !== 'llm',
})<LlmIndicatorProps>(({ theme, llm = 'claude' }) => {
  const colors: Record<string, string> = {
    claude: '#D4A574',
    gpt: '#10A37F',
    mistral: '#FF7000',
    gemini: '#4285F4',
  };
  
  return {
    backgroundColor: colors[llm] || colors.claude,
    color: theme.palette.common.white,
    fontSize: '0.6875rem',
    fontWeight: 600,
    height: 22,
    
    '& .MuiChip-label': {
      padding: '0 8px',
    },
  };
});

/**
 * Heure du message
 */
export const MessageTime = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.grey[400],
}));

/**
 * Contenu du message
 */
interface MessageContentProps {
  sender: 'user' | 'assistant';
}

export const MessageContent = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sender',
})<MessageContentProps>(({ theme, sender }) => ({
  padding: theme.spacing(2),
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 2,
  fontSize: '0.875rem',
  lineHeight: 1.6,
  
  ...(sender === 'user' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderBottomRightRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) / 2,
  }),
  
  ...(sender === 'assistant' && {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey[200]}`,
    borderBottomLeftRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) / 2,
    
    // Dark mode
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: theme.palette.grey[800],
      borderColor: theme.palette.grey[700],
    }),
  }),
  
  '& p': {
    marginBottom: theme.spacing(1),
    
    '&:last-child': {
      marginBottom: 0,
    },
  },
  
  '& ul': {
    margin: `${theme.spacing(1)} 0`,
    paddingLeft: theme.spacing(3),
  },
  
  '& code': {
    backgroundColor: sender === 'user' 
      ? 'rgba(255, 255, 255, 0.2)' 
      : theme.palette.grey[100],
    padding: '2px 6px',
    borderRadius: theme.shape.borderRadius,
    fontSize: '0.8125rem',
    fontFamily: 'monospace',
    
    // Dark mode for assistant
    ...(sender === 'assistant' && theme.palette.mode === 'dark' && {
      backgroundColor: theme.palette.grey[700],
    }),
  },
}));

/**
 * Coût du message en crédits
 */
export const MessageCost = styled(Typography)(({ theme }) => ({
  fontSize: '0.6875rem',
  color: theme.palette.grey[400],
  marginTop: theme.spacing(1),
  textAlign: 'right',
}));

/**
 * Bloc de code inline
 */
export const InlineCodeBlock = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(2, 0),
  overflow: 'hidden',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: '#1a1a2e',
  }),
}));

/**
 * Header du bloc de code
 */
export const CodeBlockHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  backgroundColor: theme.palette.grey[800],
  fontSize: '0.75rem',
  color: theme.palette.grey[400],
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: '#16213e',
  }),
}));

/**
 * Contenu du bloc de code
 */
export const CodeBlockContent = styled('pre')(({ theme }) => ({
  padding: theme.spacing(2),
  margin: 0,
  overflowX: 'auto',
  
  '& code': {
    fontFamily: '"Fira Code", "Monaco", "Consolas", monospace',
    fontSize: '0.8125rem',
    color: theme.palette.grey[100],
    lineHeight: 1.5,
    backgroundColor: 'transparent',
    padding: 0,
  },
}));
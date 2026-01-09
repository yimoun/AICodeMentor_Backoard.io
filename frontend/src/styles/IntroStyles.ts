

import { styled } from '@mui/material/styles';
import { Box, Typography, Chip } from '@mui/material';


export const HeroContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(8),
  padding: theme.spacing(8, 4),
  maxWidth: 1400,
  margin: '0 auto',
  alignItems: 'center',
  
  [theme.breakpoints.down('lg')]: {
    gap: theme.spacing(6),
    padding: theme.spacing(6, 3),
  },
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
    textAlign: 'center',
  },
}));


export const HeroContent = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    order: 2,
  },
}));


export const HeroBadge = styled(Chip)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  backgroundColor: theme.palette.grey[100],
  padding: '6px 16px',
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 4,
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: theme.palette.grey[700],
  marginBottom: theme.spacing(3),
  height: 'auto',
  
  '& .MuiChip-label': {
    padding: 0,
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
    color: theme.palette.grey[300],
  }),
}));


export const HeroTitle = styled(Typography)(({ theme }) => ({
  fontSize: '3rem',
  fontWeight: 800,
  lineHeight: 1.1,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  
  [theme.breakpoints.down('lg')]: {
    fontSize: '2.5rem',
  },
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));


export const HeroHighlight = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
}));


export const HeroSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.125rem',
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(4),
  lineHeight: 1.7,
  maxWidth: 540,
  
  [theme.breakpoints.down('md')]: {
    maxWidth: 'none',
    margin: '0 auto',
    marginBottom: theme.spacing(4),
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));


export const HeroCta = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
  },
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}));

/**
 * Container des statistiques
 */
export const HeroStats = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(6),
  
  [theme.breakpoints.down('md')]: {
    justifyContent: 'center',
  },
  
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(3),
  },
}));

/**
 * Item de statistique individuel
 */
export const StatItem = styled(Box)({
  textAlign: 'center',
});

/**
 * Nombre de la statistique
 */
export const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 800,
  color: theme.palette.primary.main,
  lineHeight: 1,
  
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.5rem',
  },
}));


export const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.grey[500],
  marginTop: theme.spacing(0.5),
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));


export const HeroVisual = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    order: 1,
    maxWidth: 500,
    margin: '0 auto',
    width: '100%',
  },
}));


export const ChatPreview = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 3,
  boxShadow: theme.shadows[10],
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
    border: `1px solid ${theme.palette.grey[700]}`,
  }),
}));

/**
 * Header du chat preview (avec les 3 dots)
 */
export const ChatHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  backgroundColor: theme.palette.grey[100],
  borderBottom: `1px solid ${theme.palette.divider}`,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[900],
    borderBottom: `1px solid ${theme.palette.grey[700]}`,
  }),
}));

/**
 * Dot dans le header du chat
 */
export const ChatDot = styled('span')<{ color?: 'red' | 'yellow' | 'green' }>(
  ({ theme, color = 'red' }) => ({
    width: 12,
    height: 12,
    borderRadius: '50%',
    backgroundColor:
      color === 'red'
        ? '#ef4444'
        : color === 'yellow'
        ? '#eab308'
        : '#22c55e',
  })
);

/**
 * Container des messages
 */
export const ChatMessages = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));


interface MessageProps {
  sender?: 'user' | 'assistant';
}

export const Message = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'sender',
})<MessageProps>(({ theme, sender = 'user' }) => ({
  padding: theme.spacing(1.5, 2),
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 2,
  maxWidth: '85%',
  fontSize: '0.9375rem',
  lineHeight: 1.5,
  
  ...(sender === 'user' && {
    alignSelf: 'flex-end',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderBottomRightRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) / 2,
  }),
  
  ...(sender === 'assistant' && {
    alignSelf: 'flex-start',
    backgroundColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    borderBottomLeftRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) / 2,
    
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: theme.palette.grey[700],
      color: theme.palette.common.white,
    }),
  }),
}));


export const LlmBadge = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontSize: '0.6875rem',
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));
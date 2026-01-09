import { styled } from '@mui/material/styles';
import { Button as MuiButton, Box } from '@mui/material';


interface StyledButtonProps {
  variant?: 'primary' | 'outline' | 'ghost' | 'social';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}


export const StyledButton = styled(MuiButton, {
  shouldForwardProp: (prop) => 
    !['variant', 'size', 'fullWidth'].includes(prop as string),
})<StyledButtonProps>(({ theme, variant = 'primary', size = 'md', fullWidth }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  fontFamily: theme.typography.fontFamily,
  fontWeight: 600,
  borderRadius: theme.shape.borderRadius,
  border: '2px solid transparent',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textDecoration: 'none',
  textTransform: 'none',
  position: 'relative',
  
  // Sizes
  ...(size === 'sm' && {
    padding: '6px 12px',
    fontSize: '0.75rem',
  }),
  ...(size === 'md' && {
    padding: '10px 20px',
    fontSize: '0.875rem',
  }),
  ...(size === 'lg' && {
    padding: '14px 28px',
    fontSize: '1rem',
  }),
  
  // Full width
  ...(fullWidth && {
    width: '100%',
  }),
  
  // Variant: Primary
  ...(variant === 'primary' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderColor: theme.palette.primary.main,
    
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      borderColor: theme.palette.primary.dark,
      transform: 'translateY(-1px)',
      boxShadow: theme.shadows[4],
    },
  }),
  
  // Variant: Outline
  ...(variant === 'outline' && {
    backgroundColor: 'transparent',
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
    },
  }),
  
  // Variant: Ghost
  ...(variant === 'ghost' && {
    backgroundColor: 'transparent',
    color: theme.palette.grey[600],
    borderColor: 'transparent',
    
    '&:hover': {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.grey[800],
    },
    
    // Dark mode
    ...(theme.palette.mode === 'dark' && {
      color: theme.palette.grey[400],
      '&:hover': {
        backgroundColor: theme.palette.grey[800],
        color: theme.palette.common.white,
      },
    }),
  }),
  
  // Variant: Social
  ...(variant === 'social' && {
    width: '100%',
    padding: '12px',
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.grey[300]}`,
    color: theme.palette.grey[800],
    marginBottom: theme.spacing(1),
    
    '&:hover': {
      backgroundColor: theme.palette.grey[50],
      borderColor: theme.palette.grey[400],
    },
    
    '& svg': {
      width: 20,
      height: 20,
    },
    
    // Dark mode
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: theme.palette.grey[800],
      borderColor: theme.palette.grey[700],
      color: theme.palette.common.white,
      
      '&:hover': {
        backgroundColor: theme.palette.grey[700],
        borderColor: theme.palette.grey[600],
      },
    }),
  }),
  
  // Disabled state
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none',
  },
}));

/**
 * Badge sur le bouton (ex: "50 crédits offerts")
 */
export const ButtonBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -8,
  right: -8,
  backgroundColor: theme.palette.success.main,
  color: theme.palette.success.contrastText,
  fontSize: '0.625rem',
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius * 4 : theme.shape.borderRadius ),
  whiteSpace: 'nowrap',
}));


export const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    width: '100%',
    
    '& > *': {
      width: '100%',
    },
  },
}));
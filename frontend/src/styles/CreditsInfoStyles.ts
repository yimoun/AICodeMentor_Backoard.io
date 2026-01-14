import { styled } from '@mui/material/styles';
import { Box, Typography, Link } from '@mui/material';


export const CreditsInfoContainer = styled(Box)(({ theme }) => ({
 //TODO: change  backgroundColor to theme.palette.background.paper
  backgroundColor: '#fff',
  borderRadius: (theme.shape.borderRadius as number) * 2,
  padding: theme.spacing(3),
  width: '75%',
  margin: '0 auto',
  border: `1px solid ${theme.palette.grey[300]}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));


export const CreditsInfoTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));





export const CreditsTable = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  
  [theme.breakpoints.down('sm')]: {
    gridTemplateColumns: '1fr',
  },
}));


export const CreditItem = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2],
  },
  
  // Dark mode support
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));


export const CreditAction = styled(Typography)(({ theme }) => ({
  display: 'block',
  fontSize: '0.8125rem',
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(0.5),
  
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));


export const CreditCost = styled(Typography)(() => ({
  fontWeight: 700,
   color: '#ED1B2F',
  fontSize: '1rem',
  textAlign: 'center',
}));


export const CreditsNote = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.grey[600],
  display:'flex',
  justifyContent:'center',
  gap: theme.spacing(0.5),
}));


export const CreditsLink = styled(Link)(() => ({
  color: '#ED1B2F',
  textDecoration: 'none',
  fontWeight: 500,
  cursor: 'pointer',
  
  '&:hover': {
    textDecoration: 'underline',
  },
}));
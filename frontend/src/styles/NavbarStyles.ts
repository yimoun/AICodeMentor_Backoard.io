import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Box, Typography, Button, Link } from '@mui/material';


export const NavbarContainer = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
}));


export const NavbarToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: 1200,
  width: '100%',
  margin: '0 auto',
  minHeight: 64,
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));


export const NavBrand = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  textDecoration: 'none',
  
  '&:hover': {
    opacity: 0.9,
  },
}));


export const BrandIcon = styled('span')({
  fontSize: '1.75rem',
  lineHeight: 1,
});



export const BrandText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: '1.125rem',
  color: theme.palette.text.primary,
  
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));


export const NavLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(2),
  },
  
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));



export const NavLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  fontSize: '0.9375rem',
  fontWeight: 500,
  transition: 'color 0.2s ease',
  cursor: 'pointer',
  
  '&:hover': {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));



export const NavCtaButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.875rem',
  padding: theme.spacing(1, 2.5),
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));



export const MobileMenuButton = styled(Box)(({ theme }) => ({
  display: 'none',
  
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
  },
}));
import { styled, keyframes } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';

/* ==================== ANIMATIONS ==================== */
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

/* ==================== BACKDROP ==================== */
export const ModalBackdrop = styled(Box)(({ theme }) => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(4px)',
  zIndex: theme.zIndex.modal,
  animation: `${fadeIn} 0.2s ease-out`,
}));

/* ==================== MODAL CONTAINER ==================== */
export const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 440,
  backgroundColor: theme.palette.background.paper,
  borderRadius: (theme.shape.borderRadius as number) * 2,
  boxShadow: theme.shadows[10],
  padding: theme.spacing(4),
  zIndex: theme.zIndex.modal + 1,
  animation: `${slideUp} 0.3s ease-out`,
  textAlign: 'center',

  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
    width: '95%',
  },
}));

/* ==================== ICON ==================== */
export const ModalIcon = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  margin: '0 auto',
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.5rem',
  animation: `${pulse} 2s ease-in-out infinite`,
}));

/* ==================== TITLE ==================== */
export const ModalTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1.5),
}));

/* ==================== SUBTITLE ==================== */
export const ModalSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.9375rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(3),
  lineHeight: 1.6,
}));

/* ==================== EMAIL HIGHLIGHT ==================== */
export const EmailHighlight = styled('span')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

/* ==================== INSTRUCTIONS ==================== */
export const InstructionsBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
  textAlign: 'left',

  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[800],
  }),
}));

export const InstructionItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(1.5),
  marginBottom: theme.spacing(1.5),

  '&:last-child': {
    marginBottom: 0,
  },
}));

export const InstructionNumber = styled(Box)(({ theme }) => ({
  width: 24,
  height: 24,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
  fontWeight: 700,
  flexShrink: 0,
}));

export const InstructionText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
}));

/* ==================== ERROR MESSAGE ==================== */
export const ModalErrorMessage = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.error.light,
  color: theme.palette.error.dark,
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  fontSize: '0.875rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),

  '& svg': {
    fontSize: '1.25rem',
  },
}));

/* ==================== SUCCESS MESSAGE ==================== */
export const ModalSuccessMessage = styled(Box)(({ theme }) => ({
  backgroundColor: '#E8F5E9',
  color: '#2E7D32',
  padding: theme.spacing(1.5, 2),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
  fontSize: '0.875rem',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),

  '& svg': {
    fontSize: '1.25rem',
  },
}));

/* ==================== BUTTONS CONTAINER ==================== */
export const ModalActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
}));

/* ==================== RESEND LINK ==================== */
export const ResendLink = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.text.secondary,
  marginTop: theme.spacing(2),

  '& button': {
    background: 'none',
    border: 'none',
    color: theme.palette.primary.main,
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    fontSize: 'inherit',

    '&:hover': {
      textDecoration: 'underline',
    },

    '&:disabled': {
      color: theme.palette.grey[400],
      cursor: 'not-allowed',
    },
  },
}));

/* ==================== SPINNER ==================== */
export const Spinner = styled(Box)(({ theme }) => ({
  width: 20,
  height: 20,
  border: `2px solid ${theme.palette.grey[300]}`,
  borderTopColor: theme.palette.primary.main,
  borderRadius: '50%',
  animation: `${spin} 0.8s linear infinite`,
  display: 'inline-block',
}));

/* ==================== COUNTDOWN ==================== */
export const CountdownText = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.grey[500],
  marginTop: theme.spacing(1),
}));
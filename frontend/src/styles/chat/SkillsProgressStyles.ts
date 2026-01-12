import { styled } from '@mui/material/styles';
import { Box, Typography, LinearProgress } from '@mui/material';

/**
 * Container principal de la progression des skills
 */
export const SkillsProgressContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  marginTop: 'auto',
  borderTop: `1px solid ${theme.palette.grey[200]}`,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    borderTopColor: theme.palette.grey[800],
  }),
}));

/**
 * Titre de la section
 */
export const SkillsProgressTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.8125rem',
  color: theme.palette.grey[600],
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Item de skill individuel
 */
export const SkillProgressItem = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  
  '&:last-child': {
    marginBottom: 0,
  },
}));

/**
 * Info du skill (nom + niveau)
 */
export const SkillInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(0.5),
}));

/**
 * Nom du skill
 */
export const SkillName = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 500,
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

/**
 * Niveau du skill
 */
export const SkillLevel = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.grey[500],
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    color: theme.palette.grey[400],
  }),
}));

/**
 * Barre de progression du skill
 */
export const SkillProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 4,
  borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 2,
  backgroundColor: theme.palette.grey[200],
  
  '& .MuiLinearProgress-bar': {
    backgroundColor: theme.palette.primary.main,
    borderRadius: (typeof theme.shape.borderRadius === 'number' ? theme.shape.borderRadius : 4) * 2,
  },
  
  // Dark mode
  ...(theme.palette.mode === 'dark' && {
    backgroundColor: theme.palette.grey[700],
  }),
}));
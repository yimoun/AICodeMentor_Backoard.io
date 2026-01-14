import styled, { keyframes, css } from 'styled-components';
import { Avatar } from '@mui/material';

/**
 * Animation de rotation pour le loading
 */
const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/**
 * Container principal des infos utilisateur
 */
export const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
`;

/**
 * Avatar de l'utilisateur
 */
export const UserAvatar = styled(Avatar)`
  && {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #6C5CE7 0%, #A29BFE 100%);
    font-size: 1rem;
    font-weight: 600;
    color: white;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(108, 92, 231, 0.4);
    }
  }
`;

/**
 * Détails de l'utilisateur (nom + plan)
 */
export const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
`;

/**
 * Nom de l'utilisateur
 */
export const UserName = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #1a1a2e;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/**
 * Plan de l'utilisateur
 */
export const UserPlan = styled.span`
  font-size: 0.75rem;
  color: #6C5CE7;
  font-weight: 500;
`;

/**
 * Container pour le bouton de déconnexion
 */
export const LogoutButtonContainer = styled.div`
  position: relative;
`;

/**
 * Bouton de déconnexion
 */
export const LogoutButton = styled.button<{ $isLoading?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  /* Icône */
  svg, span {
    font-size: 1.1rem;
    transition: all 0.2s ease;
  }

  /* Effet hover */
  &:hover {
    background: #FEE2E2;
    color: #DC2626;
    transform: translateX(2px);

    svg, span {
      transform: scale(1.1);
    }
  }

  /* État actif */
  &:active {
    transform: scale(0.95);
  }

  /* État disabled/loading */
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Animation loading */
  ${({ $isLoading }) =>
    $isLoading &&
    css`
      color: #DC2626;
      
      svg, span {
        animation: ${spinAnimation} 1s linear infinite;
      }
    `}
`;

/**
 * Tooltip du bouton de déconnexion
 */
export const LogoutTooltip = styled.div<{ $visible: boolean }>`
  position: absolute;
  right: calc(100% + 8px);
  top: 50%;
  transform: translateY(-50%);
  padding: 6px 12px;
  background: #1a1a2e;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transition: all 0.2s ease;
  z-index: 100;

  /* Flèche */
  &::after {
    content: '';
    position: absolute;
    right: -6px;
    top: 50%;
    transform: translateY(-50%);
    border: 6px solid transparent;
    border-left-color: #1a1a2e;
    border-right: none;
  }
`;

/**
 * Container pour avatar + bouton logout (disposition horizontale)
 */
export const UserInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

/**
 * Wrapper pour les infos utilisateur (pousse le bouton logout à droite)
 */
export const UserInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;
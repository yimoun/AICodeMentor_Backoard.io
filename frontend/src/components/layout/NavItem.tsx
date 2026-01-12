// frontend/src/components/ui/NavItem/NavItem.tsx

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  SidebarNavContainer,
  NavItemContainer,
  NavIcon,
  NavText,
  NavBadge,
  NavDivider,
  NavSectionTitle,
} from '../../styles/NavItemStyles';

/**
 * Props pour NavItem
 */
interface NavItemProps {
  /** Icône (emoji ou React node) */
  icon: React.ReactNode;
  /** Label du lien */
  label: string;
  /** URL de destination */
  href?: string;
  /** État actif (auto-détecté si href fourni) */
  active?: boolean;
  /** Badge de notification (nombre ou texte) */
  badge?: number | string;
  /** Callback au clic */
  onClick?: () => void;
  /** Désactiver l'item */
  disabled?: boolean;
}

/**
 * Composant NavItem - Item de navigation pour la sidebar
 */
const NavItem: React.FC<NavItemProps> = ({
  icon,
  label,
  href,
  active: activeProp,
  badge,
  onClick,
  disabled = false,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-détection de l'état actif basé sur l'URL
  const isActive = activeProp !== undefined 
    ? activeProp 
    : href 
      ? location.pathname === href 
      : false;

  /**
   * Gère le clic sur l'item
   */
  const handleClick = () => {
    if (disabled) return;
    
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <NavItemContainer
      active={isActive}
      onClick={handleClick}
      disabled={disabled}
    >
      <NavIcon>{icon}</NavIcon>
      <NavText>{label}</NavText>
      {badge !== undefined && badge !== 0 && (
        <NavBadge>{badge}</NavBadge>
      )}
    </NavItemContainer>
  );
};

/**
 * Props pour SidebarNav
 */
interface SidebarNavProps {
  /** Contenu de la navigation (NavItem components) */
  children: React.ReactNode;
}

/**
 * Container de navigation sidebar
 */
const SidebarNav: React.FC<SidebarNavProps> = ({ children }) => {
  return <SidebarNavContainer>{children}</SidebarNavContainer>;
};

/**
 * Props pour NavSection
 */
interface NavSectionProps {
  /** Titre de la section */
  title?: string;
  /** Contenu de la section */
  children: React.ReactNode;
  /** Afficher le divider au-dessus */
  showDivider?: boolean;
}

/**
 * Section de navigation avec titre optionnel
 */
const NavSection: React.FC<NavSectionProps> = ({ 
  title, 
  children, 
  showDivider = false,
}) => {
  return (
    <>
      {showDivider && <NavDivider />}
      {title && <NavSectionTitle>{title}</NavSectionTitle>}
      {children}
    </>
  );
};

export { NavItem, SidebarNav, NavSection, NavDivider };
export default NavItem;
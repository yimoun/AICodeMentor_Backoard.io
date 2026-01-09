
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditsInfoContainer,
  CreditsInfoTitle,
  CreditsTable,
  CreditItem,
  CreditAction,
  CreditCost,
  CreditsNote,
  CreditsLink,
} from '../../../styles/CreditsInfoStyles';


interface CreditPriceItem {
  action: string;
  cost: number;
  unit?: string;
}

interface CreditsInfoProps {
  title?: string;
  titleIcon?: string;
  items?: CreditPriceItem[];
  noteText?: string;
  linkText?: string;
  linkHref?: string;
  onLinkClick?: () => void;
}

const defaultItems: CreditPriceItem[] = [
  { action: 'Question simple', cost: 1 },
  { action: 'Explication détaillée', cost: 3 },
  { action: 'Code review', cost: 5 },
  { action: 'Session debugging', cost: 10 },
];


const CreditsInfo: React.FC<CreditsInfoProps> = ({
  title = 'Comment fonctionnent les crédits ?',
  titleIcon = '💡',
  items = defaultItems,
  noteText = 'Besoin de plus ?',
  linkText = 'Achetez des crédits supplémentaires',
  linkHref = '/pricing',
  onLinkClick,
}) => {
  const navigate = useNavigate();

  const handleLinkClick = (event: React.MouseEvent) => {
    event.preventDefault();
    
    if (onLinkClick) {
      onLinkClick();
    } else if (linkHref) {
      navigate(linkHref);
    }
  };


  const formatCost = (cost: number, unit: string = 'crédit') => {
    return `${cost} ${unit}${cost > 1 ? 's' : ''}`;
  };

  return (
    <CreditsInfoContainer>
      <CreditsInfoTitle variant="h4">
        <span>{titleIcon}</span>
        {title}
      </CreditsInfoTitle>
      
      <CreditsTable>
        {items.map((item, index) => (
          <CreditItem key={index}>
            <CreditAction>{item.action}</CreditAction>
            <CreditCost>{formatCost(item.cost, item.unit)}</CreditCost>
          </CreditItem>
        ))}
      </CreditsTable>
      
      <CreditsNote>
        {noteText}{' '}
        <CreditsLink
          href={linkHref}
          onClick={handleLinkClick}
        >
          {linkText}
        </CreditsLink>
      </CreditsNote>
    </CreditsInfoContainer>
  );
};

export default CreditsInfo;

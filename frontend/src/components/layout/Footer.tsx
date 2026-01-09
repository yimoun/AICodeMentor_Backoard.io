import React from 'react';
import {
  FooterContainer,
  FooterContent,
  FooterBrand,
  BrandIcon,
  BrandName,
  CopyrightText,
} from '../../styles/FooterStyles';

interface FooterProps {
  brandName?: string;
  teamName?: string;  
  brandIcon?: string;
  poweredBy?: string;
  year?: number;
}

const Footer: React.FC<FooterProps> = ({
  brandName = 'AI Code Mentor',
  teamName = 'Nothing To Lose',
  brandIcon = '🎓',
  poweredBy = 'Backboard.io',
  year = new Date().getFullYear(),
}) => {
  return (
    <FooterContainer >
      <FooterContent>
        <FooterBrand>
          <BrandIcon>{brandIcon}</BrandIcon>
          <BrandName>{brandName}</BrandName>
        </FooterBrand>
        
        <CopyrightText>
          © {year} Équipe: {teamName}. Propulsé par {poweredBy}
        </CopyrightText>
      </FooterContent>
    </FooterContainer>
  );
};
export default Footer;

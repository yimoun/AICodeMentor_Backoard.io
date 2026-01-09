

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../layout/Button';
import {
  HeroContainer,
  HeroContent,
  HeroBadge,
  HeroTitle,
  HeroHighlight,
  HeroSubtitle,
  HeroCta,
  HeroStats,
  StatItem,
  StatNumber,
  StatLabel,
  HeroVisual,
  ChatPreview,
  ChatHeader,
  ChatDot,
  ChatMessages,
  Message,
  LlmBadge,
} from '../../styles/IntroStyles';


interface HeroStat {
  value: string | number;
  label: string;
}


interface PreviewMessage {
  sender: 'user' | 'assistant';
  content: string;
  llm?: string;
}

interface HeroProps {
  /** Texte du badge */
  badge?: string;
  /** Icône du badge (emoji) */
  badgeIcon?: string;
  /** Titre principal (avant le highlight) */
  titleStart?: string;
  /** Texte mis en évidence */
  titleHighlight?: string;
  /** Titre (après le highlight) */
  titleEnd?: string;
  /** Sous-titre */
  subtitle?: string;
  /** Texte du bouton principal */
  ctaPrimaryText?: string;
  /** Badge sur le bouton principal */
  ctaPrimaryBadge?: string;
  /** URL du bouton principal */
  ctaPrimaryHref?: string;
  /** Texte du bouton secondaire */
  ctaSecondaryText?: string;
  /** URL du bouton secondaire */
  ctaSecondaryHref?: string;
  /** Statistiques à afficher */
  stats?: HeroStat[];
  /** Messages de preview */
  previewMessages?: PreviewMessage[];
  /** Callback bouton principal */
  onCtaPrimaryClick?: () => void;
  /** Callback bouton secondaire */
  onCtaSecondaryClick?: () => void;
}

/**
 * Valeurs par défaut
 */
const defaultStats: HeroStat[] = [
  { value: '4', label: 'LLMs experts' },
  { value: '20+', label: 'Langages & Frameworks' },
  { value: '∞', label: 'Mémoire persistante' },
];

const defaultPreviewMessages: PreviewMessage[] = [
  {
    sender: 'user',
    content: 'Comment fonctionne useEffect en React ?',
  },
  {
    sender: 'assistant',
    content:
      'Je me souviens que tu as eu des difficultés avec les closures en JavaScript la semaine dernière. useEffect utilise ce même concept...',
    llm: 'Claude',
  },
];

/**
 * Section Hero de la landing page
 */
const Hero: React.FC<HeroProps> = ({
  badge = 'Propulsé par Backboard.io',
  badgeIcon = '🚀',
  titleStart = 'Le mentor de code qui ',
  titleHighlight = 'se souvient',
  titleEnd = ' de vous',
  subtitle = 'Contrairement aux chatbots classiques, AI Code Mentor retient chaque interaction, adapte ses explications à votre niveau réel, et choisit le meilleur expert IA pour chaque question.',
  ctaPrimaryText = 'Essayer gratuitement',
  ctaPrimaryBadge = '50 crédits offerts',
  ctaPrimaryHref = '/signup',
  ctaSecondaryText = 'Voir les tarifs',
  ctaSecondaryHref = '/pricing',
  stats = defaultStats,
  previewMessages = defaultPreviewMessages,
  onCtaPrimaryClick,
  onCtaSecondaryClick,
}) => {
  const navigate = useNavigate();

  const handleCtaPrimaryClick = () => {
    if (onCtaPrimaryClick) {
      onCtaPrimaryClick();
    } else if (ctaPrimaryHref) {
      navigate(ctaPrimaryHref);
    }
  };

  const handleCtaSecondaryClick = () => {
    if (onCtaSecondaryClick) {
      onCtaSecondaryClick();
    } else if (ctaSecondaryHref) {
      navigate(ctaSecondaryHref);
    }
  };

  return (
    <HeroContainer as="section">
      {/* Contenu texte */}
      <HeroContent>
        <HeroBadge
          label={`${badgeIcon} ${badge}`}
          size="medium"
        />

        <HeroTitle variant="h1">
          {titleStart}
          <HeroHighlight>{titleHighlight}</HeroHighlight>
          {titleEnd}
        </HeroTitle>

        <HeroSubtitle>{subtitle}</HeroSubtitle>

        <HeroCta>
          <Button
            variant="primary"
            size="lg"
            badge={ctaPrimaryBadge}
            onClick={handleCtaPrimaryClick}
          >
            {ctaPrimaryText}
          </Button>

          {ctaSecondaryText && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleCtaSecondaryClick}
            >
              {ctaSecondaryText}
            </Button>
          )}
        </HeroCta>

        <HeroStats>
          {stats.map((stat, index) => (
            <StatItem key={index}>
              <StatNumber>{stat.value}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatItem>
          ))}
        </HeroStats>
      </HeroContent>

      {/* Preview visuelle */}
      <HeroVisual>
        <ChatPreview>
          <ChatHeader>
            <ChatDot color="red" />
            <ChatDot color="yellow" />
            <ChatDot color="green" />
          </ChatHeader>

          <ChatMessages>
            {previewMessages.map((message, index) => (
              <Message key={index} sender={message.sender}>
                {message.sender === 'assistant' && message.llm && (
                  <LlmBadge>{message.llm}</LlmBadge>
                )}
                {message.content}
              </Message>
            ))}
          </ChatMessages>
        </ChatPreview>
      </HeroVisual>
    </HeroContainer>
  );
};

export default Hero;
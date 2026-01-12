import React from 'react';
import {
  FeaturesSection,
  FeaturesTitle,
  FeaturesTitleHighlight,
  FeaturesSubtitle,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  FeatureTag,
  FeatureTagOutline,
} from '../../../styles/FeaturesStyles';


export interface FeatureItem {
  /** Icône (emoji ou React node) */
  icon: React.ReactNode;
  /** Titre de la feature */
  title: string;
  /** Description de la feature */
  description: string;
  /** Tag optionnel (ex: "Unique", "Premium") */
  tag?: string;
  /** Style du tag: filled (défaut) ou outline */
  tagVariant?: 'filled' | 'outline';
}

interface FeaturesProps {
  /** Titre de la section */
  title?: string;
  /** Sous-titre optionnel */
  subtitle?: string;
  /** Liste des features à afficher */
  features?: FeatureItem[];
  /** ID pour le scroll anchor */
  id?: string;
}


const defaultFeatures: FeatureItem[] = [
  {
    icon: '🧠',
    title: 'Mémoire persistante',
    description: 'Votre mentor se souvient de chaque conversation, de chaque document téléversé/téléchargé,  ' + 
      'de chaque session, de vos difficultés, et de vos progrès pour un apprentissage personnalisé.',
    tag: 'Via Backboard.io',
  },
  {
    icon: '🤖',
    title: 'Multi-LLM adaptatif',
    description: 'Claude pour la pédagogie, GPT-4 pour l\'architecture, Codestral pour le code. Le bon expert pour chaque question.',
    tag: '4 modeles IA',
  },
  {
    icon: '🌳',
    title: 'Parcours intelligents',
    description: 'Système de prérequis : maîtrisez JavaScript avant React. Progression logique et efficace.',
    tag: 'Arbre de compétences',
  },
  {
    icon: '🎯',
    title: 'Suivi par topic',
    description: 'Identifiez précisément vos forces et faiblesses : async/await, hooks, OOP... topic par topic.',
    tag: 'Analyse fine',
  },
];

/**
 * Section Features de la landing page
 * Affiche une grille de cards présentant les fonctionnalités principales
 */
const Features: React.FC<FeaturesProps> = ({
  subtitle,
  features = defaultFeatures,
  id = 'features',
}) => {
  return (
    <FeaturesSection as="section" id={id}>
      {/* Titre */}
      <FeaturesTitle variant="h2">
        Ce qui nous rend <FeaturesTitleHighlight>unique</FeaturesTitleHighlight>
      </FeaturesTitle>

      {/* Sous-titre optionnel */}
      {subtitle && <FeaturesSubtitle>{subtitle}</FeaturesSubtitle>}

      {/* Grille de features */}
      <FeaturesGrid>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            {/* Icône */}
            <FeatureIcon>{feature.icon}</FeatureIcon>

            {/* Titre */}
            <FeatureTitle variant="h3">{feature.title}</FeatureTitle>

            {/* Description */}
            <FeatureDescription>{feature.description}</FeatureDescription>

            {/* Tag optionnel */}
            {feature.tag && (
              feature.tagVariant === 'outline' ? (
                <FeatureTagOutline label={feature.tag} size="small" />
              ) : (
                <FeatureTag label={feature.tag} size="small" />
              )
            )}
          </FeatureCard>
        ))}
      </FeaturesGrid>
    </FeaturesSection>
  );
};

export default Features;
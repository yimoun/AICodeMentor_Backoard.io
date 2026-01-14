import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import {
  ProfileCard,
  CardTitle,
  CardDescription,
  FormRow,
  FormGroup,
  FormLabel,
  FormInput,
  FormSelect,
  StepActions,
  LearningStylesGrid,
  StyleOption,
  StyleCard,
  StyleIcon,
  StyleName,
  StyleDesc,
} from '../../../styles/onboarding/OnboardingStyles';

/**
 * Type de style d'apprentissage
 */
export type LearningStyleType = 'visual' | 'reading' | 'hands_on';

/**
 * Données du profil utilisateur
 */
export interface ProfileStepData {
  firstName: string;
  lastName: string;
  age: string;
  experience: string;
  learningStyle: LearningStyleType;
}

interface ProfileStepProps {
  /** Données initiales */
  initialData?: Partial<ProfileStepData>;
  /** Callback à la soumission */
  onNext: (data: ProfileStepData) => void;
}

/**
 * Options de style d'apprentissage
 */
const learningStyleOptions: {
  value: LearningStyleType;
  icon: string;
  name: string;
  description: string;
}[] = [
  {
    value: 'visual',
    icon: '👁️',
    name: 'Visuel',
    description: 'Diagrammes & schémas',
  },
  {
    value: 'reading',
    icon: '📖',
    name: 'Lecture',
    description: 'Documentation détaillée',
  },
  {
    value: 'hands_on',
    icon: '⌨️',
    name: 'Pratique',
    description: 'Exercices de code',
  },
];

/**
 * Options d'expérience
 */
const experienceOptions = [
  { value: '0', label: 'Débutant (0 an)' },
  { value: '1', label: '1-2 ans' },
  { value: '3', label: '3-5 ans' },
  { value: '6', label: '6-10 ans' },
  { value: '10', label: '10+ ans' },
];

/**
 * Étape 1: Informations personnelles
 */
const ProfileStep: React.FC<ProfileStepProps> = ({
  initialData,
  onNext,
}) => {
  const [formData, setFormData] = useState<ProfileStepData>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    age: initialData?.age || '',
    experience: initialData?.experience || '0',
    learningStyle: initialData?.learningStyle || 'reading',
  });

  /**
   * Mise à jour d'un champ
   */
  const handleChange = (
    field: keyof ProfileStepData,
    value: string | LearningStyleType
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Soumission du formulaire
   */
  const handleSubmit = () => {
    onNext(formData);
  };

  /**
   * Validation simple
   */
  const isValid = formData.age.length > 0;

  return (
    <ProfileCard>
      <CardTitle>Parlez-nous de vous</CardTitle>
      <CardDescription>
        Ces informations nous aident à personnaliser votre expérience
      </CardDescription>

      {/* Prénom et Nom */}
      <FormRow>
        <FormGroup>
          <FormLabel htmlFor="first-name">Prénom</FormLabel>
          <FormInput
            id="first-name"
            type="text"
            placeholder="Jean"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="last-name">Nom</FormLabel>
          <FormInput
            id="last-name"
            type="text"
            placeholder="Dupont"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
          />
        </FormGroup>
      </FormRow>

      {/* Âge et Expérience */}
      <FormRow>
        <FormGroup>
          <FormLabel htmlFor="age">Âge</FormLabel>
          <FormInput
            id="age"
            type="number"
            placeholder="25"
            min={13}
            max={120}
            value={formData.age}
            onChange={(e) => handleChange('age', e.target.value)}
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="experience">Années d'expérience</FormLabel>
          <FormSelect
            id="experience"
            value={formData.experience}
            onChange={(e) => handleChange('experience', e.target.value)}
          >
            {experienceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
      </FormRow>

      {/* Style d'apprentissage */}
      <FormGroup>
        <FormLabel>Style d'apprentissage préféré</FormLabel>
        <LearningStylesGrid>
          {learningStyleOptions.map((style) => (
            <StyleOption key={style.value}>
              <input
                type="radio"
                name="learning-style"
                value={style.value}
                checked={formData.learningStyle === style.value}
                onChange={() => handleChange('learningStyle', style.value)}
              />
              <StyleCard selected={formData.learningStyle === style.value}>
                <StyleIcon>{style.icon}</StyleIcon>
                <StyleName>{style.name}</StyleName>
                <StyleDesc>{style.description}</StyleDesc>
              </StyleCard>
            </StyleOption>
          ))}
        </LearningStylesGrid>
      </FormGroup>

      {/* Actions */}
      <StepActions>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={!isValid}
        >
          Continuer
        </Button>
      </StepActions>
    </ProfileCard>
  );
};

export default ProfileStep;
import React, { useState } from 'react';
import OnboardingProgress, { type OnboardingStepData } from './OnboardingProgress';
import ProfileStep, { type ProfileStepData } from './ProfileStep';
import SkillsStep, { defaultSkillCategories } from './SkillsStep';
import GoalsStep, { type GoalsStepData } from './GoalsStep';
import TestStep, { type UserAnswer, defaultPythonQuestions, type QuestionData } from './TestStep';
import ResultsStep from './ResultsStep';
import {
  OnboardingContainer,
  OnboardingInner,
} from '../../../styles/onboarding/OnboardingStyles';
import { useNavigate } from 'react-router-dom';

/**
 * Étapes de l'onboarding
 */
const ONBOARDING_STEPS: OnboardingStepData[] = [
  { id: 1, label: 'Profil' },
  { id: 2, label: 'Compétences' },
  { id: 3, label: 'Objectifs' },
];

/**
 * Données complètes de l'onboarding
 */
export interface OnboardingData {
  profile: ProfileStepData;
  skills: string[];
  goals: GoalsStepData;
  testAnswers: UserAnswer[];
}

interface OnboardingMainProps {
  /** Données initiales de l'utilisateur */
  initialProfile?: Partial<ProfileStepData>;
  /** Skills initiaux */
  initialSkills?: string[];
  /** Limite de skills (plan gratuit) */
  skillLimit?: number;
  /** Callback quand l'onboarding est terminé */
  onComplete: (data: OnboardingData) => void;
}

/**
 * Composant principal de l'onboarding
 */
const OnboardingMain: React.FC<OnboardingMainProps> = ({
  initialProfile,
  initialSkills = [],
  skillLimit,
  onComplete,
}) => {
 const navigate = useNavigate();
  // État du step actuel
  const [currentStep, setCurrentStep] = useState(1);
  
  // Données collectées
  const [profileData, setProfileData] = useState<ProfileStepData | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);
  const [goalsData, setGoalsData] = useState<GoalsStepData | null>(null);
  const [testAnswers, setTestAnswers] = useState<UserAnswer[]>([]);
  
  // État pour le test et les résultats
  const [isInTest, setIsInTest] = useState(false);
  const [showResults, setShowResults] = useState(false);

  /**
   * Calcul de la progression
   */
  const calculateProgress = (): number => {
    if (showResults) return 100;
    if (isInTest) return 90;
    return (currentStep / ONBOARDING_STEPS.length) * 80;
  };

  /**
   * Étape 1: Profil terminé
   */
  const handleProfileComplete = (data: ProfileStepData) => {
    setProfileData(data);
    setCurrentStep(2);
  };

  /**
   * Étape 2: Skills sélectionnés
   */
  const handleSkillsComplete = (skills: string[]) => {
    setSelectedSkills(skills);
    setCurrentStep(3);
  };

  /**
   * Étape 3: Objectifs définis - Lancer le test
   */
  const handleGoalsComplete = (data: GoalsStepData) => {
    setGoalsData(data);
    setIsInTest(true);
  };

  /**
   * Test terminé
   */
  const handleTestComplete = (answers: UserAnswer[]) => {
    setTestAnswers(answers);
    setIsInTest(false);
    setShowResults(true);
  };

  /**
   * Modifier les skills (depuis les résultats)
   */
  const handleModifySkills = () => {
    setShowResults(false);
    setIsInTest(false);
    setCurrentStep(2);
  };

  /**
   * Terminer l'onboarding
   */
  const handleStartMentoring = () => {
    // if (profileData && goalsData) {
    //   onComplete({
    //     profile: profileData,
    //     skills: selectedSkills,
    //     goals: goalsData,
    //     testAnswers,
    //   });
    // }

    //TODO: À metter dans le if ci dessus plus tard
      navigate('/app/chat');
  };

  /**
   * Retour à l'étape précédente
   */
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  /**
   * Obtenir le premier skill sélectionné pour le test
   */
  const getFirstSkillInfo = () => {
    const skillId = selectedSkills[0] || 'python';
    const allSkills = defaultSkillCategories.flatMap((cat) => cat.skills);
    const skill = allSkills.find((s) => s.id === skillId);
    return {
      name: skill?.name || 'Python',
      logo: skill?.logo || '🐍',
    };
  };

  /**
   * Obtenir les questions pour le test
   */
  const getTestQuestions = (): QuestionData[] => {
    // TODO: Charger les questions depuis l'API selon le skill
    return defaultPythonQuestions;
  };

  // Afficher les résultats
  if (showResults) {
    const skillInfo = getFirstSkillInfo();
    return (
      <OnboardingContainer>
        <OnboardingInner>
          <ResultsStep
            skillName={skillInfo.name}
            answers={testAnswers}
            questions={getTestQuestions()}
            onModifySkills={handleModifySkills}
            onStartMentoring={handleStartMentoring}
          />
        </OnboardingInner>
      </OnboardingContainer>
    );
  }

  // Afficher le test
  if (isInTest) {
    const skillInfo = getFirstSkillInfo();
    return (
      <OnboardingContainer>
        <OnboardingInner>
          <TestStep
            skillName={skillInfo.name}
            skillLogo={skillInfo.logo}
            questions={getTestQuestions()}
            timePerQuestion={120}
            onComplete={handleTestComplete}
          />
        </OnboardingInner>
      </OnboardingContainer>
    );
  }

  // Afficher l'étape actuelle
  return (
    <OnboardingContainer>
      <OnboardingInner>
        {/* Barre de progression */}
        <OnboardingProgress
          steps={ONBOARDING_STEPS}
          currentStep={currentStep}
          progress={calculateProgress()}
        />

        {/* Étape 1: Profil */}
        {currentStep === 1 && (
          <ProfileStep
            initialData={initialProfile}
            onNext={handleProfileComplete}
          />
        )}

        {/* Étape 2: Compétences */}
        {currentStep === 2 && (
          <SkillsStep
            categories={defaultSkillCategories}
            initialSkills={selectedSkills}
            skillLimit={skillLimit}
            onNext={handleSkillsComplete}
            onBack={handleBack}
          />
        )}

        {/* Étape 3: Objectifs */}
        {currentStep === 3 && (
          <GoalsStep
            initialData={goalsData || undefined}
            onNext={handleGoalsComplete}
            onBack={handleBack}
          />
        )}
      </OnboardingInner>
    </OnboardingContainer>
  );
};

export default OnboardingMain;
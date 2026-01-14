import React from 'react';
import {
  ProgressContainer,
  ProgressSteps,
  Step,
  StepNumber,
  StepLabel,
  ProgressBar,
} from '../../../styles/onboarding/OnboardingStyles';

/**
 * Données d'une étape
 */
export interface OnboardingStepData {
  id: number;
  label: string;
}

interface OnboardingProgressProps {
  /** Étapes disponibles */
  steps: OnboardingStepData[];
  /** Étape actuelle (1-based) */
  currentStep: number;
  /** Pourcentage de progression (0-100) */
  progress: number;
}

/**
 * Barre de progression de l'onboarding
 */
const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  steps,
  currentStep,
  progress,
}) => {
  return (
    <ProgressContainer>
      <ProgressSteps>
        {steps.map((step) => (
          <Step
            key={step.id}
            active={step.id === currentStep}
            completed={step.id < currentStep}
          >
            <StepNumber
              active={step.id === currentStep}
              completed={step.id < currentStep}
            >
              {step.id < currentStep ? '✓' : step.id}
            </StepNumber>
            <StepLabel active={step.id === currentStep}>
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </ProgressSteps>
      <ProgressBar variant="determinate" value={progress} />
    </ProgressContainer>
  );
};

export default OnboardingProgress;
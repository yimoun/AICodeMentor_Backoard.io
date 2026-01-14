import React, { useState } from 'react';
import { Button } from '../../ui/Button';
import {
  ProfileCard,
  CardTitle,
  CardDescription,
  StepActions,
  FormGroup,
  FormLabel,
  GoalsGrid,
  GoalOption,
  GoalCard,
  GoalIcon,
  GoalName,
  DailyGoalSelector,
  DailyGoalBtn,
} from '../../../styles/onboarding/OnboardingStyles';

/**
 * Type d'objectif
 */
export type GoalType =
  | 'career_change'
  | 'skill_up'
  | 'side_project'
  | 'interview_prep'
  | 'curiosity'
  | 'freelance';

/**
 * Données des objectifs
 */
export interface GoalsStepData {
  goals: GoalType[];
  dailyMinutes: number;
}

interface GoalsStepProps {
  /** Données initiales */
  initialData?: Partial<GoalsStepData>;
  /** Callback à la soumission */
  onNext: (data: GoalsStepData) => void;
  /** Callback retour */
  onBack: () => void;
}

/**
 * Options d'objectifs
 */
const goalOptions: { value: GoalType; icon: string; name: string }[] = [
  { value: 'career_change', icon: '🔄', name: 'Reconversion professionnelle' },
  { value: 'skill_up', icon: '📈', name: 'Monter en compétences' },
  { value: 'side_project', icon: '🛠️', name: 'Projet personnel' },
  { value: 'interview_prep', icon: '💼', name: 'Préparer des entretiens' },
  { value: 'curiosity', icon: '🔍', name: 'Curiosité / Hobby' },
  { value: 'freelance', icon: '💻', name: 'Devenir freelance' },
];

/**
 * Options de temps quotidien
 */
const dailyTimeOptions = [
  { minutes: 10, label: '10 min' },
  { minutes: 15, label: '15 min' },
  { minutes: 30, label: '30 min' },
  { minutes: 60, label: '1 heure' },
];

/**
 * Étape 3: Définition des objectifs
 */
const GoalsStep: React.FC<GoalsStepProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const [selectedGoals, setSelectedGoals] = useState<GoalType[]>(
    initialData?.goals || []
  );
  const [dailyMinutes, setDailyMinutes] = useState<number>(
    initialData?.dailyMinutes || 15
  );

  /**
   * Toggle un objectif
   */
  const handleGoalToggle = (goal: GoalType) => {
    setSelectedGoals((prev) =>
      prev.includes(goal)
        ? prev.filter((g) => g !== goal)
        : [...prev, goal]
    );
  };

  /**
   * Soumission
   */
  const handleSubmit = () => {
    onNext({
      goals: selectedGoals,
      dailyMinutes,
    });
  };

  return (
    <ProfileCard>
      <CardTitle>Définissez vos objectifs</CardTitle>
      <CardDescription>Qu'espérez-vous accomplir ?</CardDescription>

      {/* Grille d'objectifs */}
      <GoalsGrid>
        {goalOptions.map((goal) => (
          <GoalOption key={goal.value}>
            <input
              type="checkbox"
              name="goals"
              value={goal.value}
              checked={selectedGoals.includes(goal.value)}
              onChange={() => handleGoalToggle(goal.value)}
            />
            <GoalCard selected={selectedGoals.includes(goal.value)}>
              <GoalIcon>{goal.icon}</GoalIcon>
              <GoalName>{goal.name}</GoalName>
            </GoalCard>
          </GoalOption>
        ))}
      </GoalsGrid>

      {/* Objectif quotidien */}
      <FormGroup>
        <FormLabel>Objectif quotidien</FormLabel>
        <DailyGoalSelector>
          {dailyTimeOptions.map((option) => (
            <DailyGoalBtn
              key={option.minutes}
              type="button"
              selected={dailyMinutes === option.minutes}
              onClick={() => setDailyMinutes(option.minutes)}
            >
              {option.label}
            </DailyGoalBtn>
          ))}
        </DailyGoalSelector>
      </FormGroup>

      {/* Actions */}
      <StepActions>
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={selectedGoals.length === 0}
        >
          Passer le test de niveau →
        </Button>
      </StepActions>
    </ProfileCard>
  );
};

export default GoalsStep;
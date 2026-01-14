import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingMain, { type OnboardingData } from '../features/onboarding/OnboardingMain';
import UserDS from '../../data_services/UserDS';
import ProgressBackdrop from '../controls/ProgressBackdrop';
import useUser from '../hooks/useUser';

/**
 * Page d'onboarding (configuration initiale après inscription)
 */
const OnboardingContent: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: isUserLoading, completeOnboarding, hasCompletedOnboarding } = useUser();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Vérifier si l'utilisateur doit être ici
   */
  useEffect(() => {
    // Attendre que le contexte soit initialisé
    if (isUserLoading) return;

    // Si non authentifié, rediriger vers login
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
      return;
    }

    // Si onboarding déjà terminé, rediriger vers l'app
    if (hasCompletedOnboarding()) {
      navigate('/app/chat', { replace: true });
      return;
    }
  }, [isAuthenticated, isUserLoading, hasCompletedOnboarding, navigate]);

  /**
   * Callback quand l'onboarding est terminé
   */
  const handleOnboardingComplete = async (data: OnboardingData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Envoyer les données au backend
      const response = await UserDS.completeOnboarding({
        age: data.profile.age ? parseInt(data.profile.age) : undefined,
        experience_years: data.profile.experience,
        learning_style: data.profile.learningStyle,
        selected_skills: data.skills,
        goals: data.goals.goals,
        daily_goal_minutes: data.goals.dailyMinutes,
        test_results: data.testAnswers.map((a) => ({
          question_id: a.questionId,
          answer: a.selectedAnswer,
          is_correct: a.isCorrect,
          time_spent: a.timeSpent,
          used_hint: a.usedHint,
        })),
      });

      // ✅ IMPORTANT: Mettre à jour le contexte utilisateur
      completeOnboarding({
        age: data.profile.age ? parseInt(data.profile.age) : undefined,
        experience_years: data.profile.experience,
        learning_style: data.profile.learningStyle,
        selected_skills: data.skills,
        goals: data.goals.goals,
        daily_goal_minutes: data.goals.dailyMinutes,
        onboarding_finished: true,
      });

      // Rediriger vers le chat
      navigate('/app/chat', { replace: true });
    } catch (err: any) {
      console.error('Error completing onboarding:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  // Afficher un loader pendant la vérification
  if (isUserLoading) {
    return <ProgressBackdrop open={true} />;
  }

  // Ne pas afficher si non authentifié (redirect en cours)
  if (!isAuthenticated) {
    return <ProgressBackdrop open={true} />;
  }

  return (
    <>
      <OnboardingMain
        initialProfile={{

        }}
        skillLimit={undefined} // ou 2 pour plan gratuit
        onComplete={handleOnboardingComplete}
      />
      
      {/* Backdrop de chargement */}
      <ProgressBackdrop open={isLoading} />

      {/* TODO: Afficher l'erreur dans un Toast/Snackbar */}
      {error && console.error(error)}
    </>
  );
};

export default OnboardingContent;
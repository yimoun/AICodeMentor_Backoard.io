

import React, { useMemo } from 'react';
import { Button } from '../../ui/Button';
import { type UserAnswer, type QuestionData } from './TestStep';
import {
  ResultsContainer,
  ResultsHeader,
  ResultsBadge,
  BadgeIcon,
  BadgeLevel,
  ResultsTitle,
  ResultsSubtitle,
  ResultsGrid,
  ScoreCard,
  ScoreCircle,
  ScoreCircleSvg,
  ScoreCircleBg,
  ScoreCircleFill,
  ScoreValue,
  ScoreNumber,
  ScoreUnit,
  ScoreDetails,
  ScoreStat,
  StatLabel,
  StatValue,
  ResultsCard,
  TopicsBreakdown,
  TopicRow,
  TopicName,
  TopicBar,
  TopicFill,
  TopicScore,
  RecommendationsCard,
  MentorMessage,
  MentorAvatar,
  MentorText,
  ResultsActions,
} from '../../../styles/onboarding/OnboardingStyles';

/**
 * Niveau déterminé
 */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * Score par topic
 */
export interface TopicScoreData {
  name: string;
  score: number;
  level: 'excellent' | 'good' | 'medium' | 'weak';
}

/**
 * Résultats calculés
 */
export interface TestResults {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  averageTime: number;
  hintsUsed: number;
  level: SkillLevel;
  topicScores: TopicScoreData[];
  weakTopics: string[];
}

interface ResultsStepProps {
  /** Nom du skill testé */
  skillName: string;
  /** Réponses de l'utilisateur */
  answers: UserAnswer[];
  /** Questions du test */
  questions: QuestionData[];
  /** Callback pour modifier les skills */
  onModifySkills: () => void;
  /** Callback pour commencer le mentorat */
  onStartMentoring: () => void;
}

/**
 * Obtenir le niveau basé sur le score
 */
const getLevelFromScore = (score: number): SkillLevel => {
  if (score >= 90) return 'expert';
  if (score >= 70) return 'advanced';
  if (score >= 50) return 'intermediate';
  return 'beginner';
};

/**
 * Obtenir le label du niveau
 */
const getLevelLabel = (level: SkillLevel): string => {
  switch (level) {
    case 'expert':
      return 'Expert';
    case 'advanced':
      return 'Avancé';
    case 'intermediate':
      return 'Intermédiaire';
    case 'beginner':
      return 'Débutant';
  }
};

/**
 * Obtenir l'icône du niveau
 */
const getLevelIcon = (level: SkillLevel): string => {
  switch (level) {
    case 'expert':
      return '👑';
    case 'advanced':
      return '🏆';
    case 'intermediate':
      return '🥈';
    case 'beginner':
      return '🌱';
  }
};

/**
 * Obtenir le niveau du score (pour affichage)
 */
const getScoreLevel = (score: number): TopicScoreData['level'] => {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'medium';
  return 'weak';
};

/**
 * Étape 5: Résultats du test
 */
const ResultsStep: React.FC<ResultsStepProps> = ({
  skillName,
  answers,
  questions,
  onModifySkills,
  onStartMentoring,
}) => {
  /**
   * Calcul des résultats
   */
  const results = useMemo<TestResults>(() => {
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const averageTime = Math.round(
      answers.reduce((sum, a) => sum + a.timeSpent, 0) / answers.length
    );
    const hintsUsed = answers.filter((a) => a.usedHint).length;
    const level = getLevelFromScore(score);

    // Calcul des scores par topic
    const topicMap = new Map<string, { correct: number; total: number }>();
    
    questions.forEach((q, index) => {
      const answer = answers[index];
      const current = topicMap.get(q.topic) || { correct: 0, total: 0 };
      topicMap.set(q.topic, {
        correct: current.correct + (answer?.isCorrect ? 1 : 0),
        total: current.total + 1,
      });
    });

    const topicScores: TopicScoreData[] = Array.from(topicMap.entries()).map(
      ([name, data]) => {
        const topicScore = Math.round((data.correct / data.total) * 100);
        return {
          name,
          score: topicScore,
          level: getScoreLevel(topicScore),
        };
      }
    );

    // Trier par score décroissant
    topicScores.sort((a, b) => b.score - a.score);

    const weakTopics = topicScores
      .filter((t) => t.level === 'weak' || t.level === 'medium')
      .map((t) => t.name);

    return {
      score,
      correctAnswers,
      totalQuestions,
      averageTime,
      hintsUsed,
      level,
      topicScores,
      weakTopics,
    };
  }, [answers, questions]);

  // Calcul du strokeDashoffset pour le cercle SVG
  const circumference = 2 * Math.PI * 45; // rayon = 45
  const strokeDashoffset = circumference - (results.score / 100) * circumference;

  return (
    <ResultsContainer>
      {/* Header */}
      <ResultsHeader>
        <ResultsBadge>
          <BadgeIcon>{getLevelIcon(results.level)}</BadgeIcon>
          <BadgeLevel>{getLevelLabel(results.level)}</BadgeLevel>
        </ResultsBadge>
        <ResultsTitle>Bravo ! Test complété</ResultsTitle>
        <ResultsSubtitle>
          Voici votre profil de compétences en {skillName}
        </ResultsSubtitle>
      </ResultsHeader>

      {/* Grille de résultats */}
      <ResultsGrid>
        {/* Carte du score */}
        <ScoreCard>
          <ScoreCircle>
            <ScoreCircleSvg viewBox="0 0 100 100">
              <ScoreCircleBg cx="50" cy="50" r="45" />
              <ScoreCircleFill
                cx="50"
                cy="50"
                r="45"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </ScoreCircleSvg>
            <ScoreValue>
              <ScoreNumber>{results.score}</ScoreNumber>
              <ScoreUnit>%</ScoreUnit>
            </ScoreValue>
          </ScoreCircle>
          <ScoreDetails>
            <ScoreStat>
              <StatLabel>Bonnes réponses</StatLabel>
              <StatValue>
                {results.correctAnswers}/{results.totalQuestions}
              </StatValue>
            </ScoreStat>
            <ScoreStat>
              <StatLabel>Temps moyen</StatLabel>
              <StatValue>{results.averageTime}s</StatValue>
            </ScoreStat>
            <ScoreStat>
              <StatLabel>Indices utilisés</StatLabel>
              <StatValue>{results.hintsUsed}</StatValue>
            </ScoreStat>
          </ScoreDetails>
        </ScoreCard>

        {/* Analyse par topic */}
        <ResultsCard>
          <h3>📊 Analyse par topic</h3>
          <TopicsBreakdown>
            {results.topicScores.map((topic) => (
              <TopicRow key={topic.name} isWeak={topic.level === 'weak'}>
                <TopicName>{topic.name}</TopicName>
                <TopicBar>
                  <TopicFill style={{ width: `${topic.score}%` }} />
                </TopicBar>
                <TopicScore level={topic.level}>{topic.score}%</TopicScore>
              </TopicRow>
            ))}
          </TopicsBreakdown>
        </ResultsCard>

        {/* Recommandations */}
        <RecommendationsCard>
          <h3>🎯 Recommandations du mentor</h3>
          <MentorMessage>
            <MentorAvatar>🤖</MentorAvatar>
            <MentorText>
              {results.score >= 70 ? (
                <>
                  <p>Excellent travail ! Tu maîtrises bien les bases de {skillName}.</p>
                  {results.weakTopics.length > 0 ? (
                    <>
                      <p>Je recommande de te concentrer sur :</p>
                      <ul>
                        {results.weakTopics.map((topic) => (
                          <li key={topic}>
                            <strong>{topic}</strong> - Tu as quelques lacunes ici, on va y travailler ensemble
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p>Tu es prêt à passer au niveau supérieur !</p>
                  )}
                </>
              ) : results.score >= 50 ? (
                <>
                  <p>Bon début ! Tu as une bonne base en {skillName}.</p>
                  <p>Je recommande de consolider tes connaissances sur :</p>
                  <ul>
                    {results.weakTopics.slice(0, 3).map((topic) => (
                      <li key={topic}>
                        <strong>{topic}</strong>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <p>C'est un bon point de départ ! {skillName} demande de la pratique.</p>
                  <p>Ne t'inquiète pas, on va reprendre les bases ensemble :</p>
                  <ul>
                    {results.topicScores.slice(-2).map((topic) => (
                      <li key={topic.name}>
                        <strong>{topic.name}</strong> - On va commencer par ici
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <p>Prêt à commencer ? 🚀</p>
            </MentorText>
          </MentorMessage>
        </RecommendationsCard>
      </ResultsGrid>

      {/* Actions */}
      <ResultsActions>
        <Button variant="outline" onClick={onModifySkills}>
          Modifier mes skills
        </Button>
        <Button variant="primary" size="lg" onClick={onStartMentoring}>
          Commencer le mentorat →
        </Button>
      </ResultsActions>
    </ResultsContainer>
  );
};

export default ResultsStep;
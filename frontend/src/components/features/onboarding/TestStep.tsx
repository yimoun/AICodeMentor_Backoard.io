import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '../../ui/Button';
import {
  TestContainer,
  TestHeader,
  TestInfo,
  TestSkill,
  TestProgress,
  TestTimer,
  TestProgressBar,
  QuestionCard,
  QuestionHeader,
  DifficultyBadge,
  QuestionTopic,
  QuestionText,
  CodeBlock,
  CodeHeader,
  CodeLang,
  CodeCopy,
  CodePre,
  CodeContent,
  AnswerOptions,
  AnswerOption,
  OptionContent,
  OptionLetter,
  OptionText,
  HintSection,
  HintBtn,
  HintCost,
  HintContent,
  TestActions,
} from '../../../styles/onboarding/OnboardingStyles';

/**
 * Type de difficulté
 */
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

/**
 * Type d'une option de réponse
 */
export interface AnswerOptionData {
  letter: string;
  text: string;
  isCorrect: boolean;
}

/**
 * Type d'une question
 */
export interface QuestionData {
  id: string;
  text: string;
  code?: string;
  codeLang?: string;
  difficulty: DifficultyLevel;
  topic: string;
  options: AnswerOptionData[];
  hint?: string;
}

/**
 * Réponse de l'utilisateur
 */
export interface UserAnswer {
  questionId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
  usedHint: boolean;
}

interface TestStepProps {
  /** Skill testé */
  skillName: string;
  /** Logo du skill */
  skillLogo: string;
  /** Questions du test */
  questions: QuestionData[];
  /** Temps par question (secondes) */
  timePerQuestion?: number;
  /** Callback quand le test est terminé */
  onComplete: (answers: UserAnswer[]) => void;
  /** Callback retour (optionnel) */
  onBack?: () => void;
}

/**
 * Questions par défaut pour Python
 */
export const defaultPythonQuestions: QuestionData[] = [
  {
    id: 'q1',
    text: 'Que retourne la fonction suivante lorsqu\'elle est appelée avec `mystery(5)` ?',
    code: `def mystery(n):
    if n <= 1:
        return n
    return mystery(n-1) + mystery(n-2)

result = mystery(5)`,
    codeLang: 'Python',
    difficulty: 'medium',
    topic: 'Fonctions',
    options: [
      { letter: 'A', text: '5', isCorrect: false },
      { letter: 'B', text: '8', isCorrect: false },
      { letter: 'C', text: '5', isCorrect: true },
      { letter: 'D', text: 'RecursionError', isCorrect: false },
    ],
    hint: 'C\'est une implémentation récursive d\'une suite mathématique célèbre...',
  },
  {
    id: 'q2',
    text: 'Quelle est la sortie du code suivant ?',
    code: `x = [1, 2, 3]
y = x
y.append(4)
print(len(x))`,
    codeLang: 'Python',
    difficulty: 'easy',
    topic: 'Structures de données',
    options: [
      { letter: 'A', text: '3', isCorrect: false },
      { letter: 'B', text: '4', isCorrect: true },
      { letter: 'C', text: 'Error', isCorrect: false },
      { letter: 'D', text: 'None', isCorrect: false },
    ],
    hint: 'Les listes en Python sont mutables et assignées par référence.',
  },
  {
    id: 'q3',
    text: 'Comment définir une classe avec une méthode statique en Python ?',
    difficulty: 'medium',
    topic: 'POO',
    options: [
      { letter: 'A', text: '@staticmethod', isCorrect: true },
      { letter: 'B', text: '@static', isCorrect: false },
      { letter: 'C', text: 'static def', isCorrect: false },
      { letter: 'D', text: '@classmethod', isCorrect: false },
    ],
    hint: 'Le décorateur commence par @static...',
  },
];

/**
 * Étape 4: Test de niveau
 */
const TestStep: React.FC<TestStepProps> = ({
  skillName,
  skillLogo,
  questions,
  timePerQuestion = 120,
  onComplete,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [usedHintForQuestion, setUsedHintForQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [answers, setAnswers] = useState<UserAnswer[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  /**
   * Timer
   */
  useEffect(() => {
    if (timeLeft <= 0) {
      handleNext();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /**
   * Format du timer
   */
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Passer à la question suivante
   */
  const handleNext = useCallback(() => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000);
    const selectedOption = currentQuestion.options.find(
      (opt) => opt.letter === selectedAnswer
    );

    // Enregistrer la réponse
    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer || '',
      isCorrect: selectedOption?.isCorrect || false,
      timeSpent,
      usedHint: usedHintForQuestion,
    };

    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    // Passer à la question suivante ou terminer
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowHint(false);
      setUsedHintForQuestion(false);
      setTimeLeft(timePerQuestion);
      setQuestionStartTime(Date.now());
    } else {
      onComplete(newAnswers);
    }
  }, [
    answers,
    currentIndex,
    currentQuestion,
    onComplete,
    questionStartTime,
    questions.length,
    selectedAnswer,
    timePerQuestion,
    usedHintForQuestion,
  ]);

  /**
   * Afficher l'indice
   */
  const handleShowHint = () => {
    setShowHint(true);
    setUsedHintForQuestion(true);
  };

  /**
   * Copier le code
   */
  const handleCopyCode = async () => {
    if (currentQuestion.code) {
      try {
        await navigator.clipboard.writeText(currentQuestion.code);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    }
  };

  /**
   * Passer la question
   */
  const handleSkip = () => {
    setSelectedAnswer(null);
    handleNext();
  };

  return (
    <TestContainer>
      {/* Header */}
      <TestHeader>
        <TestInfo>
          <TestSkill>
            <span>{skillLogo}</span>
            Test {skillName}
          </TestSkill>
          <TestProgress>
            Question {currentIndex + 1}/{questions.length}
          </TestProgress>
        </TestInfo>
        <TestTimer>
          <span>⏱️</span>
          {formatTime(timeLeft)}
        </TestTimer>
      </TestHeader>

      {/* Barre de progression */}
      <TestProgressBar variant="determinate" value={progress} />

      {/* Carte de question */}
      <QuestionCard>
        <QuestionHeader>
          <DifficultyBadge level={currentQuestion.difficulty}>
            {currentQuestion.difficulty === 'easy'
              ? 'Facile'
              : currentQuestion.difficulty === 'medium'
              ? 'Intermédiaire'
              : 'Difficile'}
          </DifficultyBadge>
          <QuestionTopic>Topic: {currentQuestion.topic}</QuestionTopic>
        </QuestionHeader>

        <QuestionText
          dangerouslySetInnerHTML={{
            __html: currentQuestion.text.replace(
              /`([^`]+)`/g,
              '<code>$1</code>'
            ),
          }}
        />

        {/* Bloc de code */}
        {currentQuestion.code && (
          <CodeBlock>
            <CodeHeader>
              <CodeLang>{currentQuestion.codeLang || 'Code'}</CodeLang>
              <CodeCopy onClick={handleCopyCode}>📋 Copier</CodeCopy>
            </CodeHeader>
            <CodePre>
              <CodeContent>{currentQuestion.code}</CodeContent>
            </CodePre>
          </CodeBlock>
        )}

        {/* Options de réponse */}
        <AnswerOptions>
          {currentQuestion.options.map((option) => (
            <AnswerOption key={option.letter}>
              <input
                type="radio"
                name="answer"
                value={option.letter}
                checked={selectedAnswer === option.letter}
                onChange={() => setSelectedAnswer(option.letter)}
              />
              <OptionContent selected={selectedAnswer === option.letter}>
                <OptionLetter selected={selectedAnswer === option.letter}>
                  {option.letter}
                </OptionLetter>
                <OptionText>{option.text}</OptionText>
              </OptionContent>
            </AnswerOption>
          ))}
        </AnswerOptions>

        {/* Section indice */}
        {currentQuestion.hint && (
          <HintSection>
            {!showHint ? (
              <HintBtn onClick={handleShowHint}>
                💡 Indice <HintCost>(-1 crédit)</HintCost>
              </HintBtn>
            ) : (
              <HintContent>{currentQuestion.hint}</HintContent>
            )}
          </HintSection>
        )}
      </QuestionCard>

      {/* Actions */}
      <TestActions>
        <Button variant="outline" onClick={handleSkip}>
          Passer
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!selectedAnswer}
        >
          {currentIndex < questions.length - 1 ? 'Valider →' : 'Terminer →'}
        </Button>
      </TestActions>
    </TestContainer>
  );
};

export default TestStep;
import React, { useState, useMemo } from 'react';
import { Button } from '../../ui/Button';
import {
  ProfileCard,
  CardTitle,
  CardDescription,
  StepActions,
  SkillsSelection,
  SkillCategory,
  CategoryTitle,
  CategoryIcon,
  CategoryTag,
  SkillsGrid,
  SkillOption,
  SkillCard,
  SkillLogo,
  SkillName,
  SkillType,
  SkillPrereq,
  SelectedSkillsSummary,
  SelectedSkillsList,
  SelectedSkillTag,
} from '../../../styles/onboarding/OnboardingStyles';
import { Box, Typography } from '@mui/material';

/**
 * Type d'un skill
 */
export interface SkillData {
  id: string;
  name: string;
  logo: string;
  type: string;
  requires?: string;
}

/**
 * Type d'une catégorie de skills
 */
export interface SkillCategoryData {
  id: string;
  title: string;
  icon: string;
  tag?: string;
  tagVariant?: 'info' | 'warning';
  skills: SkillData[];
}

interface SkillsStepProps {
  /** Catégories de skills */
  categories: SkillCategoryData[];
  /** Skills initialement sélectionnés */
  initialSkills?: string[];
  /** Limite de skills (plan gratuit) */
  skillLimit?: number;
  /** Callback à la soumission */
  onNext: (selectedSkills: string[]) => void;
  /** Callback retour */
  onBack: () => void;
}

/**
 * Catégories de skills par défaut
 */
export const defaultSkillCategories: SkillCategoryData[] = [
  {
    id: 'languages',
    title: 'Langages de programmation',
    icon: '⚙️',
    tag: 'Fondations',
    skills: [
      { id: 'python', name: 'Python', logo: '🐍', type: 'Langage' },
      { id: 'javascript', name: 'JavaScript', logo: '🟨', type: 'Langage' },
      { id: 'typescript', name: 'TypeScript', logo: '🔷', type: 'Langage', requires: 'javascript' },
      { id: 'java', name: 'Java', logo: '☕', type: 'Langage' },
      { id: 'csharp', name: 'C#', logo: '🟣', type: 'Langage' },
    ],
  },
  {
    id: 'frontend',
    title: 'Frameworks Frontend',
    icon: '⚛️',
    tag: 'Requiert JavaScript',
    tagVariant: 'warning',
    skills: [
      { id: 'react', name: 'React', logo: '⚛️', type: 'Framework', requires: 'javascript' },
      { id: 'vuejs', name: 'Vue.js', logo: '💚', type: 'Framework', requires: 'javascript' },
      { id: 'angular', name: 'Angular', logo: '🅰️', type: 'Framework', requires: 'typescript' },
    ],
  },
  {
    id: 'backend',
    title: 'Frameworks Backend',
    icon: '🚀',
    skills: [
      { id: 'django', name: 'Django', logo: '🎸', type: 'Framework', requires: 'python' },
      { id: 'fastapi', name: 'FastAPI', logo: '⚡', type: 'Framework', requires: 'python' },
      { id: 'nodejs', name: 'Node.js', logo: '💚', type: 'Runtime', requires: 'javascript' },
      { id: 'aspnet', name: 'ASP.NET', logo: '🟣', type: 'Framework', requires: 'csharp' },
    ],
  },
  {
    id: 'databases',
    title: 'Bases de données',
    icon: '🗄️',
    skills: [
      { id: 'sql', name: 'SQL', logo: '📊', type: 'Langage' },
      { id: 'postgresql', name: 'PostgreSQL', logo: '🐘', type: 'SGBD', requires: 'sql' },
      { id: 'mongodb', name: 'MongoDB', logo: '🍃', type: 'NoSQL' },
    ],
  },
];

/**
 * Étape 2: Sélection des compétences
 */
const SkillsStep: React.FC<SkillsStepProps> = ({
  categories = defaultSkillCategories,
  initialSkills = [],
  skillLimit,
  onNext,
  onBack,
}) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialSkills);

  const skillsMap = useMemo(() => {
    const map = new Map<string, SkillData>();
    categories.forEach((cat) => {
      cat.skills.forEach((skill) => {
        map.set(skill.id, skill);
      });
    });
    return map;
  }, [categories]);

  /**
   * Gestion de la sélection/désélection d'un skill
   */
  const handleSkillToggle = (skillId: string) => {
    const skill = skillsMap.get(skillId);
    if (!skill) return;

    setSelectedSkills((prev) => {
      const isSelected = prev.includes(skillId);

      if (isSelected) {
        // Désélectionner le skill et ses dépendants
        const dependents = Array.from(skillsMap.values())
          .filter((s) => s.requires === skillId)
          .map((s) => s.id);
        return prev.filter((id) => id !== skillId && !dependents.includes(id));
      } else {
        // Vérifier la limite
        if (skillLimit && prev.length >= skillLimit) {
          return prev;
        }

        // Sélectionner le skill et ses prérequis
        const newSkills = [...prev, skillId];
        
        // Ajouter le prérequis si nécessaire
        if (skill.requires && !prev.includes(skill.requires)) {
          newSkills.push(skill.requires);
        }

        return newSkills;
      }
    });
  };

  /**
   * Obtenir le label du prérequis
   */
  const getPrereqLabel = (requires: string): string => {
    const skill = skillsMap.get(requires);
    return skill ? `Requiert: ${skill.name}` : '';
  };

  /**
   * Soumission
   */
  const handleSubmit = () => {
    onNext(selectedSkills);
  };

  return (
    <ProfileCard wide>
      <CardTitle>Que voulez-vous apprendre ?</CardTitle>
      <CardDescription>
        Sélectionnez vos compétences. Les prérequis sont automatiquement gérés.
      </CardDescription>

      <SkillsSelection>
        {categories.map((category) => (
          <SkillCategory key={category.id}>
            <CategoryTitle>
              <CategoryIcon>{category.icon}</CategoryIcon>
              {category.title}
              {category.tag && (
                <CategoryTag variant={category.tagVariant}>
                  {category.tag}
                </CategoryTag>
              )}
            </CategoryTitle>

            <SkillsGrid>
              {category.skills.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                const isDisabled =
                  !!skillLimit &&
                  selectedSkills.length >= skillLimit &&
                  !isSelected;

                return (
                  <SkillOption key={skill.id}>
                    <input
                      type="checkbox"
                      name="skills"
                      value={skill.id}
                      checked={isSelected}
                      onChange={() => handleSkillToggle(skill.id)}
                      disabled={isDisabled}
                    />
                    <SkillCard
                      selected={isSelected}
                      sx={{
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <SkillLogo>{skill.logo}</SkillLogo>
                      <SkillName>{skill.name}</SkillName>
                      <SkillType>{skill.type}</SkillType>
                      {skill.requires && (
                        <SkillPrereq>{getPrereqLabel(skill.requires)}</SkillPrereq>
                      )}
                    </SkillCard>
                  </SkillOption>
                );
              })}
            </SkillsGrid>
          </SkillCategory>
        ))}
      </SkillsSelection>

      {/* Résumé des skills sélectionnés */}
      <SelectedSkillsSummary>
        <Typography variant="subtitle2" fontWeight={600}>
          Compétences sélectionnées: {selectedSkills.length}
          {skillLimit && ` / ${skillLimit}`}
        </Typography>
        <SelectedSkillsList>
          {selectedSkills.map((skillId) => {
            const skill = skillsMap.get(skillId);
            return skill ? (
              <SelectedSkillTag key={skillId}>
                {skill.logo} {skill.name}
              </SelectedSkillTag>
            ) : null;
          })}
        </SelectedSkillsList>

        {/* Warning limite plan gratuit */}
        {skillLimit && selectedSkills.length >= skillLimit && (
          <Box
            sx={{
              mt: 2,
              p: 1,
              backgroundColor: '#FFF3CD',
              borderRadius: 1,
              fontSize: '0.8125rem',
              color: '#856404',
            }}
          >
            ⚠️ Plan Gratuit limité à {skillLimit} compétences.{' '}
            <a href="/pricing" style={{ color: 'inherit' }}>
              Passer à Starter
            </a>
          </Box>
        )}
      </SelectedSkillsSummary>

      {/* Actions */}
      <StepActions>
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={selectedSkills.length === 0}
        >
          Continuer
        </Button>
      </StepActions>
    </ProfileCard>
  );
};

export default SkillsStep;

export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise';


export type LearningStyleType = 'visual' | 'reading' | 'hands_on';

/**
 * Interface utilisateur complète
 */
export default interface IUser {
  // ============================================
  // IDENTIFIANTS
  // ============================================
  id?: number;
  username?: string;
  email?: string;
  
  // ============================================
  // INFORMATIONS PERSONNELLES
  // ============================================
  first_name?: string;
  last_name?: string;
  age?: number;
  avatar_url?: string;
  
  // ============================================
  // AUTHENTIFICATION
  // ============================================
  password?: string;
  confirmation_password?: string;
  
  // ============================================
  // STATUT
  // ============================================
  email_verified?: boolean;
  onboarding_finished?: boolean;
  is_active?: boolean;
  
  // ============================================
  // PRÉFÉRENCES D'APPRENTISSAGE
  // ============================================
  experience_years?: string;
  learning_style?: LearningStyleType;
  daily_goal_minutes?: number;
  
  // ============================================
  // SKILLS ET OBJECTIFS
  // ============================================
  selected_skills?: string[];
  goals?: string[];
  
  // ============================================
  // PLAN ET CRÉDITS
  // ============================================
  plan?: PlanType;
  credits?: number;
  
  // ============================================
  // STATISTIQUES
  // ============================================
  streak_days?: number;
  total_xp?: number;
  total_questions?: number;
  
  // ============================================
  // MÉTADONNÉES
  // ============================================
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}


export default interface IUser {
  // Identifiants
  id?: number;
  username?: string;
  email?: string;
  
  // Informations personnelles
  first_name?: string;
  last_name?: string;
  age?: number;
  
  // Authentification
  password?: string;
  confirmation_password?: string;
  
  // Statut
  email_verified?: boolean;
  onboarding_finished?: boolean;
  
  // Préférences d'apprentissage
  experience_years?: string;
  learning_style?: 'visual' | 'reading' | 'hands_on';
  daily_goal_minutes?: number;
  
  // Skills et objectifs
  selected_skills?: string[];
  goals?: string[];
  
  // Plan et crédits
  plan?: 'free' | 'starter' | 'pro' | 'enterprise';
  credits?: number;
  
  // Métadonnées
  created_at?: string;
  updated_at?: string;
}

// import type { AxiosResponse } from "axios"
// import CustomAxios, { setLocalToken, unsetLocalToken } from "./CustomAxios"
// import type IUser from "../data_interfaces/IUser"
// import type OnboardingPayload from "../data_interfaces/IOnboardingPayload"


// /*Envoie une requête PUT pour modifier le mot de passe de l'utilisateur actuel:Retourne une Promise
//  contenant la réponse de l'API.*/
// const changePassword = (password: string): Promise<AxiosResponse<IUser>> => (
//   CustomAxios.put("auth/current-user-password/me/", { password })
// )

// //Récupère les informations de l'utilisateur connecté.
// const get = (): Promise<AxiosResponse<IUser>> => (
  //La vraie route de son Backend
//   CustomAxios.get("auth/current-user/")
// )


// /*Envoie une requête POST pour obtenir un token JWT.Si la connexion réussit:Stocke le token
//  via setLocalToken(response.data).Résout la Promise avec true.Sinon, rejette la Promise avec une erreur.*/
// const login = (username: string, password: string): Promise<boolean> => {
//   const promise = new Promise<boolean>((resolve, reject) => {
//     CustomAxios.post("token/", { username, password })
//       .then((response) => {
//         setLocalToken(response.data)
//         resolve(true)
//       })
//       .catch((err) => {
//         reject(err)
//       })
//   })
//   return promise
// }

// //Supprime le token JWT via unsetLocalToken(): Retourne true une fois déconnecté.
// const logout = (): Promise<boolean> => {
//   const promise = new Promise<boolean>((resolve) => {
//     unsetLocalToken()
//     resolve(true)
//   });
//   return promise;
// }

// //Fonction register (Créer un compte utilisateur)
// const register = (user: IUser): Promise<AxiosResponse<IUser>> => (
//   CustomAxios.post("register/", {
//     first_name: user.first_name,
//     last_name: user.last_name,
//     username: user.username,
//     email: user.email,
//     password: user.password,
//     confirmation_password: user.confirmation_password,
//   })
// )

// //Fonction save (Modifier les infos utilisateur)
// const save = (user: IUser): Promise<AxiosResponse<IUser>> => (
//   CustomAxios.put("auth/current-user/me/", user)
// )

// // Supprimer l'utilisateur connecté
// const deleteUser = (): Promise<AxiosResponse<void>> => (
//   CustomAxios.delete("auth/user-delete/me/")
// );

// /**
//  * Vérifie si l'email de l'utilisateur a été vérifié
//  * @param email - Email de l'utilisateur
//  * @returns Promise avec { verified: boolean }
//  */
// const checkEmailVerified = (email: string): Promise<AxiosResponse<{ verified: boolean }>> => (
//   CustomAxios.post("auth/check-email-verified/", { email })
// )

// /**
//  * Renvoie l'email de vérification
//  * @param email - Email de l'utilisateur
//  * @returns Promise
//  */
// const resendVerificationEmail = (email: string): Promise<AxiosResponse<{ message: string }>> => (
//   CustomAxios.post("auth/resend-verification-email/", { email })
// )

// /**
//  * Données pour compléter l'onboarding
//  */

// /**
//  * Complète l'onboarding de l'utilisateur
//  * @param data - Données de l'onboarding
//  * @returns Promise
//  */
// const completeOnboarding = (data: OnboardingPayload): Promise<AxiosResponse<IUser>> => (
//   CustomAxios.post("auth/complete-onboarding/", data)
// )

// const UserDS = {
//   changePassword,
//   get,
//   login,
//   logout,
//   register,
//   save,
//   deleteUser,
//   checkEmailVerified,
//   resendVerificationEmail,
//   completeOnboarding,
// }

// export default UserDS;


// VERSION MOCK - Simule le backend avec localStorage

import type IUser from "../data_interfaces/IUser";

// ============================================
// CONFIGURATION
// ============================================

/** Clés localStorage */
const STORAGE_KEYS = {
  USERS_DB: 'aicodementor_users_db',      // "Base de données" des utilisateurs
  CURRENT_USER: 'aicodementor_current_user', // Utilisateur connecté
  AUTH_TOKEN: 'aicodementor_auth_token',     // Token d'authentification
};

/** Délai simulé pour les requêtes (ms) */
const SIMULATED_DELAY = 500;

// ============================================
// HELPERS - Base de données locale
// ============================================

/**
 * Simuler un délai réseau
 */
const delay = (ms: number = SIMULATED_DELAY): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Générer un ID unique
 */
const generateId = (): number => Date.now();

/**
 * Générer un token factice
 */
const generateToken = (): string => 
  `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;

/**
 * Récupérer tous les utilisateurs de la "BD"
 */
const getUsersDB = (): IUser[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Sauvegarder les utilisateurs dans la "BD"
 */
const saveUsersDB = (users: IUser[]): void => {
  localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
};

/**
 * Trouver un utilisateur par email ou username
 */
const findUser = (identifier: string): IUser | undefined => {
  const users = getUsersDB();
  return users.find(
    u => u.email === identifier || u.username === identifier
  );
};

/**
 * Trouver un utilisateur par ID
 */
const findUserById = (id: number): IUser | undefined => {
  const users = getUsersDB();
  return users.find(u => u.id === id);
};

/**
 * Mettre à jour un utilisateur dans la BD
 */
const updateUserInDB = (updatedUser: IUser): void => {
  const users = getUsersDB();
  const index = users.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser, updated_at: new Date().toISOString() };
    saveUsersDB(users);
  }
};

/**
 * Récupérer l'utilisateur connecté
 */
const getCurrentUser = (): IUser | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

/**
 * Sauvegarder l'utilisateur connecté
 */
const setCurrentUser = (user: IUser | null): void => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

/**
 * Récupérer le token
 */
export const getLocalToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Sauvegarder le token
 */
export const setLocalToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Supprimer le token
 */
export const unsetLocalToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

// ============================================
// TYPES DE RÉPONSE
// ============================================

interface MockResponse<T> {
  data: T;
  status: number;
}

// ============================================
// API MOCK - Authentification
// ============================================

/**
 * Inscription d'un nouvel utilisateur
 */
const register = async (userData: Partial<IUser>): Promise<MockResponse<IUser>> => {
  await delay();
  
  console.log('📝 [UserDS.register] Registering user:', userData.email);

  // Vérifier si l'email existe déjà
  if (userData.email && findUser(userData.email)) {
    const error: any = new Error('Un compte avec cet email existe déjà');
    error.response = { status: 409, data: { message: 'Email already exists' } };
    throw error;
  }

  // Vérifier si le username existe déjà
  if (userData.username && findUser(userData.username)) {
    const error: any = new Error('Ce nom d\'utilisateur est déjà pris');
    error.response = { status: 409, data: { message: 'Username already exists' } };
    throw error;
  }

  // Créer le nouvel utilisateur
  const newUser: IUser = {
    id: generateId(),
    username: userData.username || userData.email?.split('@')[0],
    email: userData.email,
    first_name: userData.first_name || '',
    last_name: userData.last_name || '',
    password: userData.password, // En vrai, on hasherait ça côté serveur
    email_verified: false,       // Email non vérifié par défaut
    onboarding_finished: false,  // Onboarding non terminé
    plan: 'free',
    credits: 100,                // Crédits de départ
    streak_days: 0,
    total_xp: 0,
    selected_skills: [],
    goals: [],
    daily_goal_minutes: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Sauvegarder dans la "BD"
  const users = getUsersDB();
  users.push(newUser);
  saveUsersDB(users);

  console.log('✅ [UserDS.register] User created:', newUser.id);

  // Retourner l'utilisateur (sans le password)
  const { password, ...userWithoutPassword } = newUser;
  return { data: userWithoutPassword, status: 201 };
};

/**
 * Connexion d'un utilisateur
 */
const login = async (identifier: string, password: string): Promise<MockResponse<{ access: string; refresh: string }>> => {
  await delay();

  console.log('🔐 [UserDS.login] Attempting login for:', identifier);

  // Trouver l'utilisateur
  const user = findUser(identifier);

  if (!user) {
    console.log('❌ [UserDS.login] User not found');
    const error: any = new Error('Utilisateur non trouvé');
    error.response = { status: 401, data: { message: 'Invalid credentials' } };
    throw error;
  }

  // Vérifier le mot de passe
  if (user.password !== password) {
    console.log('❌ [UserDS.login] Invalid password');
    const error: any = new Error('Mot de passe incorrect');
    error.response = { status: 401, data: { message: 'Invalid credentials' } };
    throw error;
  }

  // Vérifier si l'email est vérifié (optionnel, décommenter si besoin)
  // if (!user.email_verified) {
  //   console.log('❌ [UserDS.login] Email not verified');
  //   const error: any = new Error('Email non vérifié');
  //   error.response = { status: 403, data: { message: 'Email not verified' } };
  //   throw error;
  // }

  // Générer les tokens
  const accessToken = generateToken();
  const refreshToken = generateToken();

  // Sauvegarder le token et l'utilisateur connecté
  setLocalToken(accessToken);
  setCurrentUser(user);

  // Mettre à jour last_login
  updateUserInDB({ ...user, last_login: new Date().toISOString() });

  console.log('✅ [UserDS.login] Login successful for:', user.username);

  return { 
    data: { access: accessToken, refresh: refreshToken }, 
    status: 200 
  };
};

/**
 * Déconnexion
 */
const logout = async (): Promise<MockResponse<{ message: string }>> => {
  await delay(200);

  console.log('👋 [UserDS.logout] Logging out');

  unsetLocalToken();
  setCurrentUser(null);

  return { data: { message: 'Logged out successfully' }, status: 200 };
};

/**
 * Récupérer les infos de l'utilisateur connecté
 */
const get = async (): Promise<MockResponse<IUser>> => {
  await delay(300);



  const token = getLocalToken();
  if (!token) {
    const error: any = new Error('Non authentifié');
    error.response = { status: 401, data: { message: 'Not authenticated' } };
    throw error;
  }

  const user = getCurrentUser();
  if (!user) {
    const error: any = new Error('Utilisateur non trouvé');
    error.response = { status: 401, data: { message: 'User not found' } };
    throw error;
  }

  // Récupérer la version la plus récente depuis la BD
  const freshUser = findUserById(user.id!);
  if (freshUser) {
    setCurrentUser(freshUser);
    const { password, ...userWithoutPassword } = freshUser;
    return { data: userWithoutPassword, status: 200 };
  }

  const { password, ...userWithoutPassword } = user;
  return { data: userWithoutPassword, status: 200 };
};

/**
 * Mettre à jour le profil utilisateur
 */
const save = async (userData: Partial<IUser>): Promise<MockResponse<IUser>> => {
  await delay();

  console.log('💾 [UserDS.save] Saving user data:', userData);

  const currentUser = getCurrentUser();
  if (!currentUser) {
    const error: any = new Error('Non authentifié');
    error.response = { status: 401, data: { message: 'Not authenticated' } };
    throw error;
  }

  // Mettre à jour l'utilisateur
  const updatedUser: IUser = {
    ...currentUser,
    ...userData,
    updated_at: new Date().toISOString(),
  };

  updateUserInDB(updatedUser);
  setCurrentUser(updatedUser);

  console.log('✅ [UserDS.save] User updated');

  const { password, ...userWithoutPassword } = updatedUser;
  return { data: userWithoutPassword, status: 200 };
};

/**
 * Changer le mot de passe
 */
const changePassword = async (oldPassword: string, newPassword: string): Promise<MockResponse<{ message: string }>> => {
  await delay();

  const currentUser = getCurrentUser();
  if (!currentUser) {
    const error: any = new Error('Non authentifié');
    error.response = { status: 401 };
    throw error;
  }

  // Vérifier l'ancien mot de passe
  const dbUser = findUserById(currentUser.id!);
  if (!dbUser || dbUser.password !== oldPassword) {
    const error: any = new Error('Ancien mot de passe incorrect');
    error.response = { status: 400 };
    throw error;
  }

  // Mettre à jour le mot de passe
  updateUserInDB({ ...dbUser, password: newPassword });

  return { data: { message: 'Password changed successfully' }, status: 200 };
};

/**
 * Supprimer le compte
 */
const deleteUser = async (): Promise<MockResponse<{ message: string }>> => {
  await delay();

  const currentUser = getCurrentUser();
  if (!currentUser) {
    const error: any = new Error('Non authentifié');
    error.response = { status: 401 };
    throw error;
  }

  // Supprimer de la BD
  const users = getUsersDB();
  const filteredUsers = users.filter(u => u.id !== currentUser.id);
  saveUsersDB(filteredUsers);

  // Déconnecter
  unsetLocalToken();
  setCurrentUser(null);

  return { data: { message: 'Account deleted successfully' }, status: 200 };
};

// ============================================
// API MOCK - Vérification Email
// ============================================

/**
 * Vérifier si l'email est vérifié
 */
const checkEmailVerified = async (email: string): Promise<MockResponse<{ verified: boolean }>> => {
  await delay(300);

  console.log('📧 [UserDS.checkEmailVerified] Checking:', email);

  const user = findUser(email);
  if (!user) {
    const error: any = new Error('Utilisateur non trouvé');
    error.response = { status: 404 };
    throw error;
  }

  return { data: { verified: user.email_verified || false }, status: 200 };
};

/**
 * Renvoyer l'email de vérification
 */
const resendVerificationEmail = async (email: string): Promise<MockResponse<{ message: string }>> => {
  await delay();

  console.log('📨 [UserDS.resendVerificationEmail] Resending to:', email);

  const user = findUser(email);
  if (!user) {
    const error: any = new Error('Utilisateur non trouvé');
    error.response = { status: 404 };
    throw error;
  }

  if (user.email_verified) {
    const error: any = new Error('Email déjà vérifié');
    error.response = { status: 400 };
    throw error;
  }

  // Simuler l'envoi d'email
  console.log('📬 [UserDS.resendVerificationEmail] Email "sent" to:', email);

  return { data: { message: 'Verification email sent' }, status: 200 };
};

/**
 * Simuler la vérification d'email (à appeler manuellement pour les tests)
 */
const verifyEmail = async (email: string): Promise<MockResponse<{ message: string }>> => {
  await delay(200);

  console.log('✅ [UserDS.verifyEmail] Verifying:', email);

  const user = findUser(email);
  if (!user) {
    const error: any = new Error('Utilisateur non trouvé');
    error.response = { status: 404 };
    throw error;
  }

  updateUserInDB({ ...user, email_verified: true });

  return { data: { message: 'Email verified successfully' }, status: 200 };
};

// ============================================
// API MOCK - Onboarding
// ============================================

/**
 * Données pour compléter l'onboarding
 */
interface OnboardingPayload {
  first_name: string;
  last_name: string;
  age?: number;
  experience_years: string;
  learning_style: 'visual' | 'reading' | 'hands_on';
  selected_skills: string[];
  goals: string[];
  daily_goal_minutes: number;
  test_results: {
    question_id: string;
    answer: string;
    is_correct: boolean;
    time_spent: number;
    used_hint: boolean;
  }[];
}

/**
 * Compléter l'onboarding
 */
const completeOnboarding = async (data: OnboardingPayload): Promise<MockResponse<IUser>> => {
  await delay();

  console.log('🎓 [UserDS.completeOnboarding] Completing onboarding:', data);

  const currentUser = getCurrentUser();
  if (!currentUser) {
    const error: any = new Error('Non authentifié');
    error.response = { status: 401 };
    throw error;
  }

  // Calculer le score du test
  const correctAnswers = data.test_results.filter(r => r.is_correct).length;
  const totalQuestions = data.test_results.length;
  const testScore = Math.round((correctAnswers / totalQuestions) * 100);

  // Mettre à jour l'utilisateur
  const updatedUser: IUser = {
    ...currentUser,
    first_name: data.first_name,
    last_name: data.last_name,
    age: data.age,
    experience_years: data.experience_years,
    learning_style: data.learning_style,
    selected_skills: data.selected_skills,
    goals: data.goals,
    daily_goal_minutes: data.daily_goal_minutes,
    onboarding_finished: true,
    total_xp: testScore * 10, // XP initial basé sur le test
    updated_at: new Date().toISOString(),
  };

  updateUserInDB(updatedUser);
  setCurrentUser(updatedUser);

  console.log('✅ [UserDS.completeOnboarding] Onboarding completed, test score:', testScore);

  const { password, ...userWithoutPassword } = updatedUser;
  return { data: userWithoutPassword, status: 200 };
};

// ============================================
// UTILITAIRES DE DEBUG
// ============================================

/**
 * Afficher tous les utilisateurs (debug)
 */
const debugListUsers = (): void => {
  const users = getUsersDB();
  console.log('🗄️ [DEBUG] All users in DB:', users);
};

/**
 * Vider la base de données (debug)
 */
const debugClearDB = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USERS_DB);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  console.log('🗑️ [DEBUG] Database cleared');
};

/**
 * Créer un utilisateur de test (debug)
 */
const debugCreateTestUser = async (): Promise<IUser> => {
  const testUser: Partial<IUser> = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    first_name: 'Jordan',
    last_name: 'Takam',
  };

  try {
    const response = await register(testUser);
    // Vérifier l'email automatiquement pour les tests
    await verifyEmail(testUser.email!);
    console.log('🧪 [DEBUG] Test user created:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      console.log('🧪 [DEBUG] Test user already exists');
      return findUser('test@example.com')!;
    }
    throw error;
  }
};

// ============================================
// EXPORT
// ============================================

const UserDS = {
  // Auth
  register,
  login,
  logout,
  get,
  save,
  changePassword,
  deleteUser,
  
  // Email verification
  checkEmailVerified,
  resendVerificationEmail,
  verifyEmail, // Pour simuler la vérification manuellement
  
  // Onboarding
  completeOnboarding,
  
  // Debug (à retirer en production)
  debugListUsers,
  debugClearDB,
  debugCreateTestUser,
};

export default UserDS;
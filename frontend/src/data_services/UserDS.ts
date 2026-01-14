import type { AxiosResponse } from "axios"
import CustomAxios, { setLocalToken, unsetLocalToken } from "./CustomAxios"
import type IUser from "../data_interfaces/IUser"
import type OnboardingPayload from "../data_interfaces/IOnboardingPayload"


/*Envoie une requête PUT pour modifier le mot de passe de l'utilisateur actuel:Retourne une Promise
 contenant la réponse de l'API.*/
const changePassword = (password: string): Promise<AxiosResponse<IUser>> => (
  CustomAxios.put("auth/current-user-password/me/", { password })
)

//Récupère les informations de l'utilisateur connecté.
const get = (): Promise<AxiosResponse<IUser>> => (
  //La vraie route de son Backend
  CustomAxios.get("auth/current-user/")
)


/*Envoie une requête POST pour obtenir un token JWT.Si la connexion réussit:Stocke le token
 via setLocalToken(response.data).Résout la Promise avec true.Sinon, rejette la Promise avec une erreur.*/
const login = (username: string, password: string): Promise<boolean> => {
  const promise = new Promise<boolean>((resolve, reject) => {
    CustomAxios.post("token/", { username, password })
      .then((response) => {
        setLocalToken(response.data)
        resolve(true)
      })
      .catch((err) => {
        reject(err)
      })
  })
  return promise
}

//Supprime le token JWT via unsetLocalToken(): Retourne true une fois déconnecté.
const logout = (): Promise<boolean> => {
  const promise = new Promise<boolean>((resolve) => {
    unsetLocalToken()
    resolve(true)
  });
  return promise;
}

/**
 * Créer un compte utilisateur
 * @param user - Données de l'utilisateur (username, email, password requis)
 * @returns Promise avec les données de l'utilisateur créé
 */
const register = (user: IUser): Promise<AxiosResponse<IUser>> => {
  // Construire le payload en filtrant les valeurs undefined/null
  const payload = {
    username: user.username,
    email: user.email,
    password: user.password,
    confirmation_password: user.confirmation_password,
    ...(user.first_name && { first_name: user.first_name }),
    ...(user.last_name && { last_name: user.last_name }),
  };

  // Filtrer les undefined/null avec Object.entries
  const cleanPayload = Object.fromEntries(
    Object.entries(payload).filter(([_, value]) => value !== undefined && value !== null)
  );

  return CustomAxios.post("register/", cleanPayload);
}

//Fonction save (Modifier les infos utilisateur)
const save = (user: IUser): Promise<AxiosResponse<IUser>> => (
  CustomAxios.put("auth/current-user/me/", user)
)

// Supprimer l'utilisateur connecté
const deleteUser = (): Promise<AxiosResponse<void>> => (
  CustomAxios.delete("auth/user-delete/me/")
);

/**
 * Vérifie si l'email de l'utilisateur a été vérifié
 * @param email - Email de l'utilisateur
 * @returns Promise avec { verified: boolean }
 */
const checkEmailVerified = (email: string): Promise<AxiosResponse<{ verified: boolean }>> => (
  CustomAxios.post("auth/check-email-verified/", { email })
)

/**
 * Renvoie l'email de vérification
 * @param email - Email de l'utilisateur
 * @returns Promise
 */
const resendVerificationEmail = (email: string): Promise<AxiosResponse<{ message: string }>> => (
  CustomAxios.post("auth/resend-verification-email/", { email })
)

/**
 * Données pour compléter l'onboarding
 */

/**
 * Complète l'onboarding de l'utilisateur
 * @param data - Données de l'onboarding
 * @returns Promise
 */
const completeOnboarding = (data: OnboardingPayload): Promise<AxiosResponse<IUser>> => (
  CustomAxios.post("auth/complete-onboarding/", data)
)

const UserDS = {
  changePassword,
  get,
  login,
  logout,
  register,
  save,
  deleteUser,
  checkEmailVerified,
  resendVerificationEmail,
  completeOnboarding,
}

export default UserDS;



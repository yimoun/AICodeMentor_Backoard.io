import React, { useState } from "react";
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Composants réutilisables
import FormTextField from "../../controls/FormTextField";
import ProgressBackdrop from "../../controls/ProgressBackdrop";
import { Button } from "../../ui/Button";

// Context
import useUser from "../../hooks/useUser";

// Styles
import {
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthBrandIcon,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  AuthFooter,
  BackLink,
  AuthErrorMessage,
  ForgotPasswordLink,
} from "../../../styles/AuthStyles";
import UserDS from "../../../data_services/UserDS";

/**
 * Types pour le formulaire
 */
interface LoginFormData {
  username: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

interface LoginFormProps {
  /** Callback après connexion réussie */
  onSuccess?: () => void;
  /** Callback en cas d'erreur */
  onError?: (error: string) => void;
  /** URL de redirection par défaut après succès */
  redirectTo?: string;
  /** URL de redirection si onboarding non terminé */
  onboardingRedirect?: string;
  /** Titre personnalisé */
  title?: string;
  /** Sous-titre personnalisé */
  subtitle?: string;
  /** Icône du brand (emoji) */
  brandIcon?: string;
  /** Afficher le lien vers inscription */
  showSignupLink?: boolean;
  /** Afficher le lien mot de passe oublié */
  showForgotPassword?: boolean;
  /** Afficher le lien de retour */
  showBackLink?: boolean;
}

/**
 * Formulaire de connexion avec vérification du statut d'onboarding
 */
const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  redirectTo = "/app/chat",
  onboardingRedirect = "/onboarding",
  title = "Bon retour !",
  subtitle = "Connectez-vous pour continuer votre apprentissage",
  brandIcon = "🎓",
  showSignupLink = true,
  showForgotPassword = true,
  showBackLink = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: loginContext } = useUser();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  /**
   * Récupérer l'URL de redirection depuis le state
   */
  const getRedirectUrl = (onboardingFinished: boolean): string => {
    // Si l'onboarding n'est pas terminé, rediriger vers l'onboarding
    if (!onboardingFinished) {
      return onboardingRedirect;
    }

    // Sinon, utiliser l'URL de redirection précédente ou par défaut
    const state = location.state as LocationState;
    return state?.from?.pathname || redirectTo;
  };

  /**
   * Soumission du formulaire
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // Connexion (stocke le token)
      await UserDS.login(data.username, data.password);

      // Récupérer les infos de l'utilisateur
      const userResponse = await UserDS.get();
      const user = userResponse.data;

      // ✅ IMPORTANT: Mettre à jour le contexte utilisateur
      loginContext(user);

      // Déterminer l'URL de redirection
      const redirectUrl = getRedirectUrl(user.onboarding_finished ?? false);

      console.log("🔍 User onboarding_finished:", user.onboarding_finished);
      console.log("🧭 Redirecting to:", redirectUrl);

      // Callback de succès si défini
      if (onSuccess) {
        onSuccess();
      }

      // Redirection
      navigate(redirectUrl, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);

      // Gestion des erreurs
      if (err.response?.status === 401) {
        setErrorMessage("Nom d'utilisateur ou mot de passe incorrect");
      } else if (err.response?.status === 403) {
        setErrorMessage("Votre compte n'est pas encore activé. Veuillez vérifier votre email.");
      } else {
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      }

      if (onError) {
        onError(err.message || "Une erreur s'est produite");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        {/* Header */}
        <AuthHeader>
          <AuthBrandIcon>{brandIcon}</AuthBrandIcon>
          <AuthTitle>{title}</AuthTitle>
          <AuthSubtitle>{subtitle}</AuthSubtitle>
        </AuthHeader>

        {/* Message d'erreur */}
        {errorMessage && <AuthErrorMessage>{errorMessage}</AuthErrorMessage>}

        {/* Formulaire */}
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          {/* Nom d'utilisateur */}
          <FormTextField
            label="Nom d'utilisateur ou email"
            type="text"
            placeholder="Entrez votre identifiant"
            autoComplete="username"
            autoFocus
            registerReturn={register("username", {
              required: "Le nom d'utilisateur est requis",
            })}
            errorText={errors.username?.message}
          />

          {/* Mot de passe */}
          <Box>
            <FormTextField
              label="Mot de passe"
              type="password"
              placeholder="Entrez votre mot de passe"
              autoComplete="current-password"
              registerReturn={register("password", {
                required: "Le mot de passe est requis",
              })}
              errorText={errors.password?.message}
            />

            {/* Lien mot de passe oublié */}
            {showForgotPassword && (
              <ForgotPasswordLink>
                <Link component={RouterLink} to="/forgot-password">
                  Mot de passe oublié ?
                </Link>
              </ForgotPasswordLink>
            )}
          </Box>

          {/* Bouton de connexion */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            style={{ marginTop: 16 }}
          >
            Se connecter
          </Button>
        </AuthForm>

        {/* Footer - Lien vers inscription */}
        {showSignupLink && (
          <AuthFooter>
            Pas encore de compte ?{" "}
            <Link component={RouterLink} to="/signup">
              Créer un compte
            </Link>
          </AuthFooter>
        )}
      </AuthCard>

      {/* Lien retour accueil */}
      {showBackLink && (
        <Link component={RouterLink} to="/">
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Retour à l'accueil
        </Link>
      )}

      {/* Backdrop de chargement */}
      <ProgressBackdrop open={isLoading} />
    </AuthContainer>
  );
};

export default LoginForm;
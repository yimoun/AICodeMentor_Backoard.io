import React, { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Link } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Composants
import FormTextField from "../../controls/FormTextField";
import ProgressBackdrop from "../../controls/ProgressBackdrop";
import { Button } from "../../ui/Button";
import EmailVerificationModal from "../../modals/EmailVerificationModal";

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
  AuthErrorMessage,
} from "../../../styles/AuthStyles";
import UserDS from "../../../data_services/UserDS";

/**
 * Types pour le formulaire
 */
interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  /** URL de redirection après vérification email */
  redirectAfterVerification?: string;
  /** Nécessite vérification email */
  requireEmailVerification?: boolean;
  /** Callback après inscription réussie */
  onSuccess?: () => void;
  /** Callback en cas d'erreur */
  onError?: (error: string) => void;
  /** Titre personnalisé */
  title?: string;
  /** Sous-titre personnalisé */
  subtitle?: string;
  /** Icône du brand (emoji) */
  brandIcon?: string;
  /** Afficher le lien vers connexion */
  showLoginLink?: boolean;
  /** Afficher le lien de retour */
  showBackLink?: boolean;
}

/**
 * Formulaire d'inscription
 */
const SignupForm: React.FC<SignupFormProps> = ({
  redirectAfterVerification = "/login",
  requireEmailVerification = true,
  onSuccess,
  onError,
  title = "Créer un compte",
  subtitle = "Commencez votre parcours d'apprentissage",
  brandIcon = "🚀",
  showLoginLink = true,
  showBackLink = true,
}) => {
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Pour la validation du mot de passe de confirmation
  const password = watch("password");

  /**
   * Soumission du formulaire
   */
  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // 1. Inscription via UserDS
      const response = await UserDS.register({
        username: data.username,
        email: data.email,
        password: data.password,
        confirmation_password: data.confirmPassword,
      });

      // 2. Vérifier que l'inscription a réussi
      if (!response.data) {
        throw new Error("Erreur lors de l'inscription");
      }

      console.log("✅ User registered:", response.data.email || data.email);

      // 3. Afficher le modal de vérification ou rediriger
      if (requireEmailVerification) {
        setRegisteredEmail(data.email);
        setShowVerificationModal(true);
      } else {
        // Si pas de vérification requise, rediriger directement
        if (onSuccess) {
          onSuccess();
        }
        navigate(redirectAfterVerification, { replace: true });
      }

    } catch (err: any) {
      console.error("❌ Signup error:", err);

      // Gestion des erreurs spécifiques
      if (err.response?.status === 409) {
        setErrorMessage("Un compte avec cet email ou ce nom d'utilisateur existe déjà");
      } else if (err.response?.status === 400) {
        // Erreur de validation
        const errorMsg = err.response?.data?.detail || err.response?.data?.message || "Données invalides";
        setErrorMessage(errorMsg);
      } else if (err.response?.status === 422) {
        // Erreur de validation Pydantic
        setErrorMessage("Données invalides. Veuillez vérifier les champs.");
      } else {
        setErrorMessage(err.message || "Une erreur s'est produite. Veuillez réessayer.");
      }

      if (onError) {
        onError(err.response?.data?.detail || err.message || "Une erreur s'est produite");
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
            label="Nom d'utilisateur"
            type="text"
            placeholder="Choisissez un nom d'utilisateur"
            autoComplete="username"
            autoFocus
            registerReturn={register("username", {
              required: "Le nom d'utilisateur est requis",
              minLength: {
                value: 3,
                message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
              },
              pattern: {
                value: /^[a-zA-Z0-9_]+$/,
                message: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres et _",
              },
            })}
            errorText={errors.username?.message}
          />

          {/* Email */}
          <FormTextField
            label="Email"
            type="email"
            placeholder="votre@email.com"
            autoComplete="email"
            registerReturn={register("email", {
              required: "L'email est requis",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Adresse email invalide",
              },
            })}
            errorText={errors.email?.message}
          />

          {/* Mot de passe */}
          <FormTextField
            label="Mot de passe"
            type="password"
            placeholder="Créez un mot de passe"
            autoComplete="new-password"
            registerReturn={register("password", {
              required: "Le mot de passe est requis",
              minLength: {
                value: 8,
                message: "Le mot de passe doit contenir au moins 8 caractères",
              },
            })}
            errorText={errors.password?.message}
          />

          {/* Confirmation mot de passe */}
          <FormTextField
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Confirmez votre mot de passe"
            autoComplete="new-password"
            registerReturn={register("confirmPassword", {
              required: "Veuillez confirmer votre mot de passe",
              validate: (value) =>
                value === password || "Les mots de passe ne correspondent pas",
            })}
            errorText={errors.confirmPassword?.message}
          />

          {/* Bouton d'inscription */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            style={{ marginTop: 16 }}
          >
            Créer mon compte
          </Button>
        </AuthForm>

        {/* Footer - Lien vers connexion */}
        {showLoginLink && (
          <AuthFooter>
            Déjà un compte ?{" "}
            <Link component={RouterLink} to="/login">
              Se connecter
            </Link>
          </AuthFooter>
        )}
      </AuthCard>

      {/* Lien retour accueil */}
      {showBackLink && (
        <Link 
          component={RouterLink} 
          to="/"
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 0.5,
            marginTop: 2,
            color: 'text.secondary',
            textDecoration: 'none',
            '&:hover': { textDecoration: 'underline' }
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Retour à l'accueil
        </Link>
      )}

      {/* Modal de vérification d'email */}
      <EmailVerificationModal
        email={registeredEmail}
        open={showVerificationModal}
        redirectTo={redirectAfterVerification}
      />

      {/* Backdrop de chargement */}
      <ProgressBackdrop open={isLoading} />
    </AuthContainer>
  );
};

export default SignupForm;
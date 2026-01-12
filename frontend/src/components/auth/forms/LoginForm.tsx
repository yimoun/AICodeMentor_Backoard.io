import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Composants réutilisables
import FormTextField from '../../controls/FormTextField';
import ProgressBackdrop from '../../controls/ProgressBackdrop';
import { Button } from '../../layout/Button';

// Styles
import {
  AuthContainer,
  AuthCard,
  AuthHeader,
  AuthBrandIcon,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  ForgotLink,
  AuthFooter,
  AuthErrorMessage,
} from '../../../styles/AuthStyles';

/**
 * Types pour le formulaire
 */
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormProps {
  /** Callback après connexion réussie */
  onSuccess?: (data: LoginFormData) => void;
  /** Callback en cas d'erreur */
  onError?: (error: string) => void;
  /** URL de redirection après succès */
  redirectTo?: string;
  /** Titre personnalisé */
  title?: string;
  /** Sous-titre personnalisé */
  subtitle?: string;
  /** Icône du brand (emoji) */
  brandIcon?: string;
  /** Afficher le lien "Mot de passe oublié" */
  showForgotPassword?: boolean;
  /** Afficher le lien vers inscription */
  showSignupLink?: boolean;
  /** Afficher le lien de retour */
  showBackLink?: boolean;
}

/**
 * Formulaire de connexion
 */
const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  onError,
  redirectTo = '/dashboard',
  title = 'Bon retour !',
  subtitle = 'Continuez votre apprentissage',
  brandIcon = '🎓',
  showForgotPassword = true,
  showSignupLink = true,
  showBackLink = true,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Soumission du formulaire
   */
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // TODO: Appel API de connexion
      // const response = await authService.login(data);
      
      // Simulation d'appel API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Succès
      if (onSuccess) {
        onSuccess(data);
      } else {
        navigate(redirectTo);
      }
    } catch (error) {
      const message = error instanceof Error 
        ? error.message 
        : 'Une erreur est survenue. Veuillez réessayer.';
      
      setErrorMessage(message);
      
      if (onError) {
        onError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Navigation vers la page mot de passe oublié
   */
  const handleForgotPassword = () => {
    navigate('/forgot-password');
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
        {errorMessage && (
          <AuthErrorMessage>{errorMessage}</AuthErrorMessage>
        )}

        {/* Formulaire */}
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <FormTextField
            label="Adresse email"
            type="email"
            placeholder="vous@exemple.com"
            autoComplete="email"
            autoFocus
            registerReturn={register('email', {
              required: 'L\'email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Adresse email invalide',
              },
            })}
            errorText={errors.email?.message}
          />

          {/* Mot de passe */}
          <FormTextField
            label="Mot de passe"
            type="password"
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            registerReturn={register('password', {
              required: 'Le mot de passe est requis',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères',
              },
            })}
            errorText={errors.password?.message}
          />

          {/* Lien mot de passe oublié */}
          {showForgotPassword && (
            <ForgotLink onClick={handleForgotPassword}>
              Mot de passe oublié ?
            </ForgotLink>
          )}

          {/* Bouton de soumission */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            style={{ marginTop: 24 }}
          >
            Se connecter
          </Button>
        </AuthForm>

        {/* Footer - Lien vers inscription */}
        {showSignupLink && (
          <AuthFooter>
            Pas encore de compte ?{' '}
            <Link component={RouterLink} to="/signup">
              S'inscrire gratuitement
            </Link>
          </AuthFooter>
        )}
      </AuthCard>

      {/* Lien retour accueil */}
      {showBackLink && (
        <Link component={RouterLink} to="/" >
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
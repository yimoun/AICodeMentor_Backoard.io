// frontend/src/components/features/auth/SignupForm/SignupForm.tsx

import React, { useState, useMemo } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link, Box } from '@mui/material';
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
  AuthFooter,
  BackLink,
  AuthErrorMessage,
  PasswordStrengthContainer,
  PasswordStrengthBar,
} from '../../../styles/AuthStyles';

/**
 * Types pour le formulaire
 */
interface SignupFormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignupFormProps {
  /** Callback après inscription réussie */
  onSuccess?: (data: SignupFormData) => void;
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
  /** Afficher l'indicateur de force du mot de passe */
  showPasswordStrength?: boolean;
  /** Afficher le lien vers connexion */
  showLoginLink?: boolean;
  /** Afficher le lien de retour */
  showBackLink?: boolean;
}

/**
 * Calcule la force du mot de passe (0-100)
 */
const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Longueur
  if (password.length >= 6) strength += 20;
  if (password.length >= 8) strength += 10;
  if (password.length >= 12) strength += 10;
  
  // Caractères variés
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^a-zA-Z0-9]/.test(password)) strength += 15;
  
  return Math.min(strength, 100);
};

/**
 * Formulaire d'inscription
 */
const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onError,
  redirectTo = '/onboarding',
  title = 'Créez votre compte',
  subtitle = 'Commencez votre apprentissage gratuitement',
  brandIcon = '🎓',
  showPasswordStrength = true,
  showLoginLink = true,
  showBackLink = true,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');
  
  /**
   * Force du mot de passe calculée
   */
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(password || ''),
    [password]
  );

  /**
   * Soumission du formulaire
   */
  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // TODO: Appel API d'inscription
      // const response = await authService.signup(data);
      
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
          <Box>
            <FormTextField
              label="Mot de passe"
              type="password"
              placeholder="Créez un mot de passe sécurisé"
              autoComplete="new-password"
              registerReturn={register('password', {
                required: 'Le mot de passe est requis',
                minLength: {
                  value: 8,
                  message: 'Le mot de passe doit contenir au moins 8 caractères',
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Le mot de passe doit contenir une majuscule, une minuscule et un chiffre',
                },
              })}
              errorText={errors.password?.message}
            />
            
            {/* Indicateur de force */}
            {showPasswordStrength && password && (
              <PasswordStrengthContainer>
                <PasswordStrengthBar strength={passwordStrength} />
              </PasswordStrengthContainer>
            )}
          </Box>

          {/* Confirmation mot de passe */}
          <FormTextField
            label="Confirmer le mot de passe"
            type="password"
            placeholder="Répétez votre mot de passe"
            autoComplete="new-password"
            registerReturn={register('confirmPassword', {
              required: 'Veuillez confirmer votre mot de passe',
              validate: (value) =>
                value === password || 'Les mots de passe ne correspondent pas',
            })}
            errorText={errors.confirmPassword?.message}
          />

          {/* Prénom */}
          <FormTextField
            label="Prénom"
            type="text"
            placeholder="Votre prénom"
            autoComplete="given-name"
            registerReturn={register('firstName', {
              required: 'Le prénom est requis',
              minLength: {
                value: 2,
                message: 'Le prénom doit contenir au moins 2 caractères',
              },
            })}
            errorText={errors.firstName?.message}
          />

          {/* Nom */}
          <FormTextField
            label="Nom"
            type="text"
            placeholder="Votre nom"
            autoComplete="family-name"
            registerReturn={register('lastName', {
              required: 'Le nom est requis',
              minLength: {
                value: 2,
                message: 'Le nom doit contenir au moins 2 caractères',
              },
            })}
            errorText={errors.lastName?.message}
          />

          {/* Nom d'utilisateur */}
          <FormTextField
            label="Nom d'utilisateur"
            type="text"
            placeholder="Choisissez un nom d'utilisateur"
            autoComplete="username"
            registerReturn={register('username', {
              required: 'Le nom d\'utilisateur est requis',
              minLength: {
                value: 3,
                message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères',
              },
              pattern: {
                value: /^[a-zA-Z0-9_-]+$/,
                message: 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores',
              },
            })}
            errorText={errors.username?.message}
          />

          {/* Bouton de soumission */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
            badge="50 crédits offerts"
            style={{ marginTop: 24 }}
          >
            Créer mon compte
          </Button>
        </AuthForm>

        {/* Footer - Lien vers connexion */}
        {showLoginLink && (
          <AuthFooter>
            Déjà un compte ?{' '}
            <Link component={RouterLink} to="/login">
              Se connecter
            </Link>
          </AuthFooter>
        )}
      </AuthCard>

      {/* Lien retour accueil */}
      {showBackLink && (
        <BackLink    >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Retour à l'accueil
        </BackLink>
      )}

      {/* Backdrop de chargement */}
      <ProgressBackdrop open={isLoading} />
    </AuthContainer>
  );
};

export default SignupForm;
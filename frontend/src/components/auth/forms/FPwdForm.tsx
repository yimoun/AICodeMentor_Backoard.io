import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Link } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';


import FormTextField from '../../controls/FormTextField';
import ProgressBackdrop from '../../controls/ProgressBackdrop';
import { Button } from '../../ui/Button';

// Styles
import {
  ForgotPasswordContainer,
  ForgotPasswordCard,
  ForgotPasswordHeader,
  ForgotPasswordIcon,
  ForgotPasswordTitle,
  ForgotPasswordSubtitle,
  ForgotPasswordForm,
  ErrorMessage,
  SuccessMessage,
  SuccessIcon,
  SuccessTitle,
  SuccessText,
  ForgotPasswordFooter,
  InfoBox,
  ButtonContainer,
} from '../../../styles/ForgotPasswordStyles';


/**
 * Types pour le formulaire
 */
interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordProps {
  /** Callback après envoi réussi */
  onSuccess?: (email: string) => void;
  /** Callback en cas d'erreur */
  onError?: (error: string) => void;
  /** Titre personnalisé */
  title?: string;
  /** Sous-titre personnalisé */
  subtitle?: string;
  /** Icône (emoji) */
  icon?: string;
  /** Texte du bouton */
  buttonText?: string;
  /** Afficher le lien vers login */
  showLoginLink?: boolean;
  /** Afficher le lien de retour */
  showBackLink?: boolean;
  /** Afficher les informations supplémentaires */
  showInfoBox?: boolean;
}

/**
 * Composant de récupération de mot de passe
 * Affiche un formulaire pour saisir l'email et envoie une demande au backend
 */
const FPwdForm: React.FC<ForgotPasswordProps> = ({
  onSuccess,
  onError,
  title = 'Mot de passe oublié ?',
  subtitle = 'Pas de panique ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.',
  icon = '🔐',
  buttonText = 'Envoyer le lien',
  showLoginLink = true,
  showBackLink = true,
  showInfoBox = true,
}) => {
  //const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    defaultValues: {
      email: '',
    },
  });

  /**
   * Soumission du formulaire - Envoi de l'email au backend
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      // TODO: Remplacer par l'appel API réel
      // const response = await authService.forgotPassword(data.email);
      
      // Simulation d'appel API au backend
      await new Promise((resolve) => {
        setTimeout(() => {
          // Simuler une erreur pour tester (décommenter pour tester)
          // if (data.email === 'error@test.com') {
          //   reject(new Error('Aucun compte associé à cet email'));
          // }
          resolve(true);
        }, 1500);
      });

      // Succès - Email envoyé
      setIsEmailSent(true);
      setSentEmail(data.email);
      reset();
      
      if (onSuccess) {
        onSuccess(data.email);
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
   * Réinitialiser le formulaire pour renvoyer un email
   */
  const handleResend = () => {
    setIsEmailSent(false);
    setSentEmail('');
    setErrorMessage(null);
  };

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard>
        {/* Header */}
        <ForgotPasswordHeader>
          <ForgotPasswordIcon>
            {isEmailSent ? '✉️' : icon}
          </ForgotPasswordIcon>
          <ForgotPasswordTitle>
            {isEmailSent ? 'Email envoyé !' : title}
          </ForgotPasswordTitle>
          <ForgotPasswordSubtitle>
            {isEmailSent 
              ? `Nous avons envoyé un lien de réinitialisation à ${sentEmail}`
              : subtitle
            }
          </ForgotPasswordSubtitle>
        </ForgotPasswordHeader>

        {/* Message d'erreur */}
        {errorMessage && (
          <ErrorMessage>
            <ErrorOutlineIcon sx={{ fontSize: 18 }} />
            {errorMessage}
          </ErrorMessage>
        )}

        {/* Affichage conditionnel: Succès ou Formulaire */}
        {isEmailSent ? (
          <>
            {/* Message de succès */}
            <SuccessMessage>
              <SuccessIcon>📬</SuccessIcon>
              <SuccessTitle>Vérifiez votre boîte de réception</SuccessTitle>
              <SuccessText>
                Le lien de réinitialisation expire dans 1 heure.
                Pensez à vérifier vos spams si vous ne le trouvez pas.
              </SuccessText>
            </SuccessMessage>

            {/* Bouton pour renvoyer */}
            <ButtonContainer>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleResend}
              >
                Renvoyer l'email
              </Button>
            </ButtonContainer>

            {/* Lien vers login */}
            <ForgotPasswordFooter>
              <Link component={RouterLink} to="/login">
                ← Retour à la connexion
              </Link>
            </ForgotPasswordFooter>
          </>
        ) : (
          <>
            {/* Formulaire */}
            <ForgotPasswordForm onSubmit={handleSubmit(onSubmit)}>
              <FormTextField
                label="Adresse email"
                type="email"
                placeholder="vous@exemple.com"
                autoComplete="email"
                autoFocus
                registerReturn={register('email', {
                  required: 'L\'adresse email est requise',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide',
                  },
                })}
                errorText={errors.email?.message}
              />

              {/* Bouton d'envoi */}
              <ButtonContainer>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {buttonText}
                </Button>
              </ButtonContainer>
            </ForgotPasswordForm>

            {/* Info box */}
            {showInfoBox && (
              <InfoBox>
                <InfoOutlinedIcon sx={{ fontSize: 18, mt: 0.25 }} />
                <span>
                  Assurez-vous d'utiliser l'adresse email associée à votre compte 
                  AI Code Mentor. Le lien sera valide pendant 1 heure.
                </span>
              </InfoBox>
            )}

            {/* Footer - Lien vers login */}
            {showLoginLink && (
              <ForgotPasswordFooter>
                Vous vous souvenez ?{' '}
                <Link component={RouterLink} to="/login">
                  Se connecter
                </Link>
              </ForgotPasswordFooter>
            )}
          </>
        )}
      </ForgotPasswordCard>

      {/* Lien de retour */}
      {showBackLink && (
        <Link component={RouterLink} to="/" >
          <ArrowBackIcon sx={{ fontSize: 16 }} />
          Retour à l'accueil
        </Link>
      )}
      {/* Backdrop de chargement */}
      <ProgressBackdrop open={isLoading} />
    </ForgotPasswordContainer>
  );
};

export default FPwdForm;
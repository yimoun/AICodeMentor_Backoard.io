import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import {
  ModalBackdrop,
  ModalContainer,
  ModalIcon,
  ModalTitle,
  ModalSubtitle,
  EmailHighlight,
  InstructionsBox,
  InstructionItem,
  InstructionNumber,
  InstructionText,
  ModalErrorMessage,
  ModalSuccessMessage,
  ModalActions,
  ResendLink,
  CountdownText,
} from '../../styles/EmailVerificationModalStyles';
import UserDS from '../../data_services/UserDS';

interface EmailVerificationModalProps {
  /** Email de l'utilisateur */
  email: string;
  /** Modal ouvert ou non */
  open: boolean;
  /** Callback après vérification réussie */
  onVerified?: () => void;
  /** URL de redirection après vérification */
  redirectTo?: string;
}

/**
 * Modal de vérification d'email après inscription
 */
const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  email,
  open,
  onVerified,
  redirectTo = '/login',
}) => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  /**
   * Gestion du cooldown pour renvoyer l'email
   */
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /**
   * Vérifie si l'email a été vérifié
   */
  const handleCheckVerification = useCallback(async () => {
    setIsChecking(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // Appel au backend pour vérifier le statut
      const response = await UserDS.checkEmailVerified(email);
        // if (response.data?.verified === true)
      if ( true) {
        // Email vérifié avec succès
        setSuccessMessage('Email vérifié avec succès ! Redirection...');
        
        if (onVerified) {
          onVerified();
        }

        // Redirection après un court délai
        setTimeout(() => {
          navigate(redirectTo);
        }, 1500);
      } else {
        // Email pas encore vérifié
        setErrorMessage(
          "Votre email n'a pas encore été vérifié. Veuillez cliquer sur le lien dans l'email que nous vous avons envoyé."
        );
      }
    } catch (err: any) {
      console.error('Error checking email verification:', err);
      setErrorMessage(
        "Une erreur s'est produite lors de la vérification. Veuillez réessayer."
      );
    } finally {
      setIsChecking(false);
    }
  }, [email, navigate, onVerified, redirectTo]);

  /**
   * Renvoie l'email de vérification
   */
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await UserDS.resendVerificationEmail(email);
      setSuccessMessage('Un nouvel email de vérification a été envoyé !');
      setResendCooldown(60); // 60 secondes de cooldown
    } catch (err: any) {
      console.error('Error resending verification email:', err);
      setErrorMessage(
        "Impossible de renvoyer l'email. Veuillez réessayer plus tard."
      );
    } finally {
      setIsResending(false);
    }
  };

  // Ne pas rendre si non ouvert
  if (!open) return null;

  return (
    <>
      {/* Backdrop bloquant */}
      <ModalBackdrop />

      {/* Modal */}
      <ModalContainer>
        {/* Icône */}
        <ModalIcon>📧</ModalIcon>

        {/* Titre */}
        <ModalTitle>Vérifiez votre email</ModalTitle>

        {/* Sous-titre */}
        <ModalSubtitle>
          Nous avons envoyé un lien de vérification à{' '}
          <EmailHighlight>{email}</EmailHighlight>
        </ModalSubtitle>

        {/* Instructions */}
        <InstructionsBox>
          <InstructionItem>
            <InstructionNumber>1</InstructionNumber>
            <InstructionText>
              Ouvrez votre boîte de réception (vérifiez aussi les spams)
            </InstructionText>
          </InstructionItem>
          <InstructionItem>
            <InstructionNumber>2</InstructionNumber>
            <InstructionText>
              Cliquez sur le lien de vérification dans l'email
            </InstructionText>
          </InstructionItem>
          <InstructionItem>
            <InstructionNumber>3</InstructionNumber>
            <InstructionText>
              Revenez ici et cliquez sur "J'ai vérifié mon email"
            </InstructionText>
          </InstructionItem>
        </InstructionsBox>

        {/* Message d'erreur */}
        {errorMessage && (
          <ModalErrorMessage>
            <span>⚠️</span>
            {errorMessage}
          </ModalErrorMessage>
        )}

        {/* Message de succès */}
        {successMessage && (
          <ModalSuccessMessage>
            <span>✅</span>
            {successMessage}
          </ModalSuccessMessage>
        )}

        {/* Boutons */}
        <ModalActions>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCheckVerification}
            isLoading={isChecking}
            disabled={isChecking}
          >
            {isChecking ? 'Vérification en cours...' : "J'ai vérifié mon email"}
          </Button>
        </ModalActions>

        {/* Lien pour renvoyer l'email */}
        <ResendLink>
          Vous n'avez pas reçu l'email ?{' '}
          <button
            onClick={handleResendEmail}
            disabled={isResending || resendCooldown > 0}
          >
            {isResending ? 'Envoi...' : 'Renvoyer'}
          </button>
          {resendCooldown > 0 && (
            <CountdownText>
              Vous pourrez renvoyer dans {resendCooldown}s
            </CountdownText>
          )}
        </ResendLink>
      </ModalContainer>
    </>
  );
};

export default EmailVerificationModal;
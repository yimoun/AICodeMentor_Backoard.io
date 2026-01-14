

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import UserDS from '../../data_services/UserDS';
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
  Spinner,
  CountdownText,
} from '../../styles/EmailVerificationModalStyles';

interface EmailVerificationModalProps {
  /** Email à vérifier */
  email: string;
  /** Modal ouvert ou non */
  open: boolean;
  /** Callback quand l'email est vérifié */
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

  // Countdown pour le bouton de renvoi
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  /**
   * Vérifier si l'email est validé
   */
  const handleCheckVerification = useCallback(async () => {
    setIsChecking(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await UserDS.checkEmailVerified(email);
      
      if (response.data.verified) {
        setSuccessMessage("Email vérifié avec succès ! Redirection...");
        
        // Callback
        if (onVerified) {
          onVerified();
        }

        // Redirection après un court délai
        setTimeout(() => {
          navigate(redirectTo, { replace: true });
        }, 1500);
      } else {
        setErrorMessage("Votre email n'est pas encore vérifié. Veuillez cliquer sur le lien dans l'email.");
      }
    } catch (error: any) {
      console.error("Error checking verification:", error);
      setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsChecking(false);
    }
  }, [email, navigate, onVerified, redirectTo]);

  /**
   * Renvoyer l'email de vérification
   */
  const handleResendEmail = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      await UserDS.resendVerificationEmail(email);
      setSuccessMessage("Email de vérification envoyé !");
      setResendCooldown(60); // 60 secondes de cooldown
    } catch (error: any) {
      console.error("Error resending email:", error);
      setErrorMessage("Impossible d'envoyer l'email. Veuillez réessayer.");
    } finally {
      setIsResending(false);
    }
  };

  /**
   * 🧪 POUR LES TESTS: Simuler la vérification d'email
   */
  const handleSimulateVerification = async () => {
    setIsChecking(true);
    setErrorMessage(null);
    
    try {
      // Simuler la vérification côté "backend"
      await UserDS.verifyEmail(email);
      setSuccessMessage("✅ Email vérifié (simulation) ! Redirection...");
      
      if (onVerified) {
        onVerified();
      }

      setTimeout(() => {
        navigate(redirectTo, { replace: true });
      }, 1500);
    } catch (error: any) {
      setErrorMessage("Erreur lors de la simulation");
    } finally {
      setIsChecking(false);
    }
  };

  if (!open) return null;

  return (
    <ModalBackdrop>
      <ModalContainer>
        {/* Icône animée */}
        <ModalIcon>📧</ModalIcon>

        {/* Titre */}
        <ModalTitle>Vérifiez votre email</ModalTitle>

        {/* Sous-titre avec email */}
        <ModalSubtitle>
          Nous avons envoyé un lien de vérification à{' '}
          <EmailHighlight>{email}</EmailHighlight>
        </ModalSubtitle>

        {/* Instructions */}
        <InstructionsBox>
          <InstructionItem>
            <InstructionNumber>1</InstructionNumber>
            <InstructionText>Ouvrez votre boîte email</InstructionText>
          </InstructionItem>
          <InstructionItem>
            <InstructionNumber>2</InstructionNumber>
            <InstructionText>Cliquez sur le lien de vérification</InstructionText>
          </InstructionItem>
          <InstructionItem>
            <InstructionNumber>3</InstructionNumber>
            <InstructionText>Revenez ici et cliquez sur "J'ai vérifié"</InstructionText>
          </InstructionItem>
        </InstructionsBox>

        {/* Messages d'erreur / succès */}
        {errorMessage && <ModalErrorMessage>{errorMessage}</ModalErrorMessage>}
        {successMessage && <ModalSuccessMessage>{successMessage}</ModalSuccessMessage>}

        {/* Actions */}
        <ModalActions>
          {/* Bouton principal */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleCheckVerification}
            disabled={isChecking}
            isLoading={isChecking}
          >
            {isChecking ? 'Vérification...' : "J'ai vérifié mon email"}
          </Button>

          {/* 🧪 Bouton de test pour simuler la vérification */}
          <Button
            variant="outline"
            size="md"
            fullWidth
            onClick={handleSimulateVerification}
            disabled={isChecking}
            style={{ 
              backgroundColor: '#FFF3CD', 
              borderColor: '#FFC107',
              color: '#856404',
            }}
          >
            🧪 Simuler la vérification (TEST)
          </Button>

          {/* Lien pour renvoyer l'email */}
          {resendCooldown > 0 ? (
            <CountdownText>
              Renvoyer dans {resendCooldown}s
            </CountdownText>
          ) : (
            <ResendLink 
              onClick={isResending ? undefined : handleResendEmail}
              style={{ opacity: isResending ? 0.5 : 1, cursor: isResending ? 'not-allowed' : 'pointer' }}
            >
              {isResending ? (
                <>
                  <Spinner /> Envoi en cours...
                </>
              ) : (
                "Renvoyer l'email de vérification"
              )}
            </ResendLink>
          )}
        </ModalActions>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default EmailVerificationModal;
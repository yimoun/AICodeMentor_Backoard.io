// Input avec sugestions// 

import React, { useState, useRef, useEffect } from 'react';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { Button } from '../../ui/Button';
import {
  ChatInputContainer,
  InputContext,
  TypingIndicator,
  TypingDot,
  InputWrapper,
  InputActionButton,
  ChatTextArea,
  InputInfo,
  CostEstimate,
  InputSuggestions,
  SuggestionChip,
  SendButtonContainer,
} from '../../../styles/chat/ChatInputStyles';

interface ChatInputProps {
  /** Placeholder du textarea */
  placeholder?: string;
  /** Indique si le bot est en train de répondre */
  isTyping?: boolean;
  /** Texte affiché pendant le typing */
  typingText?: string;
  /** Estimation du coût en crédits */
  estimatedCost?: number;
  /** Suggestions de questions */
  suggestions?: string[];
  /** Callback à l'envoi du message */
  onSend: (message: string) => void;
  /** Callback pour joindre un fichier */
  onAttach?: () => void;
  /** Callback au clic sur une suggestion */
  onSuggestionClick?: (suggestion: string) => void;
  /** Désactiver l'input */
  disabled?: boolean;
}

/**
 * Composant d'input pour le chat
 */
const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = 'Posez votre question...',
  isTyping = false,
  typingText = 'Claude réfléchit...',
  estimatedCost = 3,
  suggestions = [],
  onSend,
  onAttach,
  onSuggestionClick,
  disabled = false,
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * Auto-resize du textarea
   */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  /**
   * Gère l'envoi du message
   */
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled && !isTyping) {
      onSend(trimmedMessage);
      setMessage('');
    }
  };

  /**
   * Gère les raccourcis clavier
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /**
   * Gère le clic sur une suggestion
   */
  const handleSuggestionClick = (suggestion: string) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      setMessage(suggestion);
      textareaRef.current?.focus();
    }
  };

  return (
    <ChatInputContainer>
      {/* Indicateur de typing */}
      <InputContext>
        {isTyping && (
          <TypingIndicator>
            <TypingDot delay={0} />
            <TypingDot delay={0.2} />
            <TypingDot delay={0.4} />
            {typingText}
          </TypingIndicator>
        )}
      </InputContext>

      {/* Input wrapper */}
      <InputWrapper>
        {/* Bouton joindre */}
        {onAttach && (
          <InputActionButton
            onClick={onAttach}
            disabled={disabled}
            title="Joindre du code"
          >
            <AttachFileIcon />
          </InputActionButton>
        )}

        {/* Textarea */}
        <ChatTextArea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          disabled={disabled || isTyping}
        />

        {/* Estimation du coût */}
        <InputInfo>
          <CostEstimate>~{estimatedCost} crédits</CostEstimate>
        </InputInfo>

        {/* Bouton envoyer */}
        <SendButtonContainer>
          <Button
            variant="primary"
            onClick={handleSend}
            disabled={!message.trim() || disabled || isTyping}
          >
            Envoyer
          </Button>
        </SendButtonContainer>
      </InputWrapper>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <InputSuggestions>
          {suggestions.map((suggestion, index) => (
            <SuggestionChip
              key={index}
              label={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              size="small"
            />
          ))}
        </InputSuggestions>
      )}
    </ChatInputContainer>
  );
};

export default ChatInput;
// Zone principale de chat

import React, { useRef, useEffect } from 'react';
import { Button } from '../../layout/Button';
import Message, { type LlmType, type CodeBlockData } from './Messages';
import ChatInput from './ChatInput';
import {
  ChatMainContainer,
  ChatHeaderBar,
  ChatContext,
  ContextSkill,
  ContextSeparator,
  ContextTopic,
  ChatActions,
  MessagesContainer,
} from '../../../styles/chat/ChatMainStyles';

/**
 * Type pour un message
 */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: React.ReactNode;
  time: string;
  llm?: LlmType;
  cost?: number;
  codeBlocks?: CodeBlockData[];
}

/**
 * Type pour le contexte du chat
 */
export interface ChatContextData {
  skill: string;
  skillIcon?: string;
  topic: string;
}

interface ChatMainProps {
  /** Contexte actuel (skill + topic) */
  context?: ChatContextData;
  /** Liste des messages */
  messages: ChatMessage[];
  /** Indique si le bot répond */
  isTyping?: boolean;
  /** Suggestions de questions */
  suggestions?: string[];
  /** Estimation du coût */
  estimatedCost?: number;
  /** Callback à l'envoi d'un message */
  onSendMessage: (message: string) => void;
  /** Callback pour voir l'historique */
  onShowHistory?: () => void;
  /** Callback pour nouveau chat */
  onNewChat?: () => void;
  /** Callback pour joindre un fichier */
  onAttachFile?: () => void;
}

/**
 * Zone principale du chat
 */
const ChatMain: React.FC<ChatMainProps> = ({
  context,
  messages,
  isTyping = false,
  suggestions = ['Explique avec un exemple', 'Montre-moi le code', 'Compare avec JavaScript'],
  estimatedCost = 3,
  onSendMessage,
  onShowHistory,
  onNewChat,
  onAttachFile,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Scroll automatique vers le dernier message
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ChatMainContainer>
      {/* Header bar */}
      <ChatHeaderBar>
        {context && (
          <ChatContext>
            <ContextSkill>
              {context.skillIcon} {context.skill}
            </ContextSkill>
            <ContextSeparator>→</ContextSeparator>
            <ContextTopic>{context.topic}</ContextTopic>
          </ChatContext>
        )}

        <ChatActions>
          {onShowHistory && (
            <Button variant="ghost" size="sm" onClick={onShowHistory}>
              📋 Historique
            </Button>
          )}
          {onNewChat && (
            <Button variant="ghost" size="sm" onClick={onNewChat}>
              🔄 Nouveau chat
            </Button>
          )}
        </ChatActions>
      </ChatHeaderBar>

      {/* Container des messages */}
      <MessagesContainer>
        {messages.map((message) => (
          <Message
            key={message.id}
            sender={message.sender}
            content={message.content}
            time={message.time}
            llm={message.llm}
            cost={message.cost}
            codeBlocks={message.codeBlocks}
          />
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>

      {/* Input */}
      <ChatInput
        isTyping={isTyping}
        suggestions={suggestions}
        estimatedCost={estimatedCost}
        onSend={onSendMessage}
        onAttach={onAttachFile}
      />
    </ChatMainContainer>
  );
};

export default ChatMain;
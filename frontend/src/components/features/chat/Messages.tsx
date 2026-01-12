// Message individuel dans le chat (utilisateur ou bot)

import React from 'react';
import CodeBlock from '../chat/CodeBlock';
import {
  MessageContainer,
  MessageHeader,
  LlmIndicator,
  MessageTime,
  MessageContent,
  MessageCost,
} from '../../../styles/chat/ChatMessagesStyles';

/**
 * Type pour un bloc de code dans le message
 */
export interface CodeBlockData {
  code: string;
  language?: string;
}

/**
 * Type LLM disponibles
 */
export type LlmType = 'claude' | 'gpt' | 'mistral' | 'gemini';

interface MessageProps {
  /** Expéditeur du message */
  sender: 'user' | 'assistant';
  /** Contenu HTML ou texte du message */
  content: React.ReactNode;
  /** Heure du message */
  time?: string;
  /** LLM utilisé (pour les messages assistant) */
  llm?: LlmType;
  /** Nom affiché du LLM */
  llmName?: string;
  /** Coût en crédits */
  cost?: number;
  /** Blocs de code dans le message */
  codeBlocks?: CodeBlockData[];
}

/**
 * Formate le nom du LLM
 */
const getLlmDisplayName = (llm: LlmType): string => {
  const names: Record<LlmType, string> = {
    claude: 'Claude',
    gpt: 'GPT-4',
    mistral: 'Mistral',
    gemini: 'Gemini',
  };
  return names[llm];
};

/**
 * Composant Message - Affiche un message dans le chat
 */
const Message: React.FC<MessageProps> = ({
  sender,
  content,
  time,
  llm = 'claude',
  llmName,
  cost,
  codeBlocks,
}) => {
  const displayLlmName = llmName || getLlmDisplayName(llm);

  return (
    <MessageContainer sender={sender}>
      {/* Header (seulement pour assistant) */}
      {sender === 'assistant' && (
        <MessageHeader>
          <LlmIndicator llm={llm} label={displayLlmName} size="small" />
          {time && <MessageTime>{time}</MessageTime>}
        </MessageHeader>
      )}

      {/* Contenu du message */}
      <MessageContent sender={sender}>
        {content}
        
        {/* Blocs de code */}
        {codeBlocks?.map((block, index) => (
          <CodeBlock
            key={index}
            code={block.code}
            language={block.language}
          />
        ))}
      </MessageContent>

      {/* Heure pour les messages user */}
      {sender === 'user' && time && (
        <MessageTime sx={{ textAlign: 'right', mt: 0.5 }}>
          {time}
        </MessageTime>
      )}

      {/* Coût en crédits */}
      {cost !== undefined && cost > 0 && (
        <MessageCost>-{cost} crédit{cost > 1 ? 's' : ''}</MessageCost>
      )}
    </MessageContainer>
  );
};

export default Message;
import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatMain, { type ChatMessage, type ChatContextData } from '../features/chat/ChatMain.tsx';
import { useAppContext } from '../layouts/AppLayout';

/**
 * Messages par défaut (exemple)
 */
const defaultMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'assistant',
    content: (
      <>
        <p>Salut Jordan ! 👋</p>
        <p>
          Je vois que tu as eu quelques difficultés avec <strong>async/await</strong> lors du test.
          C'est normal, c'est un concept qui demande de la pratique.
        </p>
        <p>
          Je me souviens aussi que tu as bien compris les <strong>closures en JavaScript</strong> la
          semaine dernière - ça va nous aider car les concepts sont liés !
        </p>
        <p>Par où veux-tu commencer ?</p>
      </>
    ),
    time: '14:32',
    llm: 'claude',
    cost: 3,
  },
  {
    id: '2',
    sender: 'user',
    content: (
      <p>Je voudrais comprendre la différence entre asyncio.gather et asyncio.wait en Python</p>
    ),
    time: '14:33',
  },
  {
    id: '3',
    sender: 'assistant',
    content: (
      <>
        <p>Excellente question ! Voici la différence principale :</p>
        <p><strong>En résumé :</strong></p>
        <ul>
          <li><code>gather</code> = simple, attend tout, résultats ordonnés</li>
          <li><code>wait</code> = contrôle fin (timeout, first_completed, etc.)</li>
        </ul>
        <p>Tu veux qu'on fasse un exercice pratique ensemble ? 🎯</p>
      </>
    ),
    time: '14:33',
    llm: 'claude',
    cost: 3,
    codeBlocks: [
      {
        language: 'Python - asyncio.gather',
        code: `# gather: attend TOUTES les tâches, retourne les résultats dans l'ordre
results = await asyncio.gather(
    fetch_user(1),
    fetch_user(2),
    fetch_user(3)
)
# results = [user1, user2, user3] (ordre préservé)`,
      },
      {
        language: 'Python - asyncio.wait',
        code: `# wait: plus flexible, retourne done/pending
done, pending = await asyncio.wait(
    [fetch_user(1), fetch_user(2)],
    return_when=asyncio.FIRST_COMPLETED
)
# Peut continuer avant que toutes les tâches finissent`,
      },
    ],
  },
];

/**
 * Contexte par défaut
 */
const defaultContext: ChatContextData = {
  skill: 'Python',
  skillIcon: '🐍',
  topic: 'Programmation asynchrone',
};

/**
 * Contenu de la page Chat (sans sidebar)
 */
const ChatContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { updateCredits } = useAppContext();
  
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [context] = useState<ChatContextData>(defaultContext);

  // Récupérer le skill depuis l'URL si présent
  const skillFromUrl = searchParams.get('skill');

  /**
   * Envoie un nouveau message
   */
  const handleSendMessage = async (content: string) => {
    // Ajouter le message utilisateur
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: <p>{content}</p>,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Simuler la réponse du bot
    setIsTyping(true);
    
    // TODO: Appeler l'API pour obtenir la réponse
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: <p>Je traite votre question sur "{content}". Voici ma réponse...</p>,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        llm: 'claude',
        cost: 3,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // // Déduire les crédits
      // updateCredits((prev: number) => prev - 3);
    }, 2000);
  };

  /**
   * Affiche l'historique
   */
  const handleShowHistory = () => {
    // TODO: Ouvrir le drawer d'historique
    console.log('Show history');
  };

  /**
   * Nouveau chat
   */
  const handleNewChat = () => {
    setMessages([]);
  };

  return (
    <ChatMain
      context={context}
      messages={messages}
      isTyping={isTyping}
      onSendMessage={handleSendMessage}
      onShowHistory={handleShowHistory}
      onNewChat={handleNewChat}
    />
  );
};

export default ChatContent;
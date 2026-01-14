import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useUser from '../hooks/useUser';
import { useAppContext } from '../layouts/AppLayout';
import ChatMain, { type ChatMessage, type ChatContextData } from '../features/chat/ChatMain.tsx';

/**
 * Messages par défaut (exemple)
 */
const defaultMessages: ChatMessage[] = [
  {
    id: '1',
    sender: 'assistant',
    content: (
      <>
        <p>Salut ! 👋</p>
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
 * Contenu de la page Chat avec contextes
 */
const ChatContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Contextes
  const { user } = useUser();
  const { credits, deductCredits, sidebarSkills } = useAppContext();
  
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [isTyping, setIsTyping] = useState(false);

  // Récupérer le skill depuis l'URL si présent
  const skillFromUrl = searchParams.get('skill');

  /**
   * Contexte du chat basé sur l'URL ou le premier skill
   */
  const context = useMemo<ChatContextData>(() => {
    if (skillFromUrl && sidebarSkills.length > 0) {
      const skill = sidebarSkills.find((s) => s.id === skillFromUrl);
      if (skill) {
        return {
          skill: skill.name,
          skillIcon: skill.icon,
          topic: 'Session d\'apprentissage',
        };
      }
    }

    // Contexte par défaut
    return {
      skill: 'Python',
      skillIcon: '🐍',
      topic: 'Programmation asynchrone',
    };
  }, [skillFromUrl, sidebarSkills]);

  /**
   * Messages personnalisés avec le nom de l'utilisateur
   */
  const personalizedMessages = useMemo<ChatMessage[]>(() => {
    if (messages.length === 0) return [];
    
    // Remplacer le premier message avec le prénom de l'utilisateur
    const firstName = user?.first_name || 'Apprenant';
    const firstMessage = messages[0];
    
    if (firstMessage.sender === 'assistant') {
      return [
        {
          ...firstMessage,
          content: (
            <>
              <p>Salut {firstName} ! 👋</p>
              <p>
                Je vois que tu as eu quelques difficultés avec <strong>async/await</strong> lors du test.
                C'est normal, c'est un concept qui demande de la pratique.
              </p>
              <p>Par où veux-tu commencer ?</p>
            </>
          ),
        },
        ...messages.slice(1),
      ];
    }
    
    return messages;
  }, [messages, user?.first_name]);

  /**
   * Envoie un nouveau message
   */
  const handleSendMessage = async (content: string) => {
    // Vérifier les crédits disponibles
    if (credits.current < 3) {
      // TODO: Afficher un message d'erreur ou modal d'achat
      console.warn('Crédits insuffisants');
      return;
    }

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
    
    //TODO:Backboard AI integration

    // TODO: Appeler l'API pour obtenir la réponse
    setTimeout(() => {
      const cost = 3; // Coût de la réponse
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        content: <p>Je traite votre question sur "{content}". Voici ma réponse...</p>,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        llm: 'claude',
        cost,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
      
      // ✅ Déduire les crédits via le contexte
      deductCredits(cost);
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
      messages={personalizedMessages}
      isTyping={isTyping}
      onSendMessage={handleSendMessage}
      onShowHistory={handleShowHistory}
      onNewChat={handleNewChat}
    />
  );
};

export default ChatContent;
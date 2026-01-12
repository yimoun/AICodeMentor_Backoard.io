import React, { useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
//import ChatSidebar, { UserData, CreditsData, NavItemData } from '../components/features/chat/ChatSidebar.tsx';
import ChatMain, { type ChatMessage, type ChatContextData } from '../components/features/chat/ChatMain.tsx';
//import { SkillProgressData } from '@/components/features/chat/SkillsProgress/SkillsProgress';
import { ChatLayoutContainer } from '../styles/chat/ChatLayoutStyles';
import ChatSidebar, { type CreditsData, type UserData } from '../components/features/chat/ChatSidebar.tsx';
import DashboardPage from './DashboardPage.tsx';

/**
 * Interface pour SkillProgressData
 */
interface SkillProgressData {
  id: string;
  name: string;
  icon: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Expert';
  progress: number;
}

/**
 * Données utilisateur par défaut (à remplacer par les vraies données)
 */
const defaultUser: UserData = {
  name: 'Jordan T.',
  initials: 'JT',
  plan: 'Plan Pro',
};

/**
 * Crédits par défaut
 */
const defaultCredits: CreditsData = {
  current: 1847,
  total: 2000,
};

/**
 * Skills par défaut
 */
const defaultSkills: SkillProgressData[] = [
  { id: 'python', name: 'Python', icon: '🐍', level: 'Intermédiaire', progress: 65 },
  { id: 'fastapi', name: 'FastAPI', icon: '⚡', level: 'Débutant', progress: 25 },
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘', level: 'Intermédiaire', progress: 55 },
];

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
 * Page principale du Chat
 */
const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [isTyping, setIsTyping] = useState(false);

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
    // TODO: Réinitialiser le contexte
  };

  /**
   * Acheter des crédits
   */
  const handleBuyCredits = () => {
    navigate('/pricing');
  };

  /**
   * Clic sur un skill
   */
  const handleSkillClick = (skillId: string) => {
    // TODO: Changer le contexte du chat
    console.log('Skill clicked:', skillId);
  };

  return (
    <ChatLayoutContainer>
      {/* Sidebar */}
     <ChatSidebar
        user={defaultUser}
        credits={defaultCredits}
        skills={defaultSkills}
        streakCount={7}
        onBuyCredits={handleBuyCredits}
        onSkillClick={handleSkillClick}
      /> 

    
      {/* Zone principale qui varie selon le ChatMain/DashboardPage/SkillsPage/BadgesPages/SettingsPage */}
      {/* <ChatMain
        context={defaultContext}
        messages={messages}
        isTyping={isTyping}
        onSendMessage={handleSendMessage}
        onShowHistory={handleShowHistory}
        onNewChat={handleNewChat}
      /> */}

      <DashboardPage />

    </ChatLayoutContainer>
  );
};

export default ChatPage;
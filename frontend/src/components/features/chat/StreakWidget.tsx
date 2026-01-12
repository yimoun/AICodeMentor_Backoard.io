// Widget streak utilisateur dans le chat (jours consécutifs d'utilisation 🔥)

import React from 'react';
import {
  StreakWidgetContainer,
  StreakIcon,
  StreakCount,
  StreakLabel,
} from '../../../styles/chat/StreakWidgetStyles';

interface StreakWidgetProps {
  /** Nombre de jours consécutifs */
  count: number;
  /** Icône (emoji) */
  icon?: string;
  /** Label (ex: "jours consécutifs") */
  label?: string;
}

/**
 * Widget affichant le streak de l'utilisateur
 */
const StreakWidget: React.FC<StreakWidgetProps> = ({
  count,
  icon = '🔥',
  label = 'jours consécutifs',
}) => {
  return (
    <StreakWidgetContainer>
      <StreakIcon>{icon}</StreakIcon>
      <StreakCount>{count}</StreakCount>
      <StreakLabel>{label}</StreakLabel>
    </StreakWidgetContainer>
  );
};

export default StreakWidget;
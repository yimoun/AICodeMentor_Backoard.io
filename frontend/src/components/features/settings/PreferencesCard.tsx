
import React from 'react';
import {
  SettingsCard,
  CardTitle,
  PreferencesList,
  PreferenceItem,
  PreferenceInfo,
  PreferenceName,
  PreferenceDesc,
  PreferenceToggle,
} from '../../../styles/settings/SettingsStyles';

/**
 * Type pour une préférence
 */
export interface PreferenceData {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

interface PreferencesCardProps {
  /** Titre de la card */
  title?: string;
  /** Icône du titre */
  titleIcon?: string;
  /** Liste des préférences */
  preferences: PreferenceData[];
  /** Callback au changement d'une préférence */
  onPreferenceChange: (preferenceId: string, enabled: boolean) => void;
}

/**
 * Card des préférences utilisateur
 */
const PreferencesCard: React.FC<PreferencesCardProps> = ({
  title = 'Préférences',
  titleIcon = '🔔',
  preferences,
  onPreferenceChange,
}) => {
  const handleToggle = (prefId: string, currentValue: boolean) => {
    onPreferenceChange(prefId, !currentValue);
  };

  return (
    <SettingsCard>
      <CardTitle>
        {titleIcon} {title}
      </CardTitle>

      <PreferencesList>
        {preferences.map((pref) => (
          <PreferenceItem
            key={pref.id}
            onClick={() => handleToggle(pref.id, pref.enabled)}
          >
            <PreferenceInfo>
              <PreferenceName>{pref.name}</PreferenceName>
              <PreferenceDesc>{pref.description}</PreferenceDesc>
            </PreferenceInfo>
            
            <PreferenceToggle
              checked={pref.enabled}
              onChange={() => handleToggle(pref.id, pref.enabled)}
              onClick={(e) => e.stopPropagation()}
            />
          </PreferenceItem>
        ))}
      </PreferencesList>
    </SettingsCard>
  );
};

export default PreferencesCard;
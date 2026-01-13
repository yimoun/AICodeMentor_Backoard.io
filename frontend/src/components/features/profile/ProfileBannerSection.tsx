

import React from 'react';
import { Button } from '../../ui/Button';
import {
  ProfileBanner,
  BannerGradient,
  ProfileHeaderContent,
  ProfileAvatarLarge,
  AvatarBadge,
  ProfileIdentity,
  ProfileName,
  ProfileTagline,
  ProfileStatsInline,
  ProfileStat,
  ProfileShareActions,
} from '../../../styles/profile/PublicProfileStyles';

/**
 * Stat inline du profil
 */
export interface ProfileStatData {
  icon: string;
  label: string;
}

interface ProfileBannerSectionProps {
  /** Initiales de l'utilisateur */
  initials: string;
  /** Badge de l'avatar (emoji) */
  avatarBadge?: string;
  /** Nom de l'utilisateur */
  name: string;
  /** Tagline / description */
  tagline: string;
  /** Stats inline */
  stats: ProfileStatData[];
  /** Callback copier le lien */
  onCopyLink?: () => void;
  /** Callback partager sur LinkedIn */
  onShareLinkedIn?: () => void;
}

/**
 * Icône LinkedIn
 */
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" style={{ marginRight: 4 }}>
    <path
      fill="currentColor"
      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
    />
  </svg>
);

/**
 * Section bannière du profil public
 */
const ProfileBannerSection: React.FC<ProfileBannerSectionProps> = ({
  initials,
  avatarBadge = '🏆',
  name,
  tagline,
  stats,
  onCopyLink,
  onShareLinkedIn,
}) => {
  return (
    <ProfileBanner>
      <BannerGradient />
      <ProfileHeaderContent>
        {/* Avatar */}
        <ProfileAvatarLarge>
          {initials}
          <AvatarBadge>{avatarBadge}</AvatarBadge>
        </ProfileAvatarLarge>

        {/* Identité */}
        <ProfileIdentity>
          <ProfileName>{name}</ProfileName>
          <ProfileTagline>{tagline}</ProfileTagline>
          <ProfileStatsInline>
            {stats.map((stat, index) => (
              <ProfileStat key={index}>
                {stat.icon} {stat.label}
              </ProfileStat>
            ))}
          </ProfileStatsInline>
        </ProfileIdentity>

        {/* Actions de partage */}
        <ProfileShareActions>
          {onCopyLink && (
            <Button
              variant="outline"
              onClick={onCopyLink}
              style={{ 
                backgroundColor: 'white', 
                color: '#333',
                borderColor: 'white' 
              }}
            >
              🔗 Copier le lien
            </Button>
          )}
          {onShareLinkedIn && (
            <Button
              variant="primary"
              onClick={onShareLinkedIn}
              style={{ 
                backgroundColor: '#0A66C2', 
                borderColor: '#0A66C2' 
              }}
            >
              <LinkedInIcon />
              Partager sur LinkedIn
            </Button>
          )}
        </ProfileShareActions>
      </ProfileHeaderContent>
    </ProfileBanner>
  );
};

export default ProfileBannerSection;
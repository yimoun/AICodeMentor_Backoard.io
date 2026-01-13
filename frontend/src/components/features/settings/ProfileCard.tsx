import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../ui/Button';
import FormTextField from '../../controls/FormTextField';
import {
  SettingsCard,
  CardTitle,
  ProfileForm,
  FormRow,
  FormButtonContainer,
} from '../../../styles/settings/SettingsStyles';
/**
 * Données du profil
 */
export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileCardProps {
  /** Titre de la card */
  title?: string;
  /** Icône du titre */
  titleIcon?: string;
  /** Données initiales */
  initialData: ProfileData;
  /** Callback à la sauvegarde */
  onSave: (data: ProfileData) => void;
  /** État de chargement */
  isLoading?: boolean;
}

/**
 * Card de profil utilisateur
 */
const ProfileCard: React.FC<ProfileCardProps> = ({
  title = 'Profil',
  titleIcon = '👤',
  initialData,
  onSave,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileData>({
    defaultValues: initialData,
  });

  const onSubmit = (data: ProfileData) => {
    onSave(data);
  };

  return (
    <SettingsCard>
      <CardTitle>
        {titleIcon} {title}
      </CardTitle>

      <ProfileForm onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <FormTextField
            label="Prénom"
            registerReturn={register('firstName', {
              required: 'Le prénom est requis',
            })}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <FormTextField
            label="Nom"
            registerReturn={register('lastName', {
              required: 'Le nom est requis',
            })}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
        </FormRow>

        <FormTextField
          label="Email"
          type="email"
          registerReturn={register('email', {
            required: "L'email est requis",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email invalide',
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <FormButtonContainer>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!isDirty}
          >
            Sauvegarder
          </Button>
        </FormButtonContainer>
      </ProfileForm>
    </SettingsCard>
  );
};

export default ProfileCard;
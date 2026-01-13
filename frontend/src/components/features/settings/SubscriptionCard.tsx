// Card d'abonnement
import React from 'react';
import { Button } from '../../ui/Button';
import {
  SettingsCard,
  CardTitle,
  SubscriptionHeader,
  PlanBadge,
  SubscriptionDetails,
  DetailRow,
  DetailLabel,
  DetailValue,
  SubscriptionActions,
} from '../../../styles/settings/SettingsStyles';

/**
 * Type de plan
 */
export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise';

/**
 * Détail de l'abonnement
 */
export interface SubscriptionDetail {
  label: string;
  value: string;
}

interface SubscriptionCardProps {
  /** Titre de la card */
  title?: string;
  /** Icône du titre */
  titleIcon?: string;
  /** Plan actuel */
  plan: PlanType;
  /** Label du plan affiché */
  planLabel: string;
  /** Détails de l'abonnement */
  details: SubscriptionDetail[];
  /** Callback pour changer de plan */
  onChangePlan?: () => void;
  /** Callback pour gérer le paiement */
  onManagePayment?: () => void;
}

/**
 * Card d'abonnement
 */
const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title = 'Abonnement',
  titleIcon = '💳',
  plan,
  planLabel,
  details,
  onChangePlan,
  onManagePayment,
}) => {
  return (
    <SettingsCard>
      <SubscriptionHeader>
        <CardTitle sx={{ mb: 0 }}>
          {titleIcon} {title}
        </CardTitle>
        <PlanBadge plan={plan} label={planLabel} size="small" />
      </SubscriptionHeader>

      <SubscriptionDetails>
        {details.map((detail, index) => (
          <DetailRow key={index}>
            <DetailLabel>{detail.label}</DetailLabel>
            <DetailValue>{detail.value}</DetailValue>
          </DetailRow>
        ))}
      </SubscriptionDetails>

      <SubscriptionActions>
        {onChangePlan && (
          <Button variant="outline" onClick={onChangePlan}>
            Changer de plan
          </Button>
        )}
        {onManagePayment && (
          <Button variant="ghost" onClick={onManagePayment}>
            Gérer le paiement
          </Button>
        )}
      </SubscriptionActions>
    </SettingsCard>
  );
};

export default SubscriptionCard;
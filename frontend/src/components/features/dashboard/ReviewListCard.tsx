import React from 'react';
import { Button } from '../../layout/Button';
import {
  DashboardCard,
  CardTitle,
  CardSubtitle,
} from '../../../styles/dashboard/dashboardStyles';
import {
  ReviewList,
  ReviewItem,
  ReviewIcon,
  ReviewContent,
  ReviewTopic,
  ReviewReason,
} from '../../../styles/dashboard/DashboardCardsStyles';

/**
 * Type pour un topic à réviser
 */
export interface ReviewTopicData {
  id: string;
  topic: string;
  reason: string;
  icon?: string;
  urgent?: boolean;
}

interface ReviewListCardProps {
  /** Titre de la card */
  title?: string;
  /** Icône du titre */
  titleIcon?: string;
  /** Sous-titre */
  subtitle?: string;
  /** Liste des topics à réviser */
  topics: ReviewTopicData[];
  /** Callback au clic sur réviser */
  onReview: (topicId: string) => void;
}

/**
 * Card des topics à réviser
 */
const ReviewListCard: React.FC<ReviewListCardProps> = ({
  title = 'Topics à réviser',
  titleIcon = '🔄',
  subtitle = 'Basé sur le spaced repetition',
  topics,
  onReview,
}) => {
  return (
    <DashboardCard>
      <CardTitle>
        {titleIcon} {title}
      </CardTitle>
      
      {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
      
      <ReviewList>
        {topics.map((topic) => (
          <ReviewItem key={topic.id} urgent={topic.urgent}>
            <ReviewIcon>{topic.icon || (topic.urgent ? '⚠️' : '📝')}</ReviewIcon>
            
            <ReviewContent>
              <ReviewTopic>{topic.topic}</ReviewTopic>
              <ReviewReason>{topic.reason}</ReviewReason>
            </ReviewContent>
            
            <Button
              variant={topic.urgent ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onReview(topic.id)}
            >
              Réviser
            </Button>
          </ReviewItem>
        ))}
      </ReviewList>
    </DashboardCard>
  );
};

export default ReviewListCard;
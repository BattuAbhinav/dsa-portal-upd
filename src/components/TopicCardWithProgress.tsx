import { TopicCard } from './TopicCard';
import { useTopicProgress } from '@/hooks/useTopicProgress';

interface TopicCardWithProgressProps {
  topic: string;
  title: string;
  description: string;
  onClick: () => void;
}

export const TopicCardWithProgress = ({ topic, title, description, onClick }: TopicCardWithProgressProps) => {
  const { progress } = useTopicProgress(topic);
  
  return (
    <TopicCard
      topic={topic}
      title={title}
      description={description}
      progress={progress.overallProgress}
      onClick={onClick}
    />
  );
};
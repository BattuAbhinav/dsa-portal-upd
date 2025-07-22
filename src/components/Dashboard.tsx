import { useState } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { TopicCardWithProgress } from './TopicCardWithProgress';
import { TopicView } from './TopicView';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    {
      id: 'strings' as const,
      title: 'Strings',
      description: 'Learn string manipulation and algorithms',
      progress: 0
    },
    {
      id: 'basics' as const,
      title: 'Programming Basics',
      description: 'Variables, I/O, and control structures',
      progress: 0
    },
    {
      id: 'bit_manipulation' as const,
      title: 'Bit Manipulation',
      description: 'Bitwise operations and techniques',
      progress: 0
    },
    {
      id: 'sorting' as const,
      title: 'Sorting Algorithms',
      description: 'Various sorting techniques and their complexity',
      progress: 0
    },
    {
      id: 'searching' as const,
      title: 'Searching Algorithms',
      description: 'Binary search and other search techniques',
      progress: 0
    },
    {
      id: 'hashmaps' as const,
      title: 'Hash Maps',
      description: 'Hash tables and their applications',
      progress: 0
    }
  ];

  const handleTopicClick = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  const handleBackToDashboard = () => {
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {selectedTopic ? (
            <TopicView topic={selectedTopic} onBack={handleBackToDashboard} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <TopicCardWithProgress
                  key={topic.id}
                  topic={topic.id}
                  title={topic.title}
                  description={topic.description}
                  onClick={() => handleTopicClick(topic.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

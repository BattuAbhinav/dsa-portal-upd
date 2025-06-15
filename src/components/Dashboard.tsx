
import { useState, useEffect } from 'react';
import { DashboardHeader } from './DashboardHeader';
import { TopicCard } from './TopicCard';
import { TopicView } from './TopicView';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const topics = [
  {
    id: 'strings',
    title: 'Strings',
    description: 'Learn string manipulation, pattern matching, and string algorithms'
  },
  {
    id: 'basics',
    title: 'Programming Basics',
    description: 'Master variables, I/O operations, and control structures'
  },
  {
    id: 'bit_manipulation',
    title: 'Bit Manipulation',
    description: 'Understand bitwise operations and their applications'
  },
  {
    id: 'sorting',
    title: 'Sorting Algorithms',
    description: 'Learn various sorting techniques and their complexities'
  },
  {
    id: 'searching',
    title: 'Searching Algorithms',
    description: 'Master binary search and other searching techniques'
  },
  {
    id: 'hashmaps',
    title: 'Hash Maps',
    description: 'Understanding hash tables and efficient data retrieval'
  }
];

export const Dashboard = () => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicProgress, setTopicProgress] = useState<Record<string, number>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    // Calculate progress for each topic based on completed videos, MCQs, and coding problems
    const progress: Record<string, number> = {};
    
    for (const topic of topics) {
      const topicId = topic.id;
      
      // Get total content count for the topic
      const { data: videos } = await supabase
        .from('video_tutorials')
        .select('id')
        .eq('topic', topicId);
      
      const { data: mcqs } = await supabase
        .from('mcqs')
        .select('id')
        .eq('topic', topicId);
      
      const { data: problems } = await supabase
        .from('coding_problems')
        .select('id')
        .eq('topic', topicId);
      
      const totalContent = (videos?.length || 0) + (mcqs?.length || 0) + (problems?.length || 0);
      
      // Get user's completed content
      const { data: completedVideos } = await supabase
        .from('user_video_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('completed', true)
        .in('video_id', videos?.map(v => v.id) || []);
      
      const { data: attemptedMcqs } = await supabase
        .from('user_mcq_attempts')
        .select('mcq_id')
        .eq('user_id', user.id)
        .in('mcq_id', mcqs?.map(m => m.id) || []);
      
      const { data: attemptedProblems } = await supabase
        .from('user_coding_progress')
        .select('id')
        .eq('user_id', user.id)
        .eq('attempted', true)
        .in('problem_id', problems?.map(p => p.id) || []);
      
      const completedContent = (completedVideos?.length || 0) + 
                             (attemptedMcqs?.length || 0) + 
                             (attemptedProblems?.length || 0);
      
      progress[topicId] = totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;
    }
    
    setTopicProgress(progress);
  };

  if (selectedTopic) {
    return (
      <TopicView 
        topic={selectedTopic} 
        onBack={() => setSelectedTopic(null)}
        onProgressUpdate={fetchUserProgress}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Learning Path</h2>
          <p className="text-gray-600">Select a topic to start learning Data Structures and Algorithms</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <TopicCard
              key={topic.id}
              topic={topic.id}
              title={topic.title}
              description={topic.description}
              progress={topicProgress[topic.id] || 0}
              onClick={() => setSelectedTopic(topic.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

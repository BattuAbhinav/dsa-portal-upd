
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { VideoTutorial } from './VideoTutorial';
import { MCQ } from './MCQ';
import { CodingProblem } from './CodingProblem';
import { CheatSheet } from './CheatSheet';
import { UserNotes } from './UserNotes';

interface TopicViewProps {
  topic: string;
  onBack: () => void;
}

type VideoTutorialType = {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  platform: string;
  difficulty: string;
  duration_minutes?: number;
};

type MCQType = {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation?: string;
  topic: string;
  difficulty: string;
};

type CodingProblemType = {
  id: string;
  title: string;
  description?: string;
  platform: string;
  problem_url: string;
  topic: string;
  difficulty: string;
  tags?: string[];
};

export const TopicView = ({ topic, onBack }: TopicViewProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState<VideoTutorialType[]>([]);
  const [mcqs, setMcqs] = useState<MCQType[]>([]);
  const [codingProblems, setCodingProblems] = useState<CodingProblemType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const topicType = topic as Database['public']['Enums']['topic_type'];
        
        // Fetch videos
        const { data: videosData } = await supabase
          .from('video_tutorials')
          .select('*')
          .eq('topic', topicType);

        // Fetch MCQs (limit to 5 per topic)
        const { data: mcqsData } = await supabase
          .from('mcqs')
          .select('*')
          .eq('topic', topicType)
          .limit(5);

        // Fetch coding problems
        const { data: problemsData } = await supabase
          .from('coding_problems')
          .select('*')
          .eq('topic', topicType);
        
        setVideos(videosData || []);
        setMcqs(mcqsData || []);
        setCodingProblems(problemsData || []);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [topic, user]);

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <h2 className="text-3xl font-bold mb-4 capitalize">{topic.replace('_', ' ')}</h2>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="cheatsheet">Cheat Sheet</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="mcqs">MCQs (5)</TabsTrigger>
          <TabsTrigger value="coding">Coding Problems</TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          {loading ? (
            <p>Loading videos...</p>
          ) : videos.length === 0 ? (
            <p>No videos available for this topic.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <VideoTutorial key={video.id} video={video} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="cheatsheet">
          <CheatSheet topic={topic} />
        </TabsContent>
        <TabsContent value="notes">
          <UserNotes topic={topic} />
        </TabsContent>
        <TabsContent value="mcqs">
          {loading ? (
            <p>Loading MCQs...</p>
          ) : mcqs.length === 0 ? (
            <p>No MCQs available for this topic.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mcqs.map((mcq) => (
                <MCQ key={mcq.id} mcq={mcq} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="coding">
          {loading ? (
            <p>Loading coding problems...</p>
          ) : codingProblems.length === 0 ? (
            <p>No coding problems available for this topic.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {codingProblems.map((problem) => (
                <CodingProblem key={problem.id} problem={problem} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

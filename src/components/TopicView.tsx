import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { QuizView } from './QuizView';

interface TopicViewProps {
  topic: string;
  onBack: () => void;
}

interface VideoTutorial {
  id: number;
  title: string;
  url: string;
  topic: string;
}

interface MCQ {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  topic: string;
  difficulty: string;
}

interface CodingProblem {
  id: number;
  title: string;
  description: string;
  topic: string;
  difficulty: string;
  solution: string;
}

export const TopicView = ({ topic, onBack }: TopicViewProps) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('videos');
  const [videos, setVideos] = useState<VideoTutorial[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [codingProblems, setCodingProblems] = useState<CodingProblem[]>([]);
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

        // Fetch MCQs
        const { data: mcqsData } = await supabase
          .from('mcqs')
          .select('*')
          .eq('topic', topicType);

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
  }, [topic]);

  return (
    <div className="container mx-auto py-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Button>

      <h2 className="text-3xl font-bold mb-4 capitalize">{topic}</h2>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="mcqs">MCQs</TabsTrigger>
          <TabsTrigger value="coding">Coding Problems</TabsTrigger>
          <TabsTrigger value="quiz">Quiz</TabsTrigger>
        </TabsList>
        <TabsContent value="videos">
          {loading ? (
            <p>Loading videos...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map((video) => (
                <VideoTutorial key={video.id} video={video} />
              ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="mcqs">
          {loading ? (
            <p>Loading MCQs...</p>
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {codingProblems.map((problem) => (
                <CodingProblem key={problem.id} problem={problem} />
              ))}
            </div>
          )}
        </TabsContent>
         <TabsContent value="quiz">
          <QuizView topic={topic} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

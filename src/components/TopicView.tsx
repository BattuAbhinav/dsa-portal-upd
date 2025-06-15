
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, BookOpen, Code, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { VideoPlayer } from './VideoPlayer';
import { QuizView } from './QuizView';
import { CodingProblems } from './CodingProblems';

interface TopicViewProps {
  topic: string;
  onBack: () => void;
  onProgressUpdate: () => void;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  video_url: string;
  platform: string;
  difficulty: string;
  duration_minutes: number;
}

interface MCQ {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

interface CodingProblem {
  id: string;
  title: string;
  description: string;
  platform: string;
  problem_url: string;
  difficulty: string;
  tags: string[];
}

export const TopicView = ({ topic, onBack, onProgressUpdate }: TopicViewProps) => {
  const [videos, setVideos] = useState<VideoTutorial[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizDifficulty, setQuizDifficulty] = useState<string>('beginner');
  const { user } = useAuth();

  useEffect(() => {
    fetchTopicContent();
  }, [topic]);

  const fetchTopicContent = async () => {
    // Fetch videos
    const { data: videosData } = await supabase
      .from('video_tutorials')
      .select('*')
      .eq('topic', topic)
      .order('difficulty');
    
    // Fetch MCQs
    const { data: mcqsData } = await supabase
      .from('mcqs')
      .select('*')
      .eq('topic', topic);
    
    // Fetch coding problems
    const { data: problemsData } = await supabase
      .from('coding_problems')
      .select('*')
      .eq('topic', topic);

    setVideos(videosData || []);
    setMcqs(mcqsData || []);
    setProblems(problemsData || []);
  };

  const topicTitles: Record<string, string> = {
    strings: 'Strings',
    basics: 'Programming Basics',
    bit_manipulation: 'Bit Manipulation',
    sorting: 'Sorting Algorithms',
    searching: 'Searching Algorithms',
    hashmaps: 'Hash Maps'
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  if (selectedVideo) {
    return (
      <VideoPlayer
        video={selectedVideo}
        onBack={() => setSelectedVideo(null)}
        onComplete={onProgressUpdate}
      />
    );
  }

  if (showQuiz) {
    return (
      <QuizView
        topic={topic}
        difficulty={quizDifficulty}
        mcqs={mcqs.filter(mcq => mcq.difficulty === quizDifficulty)}
        onBack={() => setShowQuiz(false)}
        onComplete={onProgressUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topics
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{topicTitles[topic]}</h1>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
            <TabsTrigger value="quiz">Practice Quiz</TabsTrigger>
            <TabsTrigger value="problems">Coding Problems</TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Badge className={difficultyColors[video.difficulty as keyof typeof difficultyColors]}>
                        {video.difficulty}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {video.duration_minutes}min
                      </div>
                    </div>
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <CardDescription>{video.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={() => setSelectedVideo(video)} className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quiz" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['beginner', 'medium', 'high'].map((difficulty) => {
                const topicMcqs = mcqs.filter(mcq => mcq.difficulty === difficulty);
                return (
                  <Card key={difficulty}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BookOpen className="h-5 w-5 mr-2" />
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Quiz
                      </CardTitle>
                      <CardDescription>
                        {topicMcqs.length} question{topicMcqs.length !== 1 ? 's' : ''} available
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => {
                          setQuizDifficulty(difficulty);
                          setShowQuiz(true);
                        }}
                        className="w-full"
                        disabled={topicMcqs.length === 0}
                      >
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="problems" className="mt-6">
            <CodingProblems problems={problems} onProgressUpdate={onProgressUpdate} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

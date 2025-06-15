
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    description: string;
    video_url: string;
    platform: string;
    difficulty: string;
    duration_minutes: number;
  };
  onBack: () => void;
  onComplete: () => void;
}

export const VideoPlayer = ({ video, onBack, onComplete }: VideoPlayerProps) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    checkVideoProgress();
  }, [video.id, user]);

  const checkVideoProgress = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_video_progress')
      .select('completed')
      .eq('user_id', user.id)
      .eq('video_id', video.id)
      .single();

    if (data) {
      setIsCompleted(data.completed);
    }
  };

  const markAsCompleted = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('user_video_progress')
      .upsert({
        user_id: user.id,
        video_id: video.id,
        completed: true,
        completed_at: new Date().toISOString()
      });

    if (error) {
      toast.error('Failed to mark video as completed');
    } else {
      setIsCompleted(true);
      toast.success('Video marked as completed!');
      onComplete();
    }
  };

  const getVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getVideoId(video.video_url);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : video.video_url;

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={onBack} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">{video.title}</h1>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full rounded-t-lg"
                    allowFullScreen
                    title={video.title}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge className={difficultyColors[video.difficulty as keyof typeof difficultyColors]}>
                    {video.difficulty}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {video.duration_minutes} min
                  </div>
                </div>
                <CardTitle>{video.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{video.description}</p>
                <p className="text-sm text-gray-500 mb-4">Platform: {video.platform}</p>
                
                {!isCompleted ? (
                  <Button onClick={markAsCompleted} className="w-full">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                ) : (
                  <div className="flex items-center justify-center p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-700 font-medium">Completed!</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};


import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Play, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VideoTutorialProps {
  video: {
    id: string;
    title: string;
    description?: string;
    video_url: string;
    platform: string;
    difficulty: string;
    duration_minutes?: number;
  };
}

export const VideoTutorial = ({ video }: VideoTutorialProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    checkVideoProgress();
  }, [video.id, user]);

  const checkVideoProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('user_video_progress')
        .select('completed')
        .eq('video_id', video.id)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsCompleted(data?.completed || false);
    } catch (error) {
      console.error('Error checking video progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = async (completed: boolean) => {
    if (!user) return;

    try {
      if (completed) {
        await supabase
          .from('user_video_progress')
          .upsert({
            user_id: user.id,
            video_id: video.id,
            completed: true,
            completed_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,video_id'
          });
      } else {
        await supabase
          .from('user_video_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', video.id);
      }

      setIsCompleted(completed);
      toast({
        title: completed ? "Video completed!" : "Video unmarked",
        description: completed ? "Progress has been saved." : "Progress has been removed.",
      });
    } catch (error) {
      console.error('Error updating video progress:', error);
      toast({
        title: "Error",
        description: "Failed to save progress.",
        variant: "destructive",
      });
    }
  };

  const handleWatch = () => {
    window.open(video.video_url, '_blank');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={difficultyColors[video.difficulty as keyof typeof difficultyColors]}>
            {video.difficulty}
          </Badge>
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
            {video.duration_minutes && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {video.duration_minutes} min
              </div>
            )}
          </div>
        </div>
        <CardTitle className="text-lg">{video.title}</CardTitle>
        <CardDescription>{video.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="outline">{video.platform}</Badge>
            <Button onClick={handleWatch} size="sm">
              <Play className="h-4 w-4 mr-2" />
              Watch
            </Button>
          </div>
          
          {user && !loading && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`completed-${video.id}`}
                checked={isCompleted}
                onCheckedChange={(checked) => toggleCompleted(checked as boolean)}
              />
              <label htmlFor={`completed-${video.id}`} className="text-sm font-medium">
                Mark as completed
              </label>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

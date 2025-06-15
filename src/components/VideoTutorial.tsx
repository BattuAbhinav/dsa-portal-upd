
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Clock } from 'lucide-react';

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
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
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
          {video.duration_minutes && (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {video.duration_minutes} min
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{video.title}</CardTitle>
        <CardDescription>{video.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant="outline">{video.platform}</Badge>
          <Button onClick={handleWatch} size="sm">
            <Play className="h-4 w-4 mr-2" />
            Watch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

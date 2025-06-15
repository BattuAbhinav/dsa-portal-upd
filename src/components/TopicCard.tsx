
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Code, Hash, FileText, ArrowUpDown, Search, Database } from 'lucide-react';

interface TopicCardProps {
  topic: string;
  title: string;
  description: string;
  progress?: number;
  onClick: () => void;
}

const topicIcons = {
  strings: FileText,
  basics: Code,
  bit_manipulation: Hash,
  sorting: ArrowUpDown,
  searching: Search,
  hashmaps: Database,
};

export const TopicCard = ({ topic, title, description, progress = 0, onClick }: TopicCardProps) => {
  const Icon = topicIcons[topic as keyof typeof topicIcons] || Code;
  
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Icon className="h-8 w-8 text-blue-600" />
          <Badge variant="secondary">{progress}% Complete</Badge>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={progress} className="w-full" />
      </CardContent>
    </Card>
  );
};


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
  
  const getTopicGradient = (topicName: string) => {
    const gradients = {
      strings: 'from-blue-500 to-cyan-500',
      basics: 'from-green-500 to-emerald-500', 
      bit_manipulation: 'from-purple-500 to-violet-500',
      sorting: 'from-orange-500 to-red-500',
      searching: 'from-pink-500 to-rose-500',
      hashmaps: 'from-indigo-500 to-blue-500'
    };
    return gradients[topicName as keyof typeof gradients] || 'from-gray-500 to-slate-500';
  };

  const getIconColor = (topicName: string) => {
    const colors = {
      strings: 'text-blue-600 group-hover:text-cyan-600',
      basics: 'text-green-600 group-hover:text-emerald-600',
      bit_manipulation: 'text-purple-600 group-hover:text-violet-600', 
      sorting: 'text-orange-600 group-hover:text-red-600',
      searching: 'text-pink-600 group-hover:text-rose-600',
      hashmaps: 'text-indigo-600 group-hover:text-blue-600'
    };
    return colors[topicName as keyof typeof colors] || 'text-gray-600 group-hover:text-slate-600';
  };
  
  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] border-2 hover:border-transparent bg-gradient-to-br hover:from-white hover:to-gray-50/50 relative overflow-hidden"
      onClick={onClick}
    >
      {/* Animated gradient border on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r ${getTopicGradient(topic)} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg`} />
      <div className="absolute inset-[2px] bg-white rounded-md" />
      
      {/* Content */}
      <div className="relative z-10">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Icon className={`h-8 w-8 transition-all duration-300 ${getIconColor(topic)} group-hover:scale-110 group-hover:rotate-3`} />
              {/* Icon glow effect on hover */}
              <div className={`absolute inset-0 h-8 w-8 bg-gradient-to-r ${getTopicGradient(topic)} opacity-0 group-hover:opacity-20 rounded-full blur-sm transition-opacity duration-300`} />
            </div>
            <Badge 
              variant="secondary" 
              className="transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg"
            >
              {progress}% Complete
            </Badge>
          </div>
          <CardTitle className="text-xl transition-colors duration-300 group-hover:text-gray-800 group-hover:scale-[1.01]">
            {title}
          </CardTitle>
          <CardDescription className="transition-colors duration-300 group-hover:text-gray-600">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Progress 
              value={progress} 
              className="w-full transition-all duration-300 group-hover:scale-[1.02]" 
            />
            {/* Progress bar glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${getTopicGradient(topic)} opacity-0 group-hover:opacity-10 rounded-full blur-sm transition-opacity duration-300`} />
          </div>
        </CardContent>
      </div>

      {/* Floating particles effect on hover */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-500" />
      <div className="absolute top-8 right-8 w-1 h-1 bg-white/60 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-700" />
      <div className="absolute top-6 right-12 w-1.5 h-1.5 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-all duration-600" />
    </Card>
  );
};

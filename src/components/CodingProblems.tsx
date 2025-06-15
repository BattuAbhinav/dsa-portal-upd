
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface CodingProblem {
  id: string;
  title: string;
  description: string;
  platform: string;
  problem_url: string;
  difficulty: string;
  tags: string[];
}

interface CodingProblemsProps {
  problems: CodingProblem[];
  onProgressUpdate: () => void;
}

export const CodingProblems = ({ problems, onProgressUpdate }: CodingProblemsProps) => {
  const [userProgress, setUserProgress] = useState<Record<string, { attempted: boolean; solved: boolean }>>({});
  const { user } = useAuth();

  useEffect(() => {
    fetchUserProgress();
  }, [problems, user]);

  const fetchUserProgress = async () => {
    if (!user || problems.length === 0) return;

    const { data } = await supabase
      .from('user_coding_progress')
      .select('problem_id, attempted, solved')
      .eq('user_id', user.id)
      .in('problem_id', problems.map(p => p.id));

    const progressMap: Record<string, { attempted: boolean; solved: boolean }> = {};
    data?.forEach(item => {
      progressMap[item.problem_id] = {
        attempted: item.attempted,
        solved: item.solved
      };
    });

    setUserProgress(progressMap);
  };

  const markAsAttempted = async (problemId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_coding_progress')
      .upsert({
        user_id: user.id,
        problem_id: problemId,
        attempted: true,
        attempted_at: new Date().toISOString()
      });

    if (error) {
      toast.error('Failed to mark problem as attempted');
    } else {
      setUserProgress(prev => ({
        ...prev,
        [problemId]: { ...prev[problemId], attempted: true }
      }));
      onProgressUpdate();
      toast.success('Problem marked as attempted!');
    }
  };

  const markAsSolved = async (problemId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('user_coding_progress')
      .upsert({
        user_id: user.id,
        problem_id: problemId,
        attempted: true,
        solved: true,
        attempted_at: new Date().toISOString(),
        solved_at: new Date().toISOString()
      });

    if (error) {
      toast.error('Failed to mark problem as solved');
    } else {
      setUserProgress(prev => ({
        ...prev,
        [problemId]: { attempted: true, solved: true }
      }));
      onProgressUpdate();
      toast.success('Problem marked as solved! 🎉');
    }
  };

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const platformColors = {
    leetcode: 'bg-orange-100 text-orange-800',
    hackerrank: 'bg-green-100 text-green-800',
    codeforces: 'bg-blue-100 text-blue-800',
    codechef: 'bg-amber-100 text-amber-800',
    geeksforgeeks: 'bg-teal-100 text-teal-800'
  };

  const groupedProblems = problems.reduce((acc, problem) => {
    if (!acc[problem.difficulty]) {
      acc[problem.difficulty] = [];
    }
    acc[problem.difficulty].push(problem);
    return acc;
  }, {} as Record<string, CodingProblem[]>);

  return (
    <div className="space-y-8">
      {Object.entries(groupedProblems).map(([difficulty, difficultyProblems]) => (
        <div key={difficulty}>
          <h3 className="text-xl font-semibold mb-4 capitalize">
            {difficulty} Problems ({difficultyProblems.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {difficultyProblems.map((problem) => {
              const progress = userProgress[problem.id] || { attempted: false, solved: false };
              
              return (
                <Card key={problem.id} className={`relative ${progress.solved ? 'ring-2 ring-green-500' : progress.attempted ? 'ring-2 ring-yellow-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={difficultyColors[difficulty as keyof typeof difficultyColors]}>
                          {difficulty}
                        </Badge>
                        <Badge className={platformColors[problem.platform as keyof typeof platformColors]}>
                          {problem.platform}
                        </Badge>
                      </div>
                      {progress.solved && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {progress.attempted && !progress.solved && (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{problem.title}</CardTitle>
                    <CardDescription>{problem.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {problem.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => window.open(problem.problem_url, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Solve
                      </Button>
                      
                      {!progress.attempted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsAttempted(problem.id)}
                        >
                          Mark Attempted
                        </Button>
                      )}
                      
                      {progress.attempted && !progress.solved && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsSolved(problem.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          Mark Solved
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

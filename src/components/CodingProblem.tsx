
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CodingProblemProps {
  problem: {
    id: string;
    title: string;
    description?: string;
    platform: string;
    problem_url: string;
    difficulty: string;
    tags?: string[];
  };
}

export const CodingProblem = ({ problem }: CodingProblemProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [attempted, setAttempted] = useState(false);
  const [solved, setSolved] = useState(false);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchProgress();
  }, [problem.id, user]);

  const fetchProgress = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('user_coding_progress')
        .select('attempted, solved')
        .eq('problem_id', problem.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setAttempted(data.attempted || false);
        setSolved(data.solved || false);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (field: 'attempted' | 'solved', value: boolean) => {
    if (!user) return;

    try {
      const updateData = {
        [field]: value,
        [`${field}_at`]: value ? new Date().toISOString() : null,
        user_id: user.id,
        problem_id: problem.id,
      };

      const { error } = await supabase
        .from('user_coding_progress')
        .upsert(updateData, {
          onConflict: 'user_id,problem_id',
          ignoreDuplicates: false
        });

      if (error) throw error;

      if (field === 'attempted') {
        setAttempted(value);
      } else {
        setSolved(value);
        // If marking as solved, also mark as attempted
        if (value && !attempted) {
          setAttempted(true);
        }
      }

      toast({
        title: "Progress updated",
        description: `Problem marked as ${field === 'solved' ? 'solved' : 'attempted'}.`,
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSolve = () => {
    window.open(problem.problem_url, '_blank');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Badge className={difficultyColors[problem.difficulty as keyof typeof difficultyColors]}>
              {problem.difficulty}
            </Badge>
            <Badge className={platformColors[problem.platform as keyof typeof platformColors]}>
              {problem.platform}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg">{problem.title}</CardTitle>
        <CardDescription>{problem.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {problem.tags && (
          <div className="flex flex-wrap gap-1 mb-4">
            {problem.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {user && !loading && (
          <div className="flex flex-col space-y-3 mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`attempted-${problem.id}`}
                checked={attempted}
                onCheckedChange={(checked) => updateProgress('attempted', checked as boolean)}
              />
              <label htmlFor={`attempted-${problem.id}`} className="text-sm font-medium">
                Attempted
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`solved-${problem.id}`}
                checked={solved}
                onCheckedChange={(checked) => updateProgress('solved', checked as boolean)}
              />
              <label htmlFor={`solved-${problem.id}`} className="text-sm font-medium">
                Solved
              </label>
            </div>
          </div>
        )}
        
        <Button onClick={handleSolve} className="w-full">
          <ExternalLink className="h-4 w-4 mr-2" />
          Solve Problem
        </Button>
      </CardContent>
    </Card>
  );
};

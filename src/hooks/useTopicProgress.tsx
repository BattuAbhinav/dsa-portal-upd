import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface TopicProgress {
  videoProgress: number;
  mcqProgress: number;
  codingProgress: number;
  overallProgress: number;
}

export const useTopicProgress = (topic: string) => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<TopicProgress>({
    videoProgress: 0,
    mcqProgress: 0,
    codingProgress: 0,
    overallProgress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !topic) {
      setLoading(false);
      return;
    }

    const fetchProgress = async () => {
      try {
        const topicType = topic as Database['public']['Enums']['topic_type'];
        
        // Get total counts for this topic
        const [videosResult, mcqsResult, problemsResult] = await Promise.all([
          supabase.from('video_tutorials').select('id').eq('topic', topicType),
          supabase.from('mcqs').select('id').eq('topic', topicType),
          supabase.from('coding_problems').select('id').eq('topic', topicType)
        ]);

        const totalVideos = videosResult.data?.length || 0;
        const totalMcqs = mcqsResult.data?.length || 0;
        const totalProblems = problemsResult.data?.length || 0;

        if (totalVideos === 0 && totalMcqs === 0 && totalProblems === 0) {
          setProgress({
            videoProgress: 0,
            mcqProgress: 0,
            codingProgress: 0,
            overallProgress: 0
          });
          setLoading(false);
          return;
        }

        // Get completed counts for this user
        const [completedVideosResult, completedMcqsResult, completedProblemsResult] = await Promise.all([
          // Count completed videos
          supabase
            .from('user_video_progress')
            .select('video_id')
            .eq('user_id', user.id)
            .eq('completed', true)
            .in('video_id', videosResult.data?.map(v => v.id) || []),

          // Count attempted MCQs (completion means answering at least once)
          supabase
            .from('user_mcq_attempts')
            .select('mcq_id')
            .eq('user_id', user.id)
            .in('mcq_id', mcqsResult.data?.map(m => m.id) || []),

          // Count solved coding problems
          supabase
            .from('user_coding_progress')
            .select('problem_id')
            .eq('user_id', user.id)
            .eq('solved', true)
            .in('problem_id', problemsResult.data?.map(p => p.id) || [])
        ]);

        const completedVideos = completedVideosResult.data?.length || 0;
        const completedMcqs = new Set(completedMcqsResult.data?.map(item => item.mcq_id) || []).size;
        const completedProblems = completedProblemsResult.data?.length || 0;

        const videoProgress = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
        const mcqProgress = totalMcqs > 0 ? Math.round((completedMcqs / totalMcqs) * 100) : 0;
        const codingProgress = totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;

        // Calculate overall progress (weighted average)
        const totalWeight = (totalVideos > 0 ? 1 : 0) + (totalMcqs > 0 ? 1 : 0) + (totalProblems > 0 ? 1 : 0);
        let overallProgress = 0;
        
        if (totalWeight > 0) {
          overallProgress = Math.round(
            ((totalVideos > 0 ? videoProgress : 0) + 
             (totalMcqs > 0 ? mcqProgress : 0) + 
             (totalProblems > 0 ? codingProgress : 0)) / totalWeight
          );
        }

        setProgress({
          videoProgress,
          mcqProgress,
          codingProgress,
          overallProgress
        });

      } catch (error) {
        console.error('Error calculating topic progress:', error);
        setProgress({
          videoProgress: 0,
          mcqProgress: 0,
          codingProgress: 0,
          overallProgress: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [user, topic]);

  return { progress, loading };
};
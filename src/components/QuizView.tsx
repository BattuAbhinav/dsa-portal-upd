import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner';

interface MCQ {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  topic: string;
  difficulty: string;
}

export const QuizView = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const topic = searchParams.get('topic');
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const [difficulty, setDifficulty] = useState<string>('easy');
  const [timeLimit, setTimeLimit] = useState(10);

  useEffect(() => {
    const fetchMcqs = async () => {
      if (!topic) return;

      try {
        const topicType = topic as Database['public']['Enums']['topic_type'];
        const difficultyLevel = difficulty as Database['public']['Enums']['difficulty_level'];

        const { data } = await supabase
          .from('mcqs')
          .select('*')
          .eq('topic', topicType)
          .eq('difficulty', difficultyLevel);

        if (data) {
          setMcqs(data);
          setUserAnswers(Array(data.length).fill(''));
        }
      } catch (error) {
        console.error('Error fetching MCQs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMcqs();
  }, [topic, difficulty]);

  const handleAnswerChange = (index: number, answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[index] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmitQuiz = async () => {
    if (!user) return;

    const correctCount = userAnswers.reduce((count, answer, index) => {
      return count + (answer === mcqs[index].correct_answer ? 1 : 0);
    }, 0);

    const score = (correctCount / mcqs.length) * 100;

    try {
      // Save quiz session
      await supabase
        .from('quiz_sessions')
        .insert({
          user_id: user.id,
          topic: topic as Database['public']['Enums']['topic_type'],
          difficulty: difficulty as Database['public']['Enums']['difficulty_level'],
          total_questions: mcqs.length,
          correct_answers: correctCount,
          time_limit_minutes: timeLimit,
          completed_at: new Date().toISOString(),
          score: score
        });

      // Save individual MCQ attempts
      const attempts = mcqs.map((mcq, index) => ({
        user_id: user.id,
        mcq_id: mcq.id,
        selected_answer: userAnswers[index],
        is_correct: userAnswers[index] === mcq.correct_answer
      }));

      await supabase
        .from('user_mcq_attempts')
        .insert(attempts);

      setQuizCompleted(true);
      setScore(score);
      toast.success(`Quiz completed! Score: ${score.toFixed(1)}%`);
    } catch (error) {
      console.error('Error saving quiz results:', error);
      toast.error('Failed to save quiz results');
    }
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  if (!topic) {
    return <div>Topic not specified.</div>;
  }

  if (quizCompleted) {
    return (
      <div className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
        <p className="mb-2">Your score: {score.toFixed(1)}%</p>
        <Button onClick={() => navigate(`/topic?topic=${topic}`)}>Back to Topic</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Quiz on {topic}</h2>

      <div className="mb-4">
        <Label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
          Difficulty:
        </Label>
        <RadioGroup defaultValue="easy" className="flex gap-2 mt-2" onValueChange={(value) => setDifficulty(value)}>
          <RadioGroupItem value="easy" id="r1" />
          <Label htmlFor="r1">Easy</Label>
          <RadioGroupItem value="medium" id="r2" />
          <Label htmlFor="r2">Medium</Label>
          <RadioGroupItem value="hard" id="r3" />
          <Label htmlFor="r3">Hard</Label>
        </RadioGroup>
      </div>

      <div className="mb-4">
        <Label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700">
          Time Limit (minutes): {timeLimit}
        </Label>
        <Slider
          id="timeLimit"
          defaultValue={[10]}
          max={30}
          min={5}
          step={5}
          onValueChange={(value) => setTimeLimit(value[0])}
          className="w-64"
        />
      </div>

      {mcqs.map((mcq, index) => (
        <div key={mcq.id} className="mb-6 p-4 border rounded-md">
          <p className="mb-2">{index + 1}. {mcq.question}</p>
          {mcq.options.map((option) => (
            <div key={option} className="flex items-center mb-2">
              <input
                type="radio"
                id={`${mcq.id}-${option}`}
                name={`question-${index}`}
                value={option}
                checked={userAnswers[index] === option}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="mr-2"
              />
              <label htmlFor={`${mcq.id}-${option}`}>{option}</label>
            </div>
          ))}
        </div>
      ))}

      <Button onClick={handleSubmitQuiz} disabled={userAnswers.some(answer => answer === '')} variant="outline">
        Submit Quiz
      </Button>
    </div>
  );
};

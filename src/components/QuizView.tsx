
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner';

interface MCQ {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  topic: string;
  difficulty: string;
}

interface QuizViewProps {
  topic: string;
}

export const QuizView = ({ topic }: QuizViewProps) => {
  const { user } = useAuth();

  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const [difficulty, setDifficulty] = useState<string>('beginner');
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

  const getOptions = (mcq: MCQ) => {
    return [
      { value: 'A', label: mcq.option_a },
      { value: 'B', label: mcq.option_b },
      { value: 'C', label: mcq.option_c },
      { value: 'D', label: mcq.option_d }
    ];
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
        <Button onClick={() => window.location.reload()}>Take Another Quiz</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4 capitalize">Quiz on {topic}</h2>

      <div className="mb-4">
        <Label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
          Difficulty:
        </Label>
        <RadioGroup defaultValue="beginner" className="flex gap-2 mt-2" onValueChange={(value) => setDifficulty(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="beginner" id="r1" />
            <Label htmlFor="r1">Beginner</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="r2" />
            <Label htmlFor="r2">Medium</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="r3" />
            <Label htmlFor="r3">High</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-6">
        <Label htmlFor="timeLimit" className="block text-sm font-medium text-gray-700 mb-2">
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

      {mcqs.length === 0 ? (
        <p>No questions available for this topic and difficulty level.</p>
      ) : (
        <>
          {mcqs.map((mcq, index) => (
            <div key={mcq.id} className="mb-6 p-4 border rounded-md">
              <p className="mb-4 font-medium">{index + 1}. {mcq.question}</p>
              <RadioGroup value={userAnswers[index]} onValueChange={(value) => handleAnswerChange(index, value)}>
                {getOptions(mcq).map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`${mcq.id}-${option.value}`} />
                    <Label htmlFor={`${mcq.id}-${option.value}`}>{option.value}. {option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          ))}

          <Button 
            onClick={handleSubmitQuiz} 
            disabled={userAnswers.some(answer => answer === '')} 
            className="w-full"
          >
            Submit Quiz
          </Button>
        </>
      )}
    </div>
  );
};

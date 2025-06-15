
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface MCQ {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

interface QuizViewProps {
  topic: string;
  difficulty: string;
  mcqs: MCQ[];
  onBack: () => void;
  onComplete: () => void;
}

export const QuizView = ({ topic, difficulty, mcqs, onBack, onComplete }: QuizViewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes default
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !quizCompleted && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && !quizCompleted) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, quizStarted, quizCompleted]);

  const currentQuestion = mcqs[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mcqs.length) * 100;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedAnswer
      }));

      if (currentQuestionIndex < mcqs.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
      } else {
        handleSubmitQuiz();
      }
    }
  };

  const handleSubmitQuiz = async () => {
    setQuizCompleted(true);
    
    if (!user) return;

    // Save all answers to database
    const finalAnswers = selectedAnswer ? {
      ...answers,
      [currentQuestion.id]: selectedAnswer
    } : answers;

    let correctCount = 0;
    for (const [mcqId, userAnswer] of Object.entries(finalAnswers)) {
      const mcq = mcqs.find(m => m.id === mcqId);
      const isCorrect = mcq?.correct_answer === userAnswer;
      if (isCorrect) correctCount++;

      await supabase.from('user_mcq_attempts').insert({
        user_id: user.id,
        mcq_id: mcqId,
        selected_answer: userAnswer,
        is_correct: isCorrect
      });
    }

    // Save quiz session
    await supabase.from('quiz_sessions').insert({
      user_id: user.id,
      topic,
      difficulty,
      total_questions: mcqs.length,
      correct_answers: correctCount,
      time_limit_minutes: 5,
      completed_at: new Date().toISOString(),
      score: (correctCount / mcqs.length) * 100
    });

    onComplete();
    toast.success(`Quiz completed! Score: ${correctCount}/${mcqs.length}`);
  };

  if (mcqs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Questions Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              There are no {difficulty} level questions available for this topic yet.
            </p>
            <Button onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Topic
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Ready to Start Quiz?</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Badge className="mb-2">{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Badge>
            <p><strong>{mcqs.length}</strong> questions</p>
            <p><strong>5 minutes</strong> time limit</p>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setQuizStarted(true)} className="flex-1">
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizCompleted) {
    const finalAnswers = selectedAnswer ? {
      ...answers,
      [currentQuestion.id]: selectedAnswer
    } : answers;
    
    const correctCount = mcqs.filter(mcq => finalAnswers[mcq.id] === mcq.correct_answer).length;
    const score = Math.round((correctCount / mcqs.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Quiz Results</CardTitle>
              <div className="text-3xl font-bold text-blue-600 mt-4">
                {correctCount}/{mcqs.length}
              </div>
              <Badge variant={score >= 70 ? "default" : "destructive"} className="mt-2">
                {score}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mcqs.map((mcq, index) => {
                  const userAnswer = finalAnswers[mcq.id];
                  const isCorrect = userAnswer === mcq.correct_answer;
                  
                  return (
                    <Card key={mcq.id} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Question {index + 1}</span>
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <p className="text-gray-700">{mcq.question}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p><strong>Your answer:</strong> {userAnswer || 'Not answered'}</p>
                          <p><strong>Correct answer:</strong> {mcq.correct_answer}</p>
                          {mcq.explanation && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Explanation:</strong> {mcq.explanation}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              <div className="flex justify-center mt-8">
                <Button onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Topic
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Badge>
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {mcqs.length}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </div>

      <main className="max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { key: 'A', text: currentQuestion.option_a },
                { key: 'B', text: currentQuestion.option_b },
                { key: 'C', text: currentQuestion.option_c },
                { key: 'D', text: currentQuestion.option_d }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => handleAnswerSelect(option.key)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-colors ${
                    selectedAnswer === option.key
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-medium mr-3">{option.key}.</span>
                  {option.text}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Quiz
              </Button>
              
              <Button 
                onClick={handleNextQuestion} 
                disabled={!selectedAnswer}
              >
                {currentQuestionIndex === mcqs.length - 1 ? 'Finish Quiz' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

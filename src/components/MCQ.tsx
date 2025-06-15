
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle } from 'lucide-react';

interface MCQProps {
  mcq: {
    id: string;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    explanation?: string;
    difficulty: string;
  };
}

export const MCQ = ({ mcq }: MCQProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);

  const options = [
    { value: 'A', label: mcq.option_a },
    { value: 'B', label: mcq.option_b },
    { value: 'C', label: mcq.option_c },
    { value: 'D', label: mcq.option_d }
  ];

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      setShowResult(true);
    }
  };

  const isCorrect = selectedAnswer === mcq.correct_answer;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge className={difficultyColors[mcq.difficulty as keyof typeof difficultyColors]}>
            {mcq.difficulty}
          </Badge>
          {showResult && (
            <div className="flex items-center">
              {isCorrect ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        <CardTitle className="text-lg">{mcq.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} disabled={showResult}>
          {options.map((option) => (
            <div key={option.value} className={`flex items-center space-x-2 p-2 rounded ${
              showResult 
                ? option.value === mcq.correct_answer 
                  ? 'bg-green-50 border border-green-200' 
                  : option.value === selectedAnswer && selectedAnswer !== mcq.correct_answer
                    ? 'bg-red-50 border border-red-200'
                    : ''
                : ''
            }`}>
              <RadioGroupItem value={option.value} id={`${mcq.id}-${option.value}`} />
              <Label htmlFor={`${mcq.id}-${option.value}`} className="flex-1">
                {option.value}. {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {!showResult ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedAnswer} 
            className="w-full mt-4"
          >
            Submit Answer
          </Button>
        ) : (
          <div className="mt-4">
            <div className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </p>
              {mcq.explanation && (
                <p className="text-sm mt-2 text-gray-600">{mcq.explanation}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

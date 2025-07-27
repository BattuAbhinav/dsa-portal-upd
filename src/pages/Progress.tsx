import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, TrendingUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const generateMockData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const questionsCount = Math.floor(Math.random() * 6); // 0-5 questions per day
    
    data.push({
      date: date.toISOString().split('T')[0],
      questions: questionsCount,
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    });
  }
  
  return data;
};

const Progress = () => {
  const [progressData, setProgressData] = useState(generateMockData());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const hasActivity = progressData.some(item => item.date === dateStr && item.questions > 0);
      days.push({ day, hasActivity, date: dateStr });
    }
    
    return days;
  };

  const monthDays = getDaysInMonth(currentMonth);
  const totalQuestions = progressData.reduce((sum, item) => sum + item.questions, 0);
  const activeDays = progressData.filter(item => item.questions > 0).length;

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Progress</h1>
          <p className="text-gray-600">Track your daily coding practice and progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900">{totalQuestions}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Days</p>
                    <p className="text-2xl font-bold text-gray-900">{activeDays}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {monthDays.map((day, index) => (
                  <div
                    key={index}
                    className={`
                      h-10 w-10 rounded-lg flex items-center justify-center text-sm
                      ${day === null 
                        ? '' 
                        : day.hasActivity 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }
                    `}
                  >
                    {day?.day}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-100 rounded"></div>
                  <span>No activity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Questions solved</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Questions Solved (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="displayDate" 
                    tick={{ fontSize: 12 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(label) => `Date: ${label}`}
                    formatter={(value) => [`${value} questions`, 'Questions Solved']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="questions" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Progress;
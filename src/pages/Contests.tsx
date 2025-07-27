import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ExternalLink, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Contest {
  id: string;
  platform: string;
  name: string;
  date: string;
  time: string;
  registerUrl: string;
  platformColor: string;
}

const contests: Contest[] = [
  {
    id: '1',
    platform: 'LeetCode',
    name: 'Weekly Contest 461',
    date: 'Sun, Aug 3',
    time: '8:00 AM',
    registerUrl: 'https://leetcode.com/contest/weekly-contest-461/',
    platformColor: 'bg-orange-500'
  },
  {
    id: '2',
    platform: 'LeetCode',
    name: 'Biweekly Contest 162',
    date: 'Sat, Aug 2',
    time: '8:00 PM',
    registerUrl: 'https://leetcode.com/contest/biweekly-contest-162/',
    platformColor: 'bg-orange-500'
  },
  {
    id: '3',
    platform: 'CodeChef',
    name: 'Starters 197',
    date: '30 July 2025',
    time: '8:00 PM - 10:00 PM',
    registerUrl: 'https://www.codechef.com/START197D',
    platformColor: 'bg-brown-600'
  }
];

const Contests = () => {
  const { toast } = useToast();
  const [notifyingContests, setNotifyingContests] = useState<Set<string>>(new Set());

  const handleNotifyMe = async (contest: Contest) => {
    setNotifyingContests(prev => new Set(prev).add(contest.id));
    
    try {
      // TODO: Implement email notification API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Notification Set!",
        description: `You'll be notified about ${contest.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set notification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setNotifyingContests(prev => {
        const newSet = new Set(prev);
        newSet.delete(contest.id);
        return newSet;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Programming Contests</h1>
          <p className="text-gray-600">Stay updated with upcoming coding contests from various platforms</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contests.map((contest) => (
            <Card key={contest.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${contest.platformColor} text-white`}>
                    {contest.platform}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {contest.date}
                  </div>
                </div>
                <CardTitle className="text-lg">{contest.name}</CardTitle>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {contest.time}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => window.open(contest.registerUrl, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleNotifyMe(contest)}
                    disabled={notifyingContests.has(contest.id)}
                    className="w-full"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {notifyingContests.has(contest.id) ? 'Setting...' : 'Notify Me'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contests;
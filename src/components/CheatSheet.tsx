import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

interface CheatSheetProps {
  topic: string;
}

type CheatSheetType = {
  id: string;
  title: string;
  content: string;
  topic: string;
  created_at: string;
};

export const CheatSheet = ({ topic }: CheatSheetProps) => {
  const [cheatSheets, setCheatSheets] = useState<CheatSheetType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCheatSheets = async () => {
      try {
        const { data } = await supabase
          .from('cheat_sheets')
          .select('*')
          .eq('topic', topic)
          .order('created_at', { ascending: false });

        setCheatSheets(data || []);
      } catch (error) {
        console.error('Error fetching cheat sheets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheatSheets();
  }, [topic]);

  if (loading) {
    return <p>Loading cheat sheets...</p>;
  }

  if (cheatSheets.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500">No cheat sheets available for this topic yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {cheatSheets.map((sheet) => (
        <Card key={sheet.id} className="h-full">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <Badge variant="secondary">Cheat Sheet</Badge>
            </div>
            <CardTitle className="text-lg">{sheet.title}</CardTitle>
            <CardDescription>
              Quick reference for {topic.replace('_', ' ')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-line text-sm leading-relaxed">
                {sheet.content}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
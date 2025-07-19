import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Plus, Edit, Trash2, StickyNote } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserNotesProps {
  topic: string;
}

type UserNoteType = {
  id: string;
  title: string;
  content: string;
  topic: string;
  created_at: string;
  updated_at: string;
};

export const UserNotes = ({ topic }: UserNotesProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState<UserNoteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<UserNoteType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, [topic, user]);

  const fetchNotes = async () => {
    if (!user) return;
    
    try {
      const { data } = await supabase
        .from('user_notes')
        .select('*')
        .eq('topic', topic)
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      setNotes(data || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNote = async () => {
    if (!user || !title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      if (editingNote) {
        // Update existing note
        const { error } = await supabase
          .from('user_notes')
          .update({
            title: title.trim(),
            content: content.trim(),
          })
          .eq('id', editingNote.id);

        if (error) throw error;

        toast({
          title: "Note updated",
          description: "Your note has been updated successfully.",
        });
      } else {
        // Create new note
        const { error } = await supabase
          .from('user_notes')
          .insert({
            title: title.trim(),
            content: content.trim(),
            topic,
            user_id: user.id,
          });

        if (error) throw error;

        toast({
          title: "Note created",
          description: "Your note has been created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingNote(null);
      setTitle('');
      setContent('');
      fetchNotes();
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEditNote = (note: UserNoteType) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsDialogOpen(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const { error } = await supabase
        .from('user_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;

      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully.",
      });
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openNewNoteDialog = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setIsDialogOpen(true);
  };

  if (loading) {
    return <p>Loading your notes...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">My Notes</h3>
          <p className="text-sm text-muted-foreground">
            Personal notes and formulas for {topic.replace('_', ' ')}
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewNoteDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingNote ? 'Edit Note' : 'Create New Note'}
              </DialogTitle>
              <DialogDescription>
                Add your personal notes, formulas, and important points for {topic.replace('_', ' ')}.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your notes, formulas, key points..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                onClick={handleSaveNote}
                disabled={!title.trim() || !content.trim() || saving}
              >
                {saving ? 'Saving...' : editingNote ? 'Update Note' : 'Create Note'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-8">
          <StickyNote className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">No notes yet. Create your first note!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <StickyNote className="h-4 w-4 text-blue-600" />
                    <Badge variant="outline">Personal Note</Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNote(note)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{note.title}</CardTitle>
                <CardDescription>
                  {new Date(note.updated_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {note.content}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
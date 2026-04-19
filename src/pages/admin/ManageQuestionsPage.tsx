import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Trash2, Pencil } from 'lucide-react';
import {
  useGetQuestionsQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/api/endpoints/question.api";
import { toast } from 'sonner';

export default function ManageQuestionsPage() {
  const { data: questions, isLoading } = useGetQuestionsQuery();
  const [createQuestion, { isLoading: creating }] = useCreateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    category: 'frontend',
    starter_code: '',
    solution: '',
  });

  const handleCreate = async () => {
    if (!form.title.trim()) return toast.error('Title is required');
    try {
      await createQuestion(form as any).unwrap();
      toast.success('Question created!');
      setOpen(false);
      setForm({ title: '', description: '', difficulty: 'easy', category: 'frontend', starter_code: '', solution: '' });
    } catch {
      toast.error('Failed to create question');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteQuestion(id).unwrap();
      toast.success('Question deleted');
    } catch {
      toast.error('Failed to delete question');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Manage Questions</h1>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground gap-2">
                <Plus className="h-4 w-4" /> Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Difficulty</Label>
                    <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="dsa">DSA</SelectItem>
                        <SelectItem value="system_design">System Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Starter Code</Label>
                  <Textarea value={form.starter_code} onChange={(e) => setForm({ ...form, starter_code: e.target.value })} rows={3} className="font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label>Solution</Label>
                  <Textarea value={form.solution} onChange={(e) => setForm({ ...form, solution: e.target.value })} rows={3} className="font-mono text-sm" />
                </div>
                <Button onClick={handleCreate} disabled={creating} className="w-full gradient-primary text-primary-foreground">
                  {creating ? 'Creating...' : 'Create Question'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
          </div>
        ) : questions?.length ? (
          <div className="space-y-3">
            {questions.map((q) => (
              <Card key={q.id} className="border-border/50">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{q.title}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="capitalize">{q.difficulty}</Badge>
                      <Badge variant="outline" className="capitalize">{q.category.replace('_', ' ')}</Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)} className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-border/50">
            <CardContent className="text-center py-12 text-muted-foreground">No questions yet. Add one!</CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

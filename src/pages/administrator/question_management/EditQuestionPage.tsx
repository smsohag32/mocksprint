import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useGetQuestionByIdQuery, 
  useUpdateQuestionMutation 
} from '@/api/endpoints/question.api';
import { useGetCategoriesQuery } from '@/api/endpoints/questionCategory.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Save, ArrowLeft, Loader2, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditQuestionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: question, isLoading: isFetching, isError } = useGetQuestionByIdQuery(id as string);
  const { data: categoryData, isLoading: categoriesLoading } = useGetCategoriesQuery({ status: 'active' });
  const [updateQuestion, { isLoading: isUpdating }] = useUpdateQuestionMutation();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'medium',
    categoryId: '',
    starter_code: '',
    solution: '',
  });

  useEffect(() => {
    if (question) {
      setFormData({
        title: question.title,
        description: question.description,
        difficulty: question.difficulty,
        categoryId: question.categoryId,
        starter_code: question.starter_code || '',
        solution: question.solution || '',
      });
    }
  }, [question]);

  const categories = categoryData?.categories || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    try {
      await updateQuestion({ id, data: formData }).unwrap();
      toast.success('Question updated successfully');
      navigate('/administrator/questions');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update question');
    }
  };

  if (isFetching) {
    return (
      <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-bold">Question not found</h2>
        <Button onClick={() => navigate('/administrator/questions')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/administrator/questions')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Edit Question</h1>
            <p className="text-muted-foreground">Update the details and code for this task.</p>
          </div>
        </div>
        <Button 
          form="edit-question-form"
          type="submit" 
          disabled={isUpdating} 
          className="w-full md:w-auto gradient-primary text-white font-bold shadow-lg shadow-primary/20"
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>

      <form id="edit-question-form" onSubmit={handleSubmit}>
        <Card className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardHeader className="pb-6">
            <CardTitle className="text-xl font-black">Question Details</CardTitle>
            <CardDescription>Modify properties and content.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label className="font-bold">Title <span className="text-destructive">*</span></Label>
                <Input 
                  placeholder="e.g. Implement a custom useFetch hook" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-11 bg-background/50"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="font-bold">Category <span className="text-destructive">*</span></Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(v) => setFormData({ ...formData, categoryId: v })}
                >
                  <SelectTrigger className="h-11 bg-background/50">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <div className="flex items-center justify-center p-2"><Loader2 className="h-4 w-4 animate-spin" /></div>
                    ) : categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">Difficulty</Label>
                <Select 
                  value={formData.difficulty} 
                  onValueChange={(v: any) => setFormData({ ...formData, difficulty: v })}
                >
                  <SelectTrigger className="h-11 bg-background/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Description <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Textarea 
                  placeholder="Explain the requirements, constraints, and examples..." 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="bg-background/50 resize-none pt-10"
                  required
                />
                <div className="absolute top-2 left-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                  <Info className="h-3 w-3" /> Supports Markdown
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold text-blue-500">Starter Code</Label>
                <Textarea 
                  placeholder="Provide the initial code structure..." 
                  value={formData.starter_code}
                  onChange={(e) => setFormData({ ...formData, starter_code: e.target.value })}
                  rows={10}
                  className="font-mono text-sm bg-slate-950 text-slate-100 border-slate-800"
                />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-emerald-500">Solution</Label>
                <Textarea 
                  placeholder="Provide the complete working solution..." 
                  value={formData.solution}
                  onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                  rows={10}
                  className="font-mono text-sm bg-slate-950 text-emerald-50 border-emerald-900/30"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>

      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={() => navigate('/administrator/questions')} className="font-bold">
          Cancel
        </Button>
        <Button 
          form="edit-question-form"
          type="submit" 
          disabled={isUpdating} 
          className="gradient-primary text-white font-bold shadow-lg shadow-primary/20"
        >
          {isUpdating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}

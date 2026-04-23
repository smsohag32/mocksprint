import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateQuestionMutation } from '@/api/endpoints/question.api';
import { useGetCategoriesQuery } from '@/api/endpoints/questionCategory.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Trash2, Save, ArrowLeft, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QuestionForm {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  categoryId: string;
  starter_code: string;
  solution: string;
}

const emptyQuestion: QuestionForm = {
  title: '',
  description: '',
  difficulty: 'medium',
  categoryId: '',
  starter_code: '',
  solution: '',
};

export default function AddQuestionPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuestionForm[]>([{ ...emptyQuestion }]);
  
  const { data: categoryData, isLoading: categoriesLoading } = useGetCategoriesQuery({ status: 'active' });
  const [createQuestions, { isLoading: isSubmitting }] = useCreateQuestionMutation();

  const categories = categoryData?.categories || [];

  const addQuestionForm = () => {
    setQuestions([...questions, { ...emptyQuestion }]);
  };

  const removeQuestionForm = (index: number) => {
    if (questions.length === 1) {
      toast.error('At least one question is required');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    // Validation
    const invalid = questions.find(q => !q.title || !q.description || !q.categoryId);
    if (invalid) {
      toast.error('Please fill in all required fields (Title, Description, Category) for each question');
      return;
    }

    try {
      await createQuestions(questions).unwrap();
      toast.success('Questions added successfully');
      navigate('/admin/questions');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to add questions');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/questions')} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight">Bulk Add Questions</h1>
            <p className="text-muted-foreground">Add multiple questions to the bank at once.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" onClick={addQuestionForm} disabled={isSubmitting} className="flex-1 md:flex-none font-bold">
            <Plus className="h-4 w-4 mr-2" /> Add Another
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 md:flex-none gradient-primary text-white font-bold shadow-lg shadow-primary/20">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Save All Questions
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        {questions.map((form, index) => (
          <Card key={index} className="border-border/50 shadow-xl overflow-hidden bg-card/50 backdrop-blur-sm relative transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle className="text-xl font-black">Question #{index + 1}</CardTitle>
                <CardDescription>Enter details for this interview task.</CardDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeQuestionForm(index)} 
                className="text-destructive hover:bg-destructive/10 rounded-full"
                title="Remove this question"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold">Title <span className="text-destructive">*</span></Label>
                  <Input 
                    placeholder="e.g. Implement a custom useFetch hook" 
                    value={form.title}
                    onChange={(e) => updateQuestion(index, 'title', e.target.value)}
                    className="h-11 bg-background/50"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="font-bold">Category <span className="text-destructive">*</span></Label>
                  <Select 
                    value={form.categoryId} 
                    onValueChange={(v) => updateQuestion(index, 'categoryId', v)}
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
                    value={form.difficulty} 
                    onValueChange={(v: any) => updateQuestion(index, 'difficulty', v)}
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
                    value={form.description}
                    onChange={(e) => updateQuestion(index, 'description', e.target.value)}
                    rows={6}
                    className="bg-background/50 resize-none pt-10"
                  />
                  <div className="absolute top-2 left-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                    <Info className="h-3 w-3" /> Supports Markdown
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-bold">Starter Code</Label>
                  <Textarea 
                    placeholder="Provide the initial code structure..." 
                    value={form.starter_code}
                    onChange={(e) => updateQuestion(index, 'starter_code', e.target.value)}
                    rows={8}
                    className="font-mono text-sm bg-slate-950 text-slate-100 border-slate-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-emerald-500">Solution</Label>
                  <Textarea 
                    placeholder="Provide the complete working solution..." 
                    value={form.solution}
                    onChange={(e) => updateQuestion(index, 'solution', e.target.value)}
                    rows={8}
                    className="font-mono text-sm bg-slate-950 text-emerald-50 border-emerald-900/30"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center pt-8 border-t border-border/50">
        <Button 
          variant="ghost" 
          size="lg" 
          onClick={addQuestionForm} 
          disabled={isSubmitting}
          className="h-14 px-10 rounded-full border-2 border-dashed border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
        >
          <Plus className="h-5 w-5 mr-2" /> Add Another Question Form
        </Button>
      </div>
    </div>
  );
}

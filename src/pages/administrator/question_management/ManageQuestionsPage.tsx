import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetQuestionsQuery, 
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} from "@/api/endpoints/question.api";
import { useGetCategoriesQuery } from '@/api/endpoints/questionCategory.api';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Trash2, 
  Search, 
  MoreVertical, 
  Edit2, 
  Eye,
  FileQuestion,
  Filter,
  CheckCircle2,
  Code2,
  BookOpen,
  Trophy,
  History,
  X,
  Copy,
  ExternalLink,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ManageQuestionsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  
  const { data: questions, isLoading } = useGetQuestionsQuery({ search: searchTerm });
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

  const categories = []; // Not needed in this page anymore

  const handleDeleteConfirm = async () => {
    if (!selectedQuestion) return;
    try {
      await deleteQuestion(selectedQuestion.id).unwrap();
      toast.success('Question deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch {
      toast.error('Failed to delete question');
    }
  };

  const openDeleteDialog = (question: any) => {
    setSelectedQuestion(question);
    setIsDeleteDialogOpen(true);
  };

  const openDetails = (question: any) => {
    setSelectedQuestion(question);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground text-sm">Review and manage all practice questions.</p>
        </div>
        <Button 
          onClick={() => navigate('/administrator/questions/add')}
          className="gradient-primary text-white font-bold shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Questions
        </Button>
      </div>

      <Card className="border-border/50 shadow-xl bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-muted/30 border-b border-border/50">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by title..." 
                className="pl-10 bg-background/50 border-border/50 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 ml-auto w-full md:w-auto">
               <Button variant="outline" size="sm" className="h-10 px-4 font-bold border-border/50">
                 <Filter className="h-4 w-4 mr-2" /> Filter
               </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/20">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-bold py-4 pl-6">Question Details</TableHead>
                <TableHead className="font-bold">Category</TableHead>
                <TableHead className="font-bold">Difficulty</TableHead>
                <TableHead className="font-bold">Created</TableHead>
                <TableHead className="font-bold text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                    <p className="text-sm text-muted-foreground mt-2">Fetching questions...</p>
                  </TableCell>
                </TableRow>
              ) : !questions || questions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-64 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileQuestion className="h-10 w-10 text-muted-foreground/30" />
                      <p className="text-muted-foreground font-medium">No questions found.</p>
                      {searchTerm && <Button variant="link" onClick={() => setSearchTerm('')}>Clear search</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                questions.map((q: any) => (
                  <TableRow key={q.id} className="hover:bg-muted/10 transition-colors group">
                    <TableCell className="py-4 pl-6">
                      <div 
                        className="flex flex-col gap-0.5 cursor-pointer group/title"
                        onClick={() => openDetails(q)}
                      >
                        <span className="font-bold text-foreground group-hover/title:text-primary transition-colors flex items-center gap-2">
                          {q.title}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1 max-w-xs">
                          {q.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-muted font-bold text-[10px] uppercase tracking-wider">
                        {q.category?.name || 'Uncategorized'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        "text-[10px] uppercase font-black px-2 py-0.5",
                        q.difficulty === 'easy' ? "bg-emerald-500/10 text-emerald-500" :
                        q.difficulty === 'medium' ? "bg-amber-500/10 text-amber-500" :
                        "bg-rose-500/10 text-rose-500"
                      )}>
                        {q.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                      {new Date(q.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 shadow-xl border-border/50">
                          <DropdownMenuItem onClick={() => openDetails(q)} className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`/administrator/questions/edit/${q.id}`)} className="cursor-pointer">
                            <Edit2 className="h-4 w-4 mr-2 text-primary" /> Edit Question
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(q)} className="cursor-pointer text-destructive focus:text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="max-w-md border-destructive/20 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Delete Question?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <span className="font-bold text-foreground">"{selectedQuestion?.title}"</span>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 font-bold"
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Details Sheet */}
      <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto p-0 border-l border-border/50">
          <div className="relative h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-b border-border/50">
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={cn(
                    "text-[10px] uppercase font-black px-2 py-0.5",
                    selectedQuestion?.difficulty === 'easy' ? "bg-emerald-500/10 text-emerald-500" :
                    selectedQuestion?.difficulty === 'medium' ? "bg-amber-500/10 text-amber-500" :
                    "bg-rose-500/10 text-rose-500"
                  )}>
                    {selectedQuestion?.difficulty}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold border-primary/20 text-primary">
                    {selectedQuestion?.category?.name}
                  </Badge>
                </div>
                <h2 className="text-2xl font-black tracking-tight">{selectedQuestion?.title}</h2>
              </div>
              <div className="flex gap-2">
                 <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 rounded-full border-border/50 hover:bg-background"
                    onClick={() => {
                        setIsDetailsOpen(false);
                        navigate(`/administrator/questions/edit/${selectedQuestion?.id}`);
                    }}
                 >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                 </Button>
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-8 pb-20">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="h-4 w-4" />
                <h3 className="text-sm font-bold uppercase tracking-widest">Question Context</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {selectedQuestion?.description}
              </div>
            </div>

            {selectedQuestion?.starter_code && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-500">
                    <Code2 className="h-4 w-4" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Starter Code</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] uppercase font-bold"
                    onClick={() => {
                        navigator.clipboard.writeText(selectedQuestion.starter_code);
                        toast.success('Starter code copied!');
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
                <div className="group relative">
                  <pre className="bg-slate-950 text-slate-200 p-5 rounded-xl overflow-x-auto text-[13px] font-mono border border-slate-800 leading-relaxed shadow-inner">
                    {selectedQuestion?.starter_code}
                  </pre>
                </div>
              </div>
            )}

            {selectedQuestion?.solution && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-500">Official Solution</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-7 text-[10px] uppercase font-bold text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/5"
                    onClick={() => {
                        navigator.clipboard.writeText(selectedQuestion.solution);
                        toast.success('Solution copied!');
                    }}
                  >
                    <Copy className="h-3 w-3 mr-1" /> Copy
                  </Button>
                </div>
                <div className="group relative">
                  <pre className="bg-slate-950 text-emerald-50/90 p-5 rounded-xl overflow-x-auto text-[13px] font-mono border border-emerald-900/20 leading-relaxed shadow-inner">
                    {selectedQuestion?.solution}
                  </pre>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-muted/30 p-4 rounded-xl flex items-center gap-4 border border-border/50">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border/50">
                  <History className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Registered On</p>
                  <p className="text-sm font-bold text-foreground">
                    {selectedQuestion && new Date(selectedQuestion.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl flex items-center gap-4 border border-border/50">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border/50">
                  <Trophy className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Level Rank</p>
                  <p className="text-sm font-bold text-foreground capitalize">{selectedQuestion?.difficulty}</p>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-border/50">
                <Button 
                    variant="destructive" 
                    className="w-full font-bold h-11 rounded-xl shadow-lg shadow-destructive/10"
                    onClick={() => {
                        setIsDetailsOpen(false);
                        openDeleteDialog(selectedQuestion);
                    }}
                >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete This Question
                </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

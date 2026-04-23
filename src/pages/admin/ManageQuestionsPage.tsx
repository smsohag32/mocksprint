import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetQuestionsQuery, 
  useDeleteQuestionMutation,
} from "@/api/endpoints/question.api";
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
  Loader2,
  AlertCircle,
  FileQuestion,
  Filter
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
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ManageQuestionsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);

  const { data: questions, isLoading } = useGetQuestionsQuery({ search: searchTerm });
  const [deleteQuestion, { isLoading: isDeleting }] = useDeleteQuestionMutation();

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

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground text-sm">Review and manage all practice questions.</p>
        </div>
        <Button 
          onClick={() => navigate('/admin/questions/add')}
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
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer">
                          {q.title}
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
                          <DropdownMenuItem className="cursor-pointer">
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
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
    </div>
  );
}

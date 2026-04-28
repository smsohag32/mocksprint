import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, BookOpen, Target, Sparkles, ChevronRight, Clock, Trophy, Loader2, Shuffle, Play } from 'lucide-react';
import { useGetQuestionsQuery } from "@/api/endpoints/question.api";
import { useGetCategoriesQuery } from "@/api/endpoints/questionCategory.api";
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const categories = ['all', 'frontend', 'backend', 'dsa', 'system_design'] as const;
const difficulties = ['all', 'easy', 'medium', 'hard'] as const;

export default function QuestionsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const { data: questions, isLoading } = useGetQuestionsQuery();
  const { data: categoriesData } = useGetCategoriesQuery({ status: 'active' });

  const filtered = questions?.filter((q) => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase()) || 
                          q.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || q.categoryId === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const handleShuffle = () => {
    if (!filtered || filtered.length === 0) return toast.error("No matches to shuffle");
    const randomQ = filtered[Math.floor(Math.random() * filtered.length)];
    navigate(`/interview?q=${randomQ.id}`);
  };

  const categories = categoriesData?.categories || [];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border/50 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-sm">
            <Sparkles className="h-4 w-4" />
            <span>Master Your Skills</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Question Bank</h1>
          <p className="text-muted-foreground max-w-xl">
            A curated collection of professional coding challenges, from system design to data structures.
          </p>
        </div>
        <Button 
          onClick={handleShuffle}
          className="gradient-primary text-white font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all h-12 px-6"
        >
          <Shuffle className="h-4 w-4 mr-2" />
          Random Challenge
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="space-y-6 lg:sticky lg:top-6 h-fit">
          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Search Challenges</Label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Title, description..." 
                className="pl-10 bg-muted/30 border-border/50 focus:bg-background transition-all" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Filter by Category</Label>
            <div className="flex flex-col gap-1">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "justify-start h-9 px-3 text-xs font-bold transition-all",
                  selectedCategory === 'all' ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                All Categories
              </Button>
              {categories.map((c: any) => (
                <Button 
                  key={c.id} 
                  variant="ghost" 
                  onClick={() => setSelectedCategory(c.id)}
                  className={cn(
                    "justify-start h-9 px-3 text-xs font-bold transition-all",
                    selectedCategory === c.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">Difficulty Level</Label>
            <div className="flex flex-wrap gap-2">
              {['all', 'easy', 'medium', 'hard'].map((d) => (
                <Button 
                    key={d} 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedDifficulty(d)} 
                    className={cn(
                        "capitalize text-[10px] font-black h-8 px-3 rounded-full border-border/50",
                        selectedDifficulty === d ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-transparent"
                    )}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
             <p className="text-xs font-bold text-muted-foreground">
               Showing <span className="text-foreground">{filtered?.length || 0}</span> challenges
             </p>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-border/50 overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="h-40 w-full" />
                    <div className="p-6 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filtered?.length ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {filtered.map((q) => (
                <Link to={`/interview?q=${q.id}`} key={q.id}>
                  <Card className="group border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 overflow-hidden relative bg-card/50 backdrop-blur-sm h-full flex flex-col">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <div className="h-10 w-10 rounded-full gradient-primary text-white flex items-center justify-center shadow-lg">
                            <Play className="h-5 w-5 fill-current" />
                        </div>
                    </div>
                    
                    <CardContent className="p-8 space-y-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn(
                          "text-[9px] uppercase font-black px-2 py-0.5",
                          q.difficulty === 'easy' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          q.difficulty === 'medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-rose-500/10 text-rose-500 border-rose-500/20"
                        )}>
                          {q.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold border-primary/20 text-primary">
                          {q.category?.name}
                        </Badge>
                      </div>

                      <div className="space-y-2 flex-1">
                        <h3 className="text-xl font-black tracking-tight group-hover:text-primary transition-colors">{q.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                          {q.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-border/30 mt-auto">
                        <div className="flex items-center gap-4 text-muted-foreground/60">
                           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
                              <Trophy className="h-3 w-3" /> 120 Solved
                           </div>
                           <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-tighter">
                              <Clock className="h-3 w-3" /> 25 Min
                           </div>
                        </div>
                        <div className="text-primary font-black text-xs flex items-center group-hover:gap-1 transition-all uppercase tracking-widest">
                           Practice <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 text-center">
              <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30 mb-2">
                <Search className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold">No results found</h3>
                <p className="text-muted-foreground text-sm max-w-xs">We couldn't find any challenges matching your filters. Try adjusting your search.</p>
              </div>
              <Button variant="outline" onClick={() => { setSearch(''); setSelectedCategory('all'); setSelectedDifficulty('all'); }}>
                Reset All Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

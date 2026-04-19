import { useState } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { useGetQuestionsQuery } from "@/api/endpoints/question.api";
import { Link } from 'react-router-dom';

const categories = ['all', 'frontend', 'backend', 'dsa', 'system_design'] as const;
const difficulties = ['all', 'easy', 'medium', 'hard'] as const;

export default function QuestionsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');

  const { data: questions, isLoading } = useGetQuestionsQuery({
    category: category === 'all' ? undefined : category,
    difficulty: difficulty === 'all' ? undefined : difficulty,
  });

  const filtered = questions?.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase()) ||
    q.description.toLowerCase().includes(search.toLowerCase())
  );

  const difficultyColor = (d: string) =>
    d === 'easy' ? 'bg-success/10 text-success border-success/20' :
    d === 'medium' ? 'bg-warning/10 text-warning border-warning/20' :
    'bg-destructive/10 text-destructive border-destructive/20';

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Question Bank</h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search questions..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {difficulties.map((d) => (
              <Button key={d} variant={difficulty === d ? 'default' : 'outline'} size="sm" onClick={() => setDifficulty(d)} className="capitalize">
                {d}
              </Button>
            ))}
          </div>
        </div>

        <Tabs value={category} onValueChange={setCategory}>
          <TabsList>
            {categories.map((c) => (
              <TabsTrigger key={c} value={c} className="capitalize">
                {c === 'system_design' ? 'System Design' : c === 'dsa' ? 'DSA' : c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="border-border/50">
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((q) => (
              <Card key={q.id} className="border-border/50 hover:shadow-lg transition-all hover:-translate-y-0.5">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-base">{q.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{q.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge className={difficultyColor(q.difficulty)}>{q.difficulty}</Badge>
                      <Badge variant="outline" className="capitalize">{q.category.replace('_', ' ')}</Badge>
                    </div>
                    <Link to={`/interview?q=${q.id}`}>
                      <Button size="sm" variant="ghost" className="text-primary">Practice</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No questions found.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

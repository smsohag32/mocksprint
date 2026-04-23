import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Code2, Trophy, History, Target, ArrowRight } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useGetHistoryQuery, useGetSubmissionsQuery } from "@/api/endpoints/interview.api";
import { useGetLeaderboardQuery } from "@/api/endpoints/leaderboard.api";
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: history, isLoading: histLoading } = useGetHistoryQuery();
  const { data: submissions } = useGetSubmissionsQuery();
  const { data: leaderboard } = useGetLeaderboardQuery();

  const totalAttempts = history?.length || 0;
  const completed = history?.filter((h) => h.status === 'completed').length || 0;
  const avgScore = submissions?.length
    ? Math.round(submissions.reduce((a, s) => a + s.score, 0) / submissions.length)
    : 0;
  const myRank = leaderboard?.findIndex((l) => l.user_id === user?.id);

  const stats = [
    { label: 'Total Attempts', value: totalAttempts, icon: Target, color: 'text-primary' },
    { label: 'Completed', value: completed, icon: History, color: 'text-success' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: Trophy, color: 'text-warning' },
    { label: 'Rank', value: myRank !== undefined && myRank >= 0 ? `#${myRank + 1}` : '-', icon: Trophy, color: 'text-info' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || 'Developer'} 👋</h1>
          <p className="text-muted-foreground">Ready to practice today?</p>
        </div>
        <Link to="/interview">
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Code2 className="h-4 w-4" /> Start Interview <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`${stat.color}`}>
                <stat.icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{histLoading ? <Skeleton className="h-7 w-12" /> : stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent activity + leaderboard preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Recent Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            {histLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : history?.length ? (
              <div className="space-y-3">
                {history.slice(0, 5).map((h: any) => (
                  <div key={h.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                    <div>
                      <p className="font-medium text-sm">{h.questions?.title || 'Interview'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(h.started_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={h.status === 'completed' ? 'default' : 'secondary'}>
                      {h.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No interviews yet. Start your first one!</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Leaderboard</CardTitle>
            <Link to="/leaderboard">
              <Button variant="ghost" size="sm">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {leaderboard?.length ? (
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((entry: any, i: number) => (
                  <div key={entry.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                    <span className={`text-lg font-bold ${i < 3 ? 'gradient-text' : 'text-muted-foreground'}`}>
                      #{i + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{entry.profiles?.name || 'Anonymous'}</p>
                    </div>
                    <Badge variant="outline">{entry.total_score} pts</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No entries yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

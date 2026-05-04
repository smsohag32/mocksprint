import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Code2, Trophy, History, Target, ArrowRight, TrendingUp, Star, Award } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useGetHistoryQuery } from "@/api/endpoints/interview.api";
import { useGetUserStatsQuery } from "@/api/endpoints/dashboard.api";
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const { data: history, isLoading: histLoading } = useGetHistoryQuery();
  const { data: statsData, isLoading: statsLoading } = useGetUserStatsQuery();

  const stats = [
    { 
      label: 'Total Attempts', 
      value: statsData?.stats?.totalAttempts || 0, 
      icon: Target, 
      color: 'text-primary',
      bg: 'bg-primary/10',
      description: 'Your interview journey'
    },
    { 
      label: 'Completed', 
      value: statsData?.stats?.totalCompleted || 0, 
      icon: Award, 
      color: 'text-success',
      bg: 'bg-success/10',
      description: 'Challenges conquered'
    },
    { 
      label: 'Avg Score', 
      value: `${statsData?.stats?.averageScore || 0}%`, 
      icon: Star, 
      color: 'text-warning',
      bg: 'bg-warning/10',
      description: 'Performance quality'
    },
    { 
      label: 'Consistency', 
      value: `${statsData?.recentActivity?.length || 0}/7`, 
      icon: History, 
      color: 'text-info',
      bg: 'bg-info/10',
      description: 'Active days this week'
    },
  ];

  if (statsLoading || histLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'Developer'} 👋</h1>
          <p className="text-muted-foreground text-lg">You've completed {statsData?.stats?.totalCompleted} interviews so far. Keep it up!</p>
        </div>
        <Link to="/questions">
          <Button className="gradient-primary text-primary-foreground px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-primary/20 transition-all gap-2 group">
            <Code2 className="h-5 w-5" /> 
            Start New Practice 
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 hover:border-primary/20 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Score Progression</CardTitle>
                <CardDescription>Performance over your last 10 interviews</CardDescription>
              </div>
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={statsData?.scoreProgression}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    hide
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-xl">
                            <p className="text-sm font-bold text-foreground mb-1">{payload[0].payload.title}</p>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary/20 text-primary hover:bg-primary/20 border-none">
                                Score: {payload[0].value}%
                              </Badge>
                              <span className="text-xs text-muted-foreground">{payload[0].payload.date}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                    strokeWidth={3} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Skill Distribution</CardTitle>
            <CardDescription>Average performance across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-center justify-center">
              {statsData?.skillDistribution?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={statsData?.skillDistribution}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.4}
                    />
                    <Tooltip 
                       content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                             return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm text-xs font-medium">
                                   {payload[0].payload.subject}: {payload[0].value}%
                                </div>
                             );
                          }
                          return null;
                       }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-muted-foreground space-y-2">
                  <Trophy className="h-10 w-10 mx-auto opacity-20" />
                  <p>Complete more interviews to see your skill map.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity + Leaderboard */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Practice History</CardTitle>
              <CardDescription>Your latest interview sessions</CardDescription>
            </div>
            <Link to="/history">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">View all</Button>
            </Link>
          </CardHeader>
          <CardContent>
            {history?.length ? (
              <div className="space-y-4">
                {history.slice(0, 4).map((h) => (
                  <div key={h.id} className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${h.status === 'completed' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                        <Code2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm group-hover:text-primary transition-colors">{h.question?.title || 'Practice Session'}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(h.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {h.score !== null && (
                        <div className="text-right">
                          <p className="text-sm font-bold">{h.score}%</p>
                          <p className="text-[10px] text-muted-foreground">Score</p>
                        </div>
                      )}
                      <Badge variant={h.status === 'completed' ? 'default' : 'secondary'} className={h.status === 'completed' ? 'bg-success hover:bg-success text-success-foreground' : ''}>
                        {h.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 space-y-4">
                <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                   <History className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No sessions yet. Ready for your first challenge?</p>
                <Link to="/questions">
                  <Button variant="outline">Browse Questions</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-primary/5 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Trophy className="h-5 w-5 text-warning" />
               Daily Tip
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground leading-relaxed">
                Consistency is key! Users who practice at least 3 times a week see a 40% improvement in their scores within the first month.
             </p>
             <div className="p-4 rounded-xl bg-background border border-primary/20 space-y-2">
                <p className="text-xs font-bold text-primary uppercase">Recommended Next</p>
                <p className="text-sm font-medium line-clamp-1">Arrays & Hashing: Two Sum</p>
                <Link to="/questions">
                  <Button size="sm" className="w-full mt-2" variant="secondary">Go to question</Button>
                </Link>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

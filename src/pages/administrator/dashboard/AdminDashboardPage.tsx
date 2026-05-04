import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileQuestion, Trophy, BarChart3, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useGetAdminStatsQuery } from "@/api/endpoints/dashboard.api";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
   const { data, isLoading } = useGetAdminStatsQuery();

   const stats = [
      { 
         label: "Total Users", 
         value: data?.stats?.totalUsers || 0, 
         icon: Users, 
         color: "text-primary",
         bg: "bg-primary/10",
         trend: "+12%",
         isPositive: true
      },
      {
         label: "Total Questions",
         value: data?.stats?.totalQuestions || 0,
         icon: FileQuestion,
         color: "text-success",
         bg: "bg-success/10",
         trend: "+5%",
         isPositive: true
      },
      {
         label: "Interviews",
         value: data?.stats?.totalInterviews || 0,
         icon: BarChart3,
         color: "text-info",
         bg: "bg-info/10",
         trend: "+18%",
         isPositive: true
      },
      { 
         label: "Active Users", 
         value: data?.stats?.activeNow || 0, 
         icon: Trophy, 
         color: "text-warning", 
         bg: "bg-warning/10",
         trend: "Live",
         isPositive: true
      },
   ];

   const COLORS = ['hsl(var(--primary))', 'hsl(var(--success))', 'hsl(var(--info))', 'hsl(var(--warning))', 'hsl(var(--destructive))'];

   if (isLoading) {
      return (
         <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
               <Skeleton className="h-10 w-48" />
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
      <div className="space-y-6 animate-fade-in">
         <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
            <p className="text-muted-foreground">Monitor system performance and user engagement.</p>
         </div>

         {/* Stats Grid */}
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
               <Card key={s.label} className="border-border/50 overflow-hidden relative">
                  <div className={`absolute top-0 left-0 w-1 h-full ${s.color.replace('text-', 'bg-')}`} />
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${s.bg}`}>
                           <s.icon className={`h-6 w-6 ${s.color}`} />
                        </div>
                        <div className={`flex items-center gap-1 text-xs font-medium ${s.isPositive ? 'text-success' : 'text-destructive'}`}>
                           {s.trend}
                           {s.trend !== 'Live' && (s.isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />)}
                        </div>
                     </div>
                     <div className="mt-4">
                        <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
                        <p className="text-3xl font-bold">{s.value}</p>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         {/* Charts Row 1 */}
         <div className="grid gap-6 lg:grid-cols-7">
            <Card className="lg:col-span-4 border-border/50">
               <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations over the last 30 days.</CardDescription>
               </CardHeader>
               <CardContent className="pl-2">
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data?.userGrowth}>
                           <defs>
                              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                           <XAxis 
                              dataKey="date" 
                              stroke="hsl(var(--muted-foreground))" 
                              fontSize={12} 
                              tickLine={false} 
                              axisLine={false}
                              tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                           />
                           <YAxis 
                              stroke="hsl(var(--muted-foreground))" 
                              fontSize={12} 
                              tickLine={false} 
                              axisLine={false} 
                           />
                           <Tooltip 
                              content={({ active, payload }) => {
                                 if (active && payload && payload.length) {
                                    return (
                                       <div className="rounded-lg border bg-background p-2 shadow-sm">
                                          <div className="grid grid-cols-2 gap-2">
                                             <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                                                <span className="font-bold text-muted-foreground">{payload[0].payload.date}</span>
                                             </div>
                                             <div className="flex flex-col">
                                                <span className="text-[0.70rem] uppercase text-muted-foreground">Users</span>
                                                <span className="font-bold text-primary">{payload[0].value}</span>
                                             </div>
                                          </div>
                                       </div>
                                    );
                                 }
                                 return null;
                              }}
                           />
                           <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorCount)" strokeWidth={2} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </CardContent>
            </Card>

            <Card className="lg:col-span-3 border-border/50">
               <CardHeader>
                  <CardTitle>Category Distribution</CardTitle>
                  <CardDescription>Questions breakdown by category.</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="h-[300px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie
                              data={data?.categoryDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="count"
                           >
                              {data?.categoryDistribution?.map((_, index) => (
                                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                           </Pie>
                           <Tooltip 
                              content={({ active, payload }) => {
                                 if (active && payload && payload.length) {
                                    return (
                                       <div className="rounded-lg border bg-background p-2 shadow-sm">
                                          <div className="flex flex-col">
                                             <span className="text-[0.70rem] uppercase text-muted-foreground">{payload[0].name}</span>
                                             <span className="font-bold" style={{ color: payload[0].payload.fill }}>{payload[0].value} Questions</span>
                                          </div>
                                       </div>
                                    );
                                 }
                                 return null;
                              }}
                           />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-4">
                     {data?.categoryDistribution?.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-1.5">
                           <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                           <span className="text-xs text-muted-foreground">{entry.name}</span>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Charts Row 2 */}
         <Card className="border-border/50">
            <CardHeader>
               <div className="flex items-center justify-between">
                  <div>
                     <CardTitle>Interview Activity</CardTitle>
                     <CardDescription>Number of interviews conducted over the last 7 days.</CardDescription>
                  </div>
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
               </div>
            </CardHeader>
            <CardContent>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={data?.interviewActivity}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis 
                           dataKey="date" 
                           stroke="hsl(var(--muted-foreground))" 
                           fontSize={12} 
                           tickLine={false} 
                           axisLine={false}
                           tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                        />
                        <YAxis 
                           stroke="hsl(var(--muted-foreground))" 
                           fontSize={12} 
                           tickLine={false} 
                           axisLine={false} 
                        />
                        <Tooltip 
                           cursor={{fill: 'hsl(var(--muted) / 0.2)'}}
                           content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                 return (
                                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                                       <span className="text-[0.70rem] uppercase text-muted-foreground">{new Date(payload[0].payload.date).toLocaleDateString()}</span>
                                       <div className="font-bold text-info">{payload[0].value} Interviews</div>
                                    </div>
                                 );
                              }
                              return null;
                           }}
                        />
                        <Bar dataKey="count" fill="hsl(var(--info))" radius={[4, 4, 0, 0]} barSize={40} />
                     </BarChart>
                  </ResponsiveContainer>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}

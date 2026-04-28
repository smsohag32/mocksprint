import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileQuestion, Trophy, BarChart3 } from "lucide-react";
import { useGetAllUsersQuery } from "@/api/endpoints/user.api";
import { useGetQuestionsQuery } from "@/api/endpoints/question.api";
import { useGetLeaderboardQuery } from "@/api/endpoints/leaderboard.api";

export default function AdminDashboardPage() {
   const { data: users } = useGetAllUsersQuery();
   const { data: questions } = useGetQuestionsQuery();
   const { data: leaderboard } = useGetLeaderboardQuery();

   const stats = [
      { label: "Total Users", value: users?.length || 0, icon: Users, color: "text-primary" },
      {
         label: "Questions",
         value: questions?.length || 0,
         icon: FileQuestion,
         color: "text-success",
      },
      {
         label: "Leaderboard Entries",
         value: leaderboard?.length || 0,
         icon: Trophy,
         color: "text-warning",
      },
      { label: "Active Today", value: "-", icon: BarChart3, color: "text-info" },
   ];

   return (
      <div className="space-y-6 animate-fade-in">
         <h1 className="text-2xl font-bold">Admin Dashboard</h1>
         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
               <Card
                  key={s.label}
                  className="border-border/50">
                  <CardContent className="flex items-center gap-4 p-6">
                     <s.icon className={`h-8 w-8 ${s.color}`} />
                     <div>
                        <p className="text-sm text-muted-foreground">{s.label}</p>
                        <p className="text-2xl font-bold">{s.value}</p>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
}

import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy } from "lucide-react";

import { useAppSelector } from "@/store/hooks";
import { useGetLeaderboardQuery } from "@/api/endpoints/leaderboard.api";

export default function LeaderboardPage() {
   const { data: leaderboard, isLoading } = useGetLeaderboardQuery();
   const user = useAppSelector((s) => s.auth.user);

   return (
      <div className="space-y-6 animate-fade-in">
         <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-warning" /> Leaderboard
         </h1>

         <Card className="border-border/50">
            <CardContent className="p-0">
               {isLoading ? (
                  <div className="p-6 space-y-4">
                     {[1, 2, 3, 4, 5].map((i) => (
                        <Skeleton
                           key={i}
                           className="h-14 w-full"
                        />
                     ))}
                  </div>
               ) : leaderboard?.length ? (
                  <div className="divide-y divide-border">
                     {leaderboard.map((entry: any, i: number) => {
                        const isMe = entry.user_id === user?.id;
                        return (
                           <div
                              key={entry.id}
                              className={`flex items-center gap-4 p-4 ${isMe ? "bg-primary/5" : ""}`}>
                              <span
                                 className={`w-8 text-center font-bold text-lg ${i < 3 ? "gradient-text" : "text-muted-foreground"}`}>
                                 {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                              </span>
                              <Avatar className="h-10 w-10">
                                 <AvatarFallback
                                    className={
                                       i < 3 ? "gradient-primary text-primary-foreground" : ""
                                    }>
                                    {(entry.profiles?.name || "A").charAt(0).toUpperCase()}
                                 </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                 <p className="font-medium">
                                    {entry.profiles?.name || "Anonymous"}
                                    {isMe && (
                                       <Badge
                                          className="ml-2"
                                          variant="secondary">
                                          You
                                       </Badge>
                                    )}
                                 </p>
                                 <p className="text-xs text-muted-foreground">
                                    {entry.profiles?.email}
                                 </p>
                              </div>
                              <Badge
                                 variant="outline"
                                 className="text-base font-bold">
                                 {entry.total_score} pts
                              </Badge>
                           </div>
                        );
                     })}
                  </div>
               ) : (
                  <p className="text-center text-muted-foreground py-12">
                     No entries yet. Be the first!
                  </p>
               )}
            </CardContent>
         </Card>
      </div>
   );
}

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useGetHistoryQuery } from "@/api/endpoints/interview.api";
import { useAppSelector } from "@/store/hooks";
import Editor from "@monaco-editor/react";
import { Clock, Trophy, Eye, Target, CalendarDays, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { data: history, isLoading } = useGetHistoryQuery();
  const themeMode = useAppSelector((s) => s.theme.mode);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);

  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-muted-foreground";
    if (score >= 80) return "text-emerald-500";
    if (score >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  const getScoreBg = (score: number | null) => {
    if (score === null) return "bg-muted";
    if (score >= 80) return "bg-emerald-500/10 border-emerald-500/20 text-emerald-500";
    if (score >= 50) return "bg-amber-500/10 border-amber-500/20 text-amber-500";
    return "bg-rose-500/10 border-rose-500/20 text-rose-500";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold">Interview History</h1>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : history?.length ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {history.map((h: any) => (
            <Card key={h.id} className="border-border/50 hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
              <div className={cn("absolute top-0 left-0 w-1 h-full", getScoreBg(h.score).split(' ')[0])} />
              <CardContent className="p-5 flex flex-col flex-1 gap-4">
                <div className="flex justify-between items-start gap-2">
                   <div>
                     <p className="font-bold line-clamp-1 group-hover:text-primary transition-colors" title={h.question?.title}>
                       {h.question?.title || 'Interview Session'}
                     </p>
                     <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3" />
                        {new Date(h.createdAt).toLocaleDateString()}
                     </div>
                   </div>
                   <Badge variant={h.status === 'completed' ? 'default' : h.status === 'abandoned' ? 'destructive' : 'secondary'} className="capitalize shadow-sm">
                     {h.status}
                   </Badge>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                   <div className="flex items-center gap-4">
                      {h.score !== null ? (
                         <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Score</span>
                            <span className={cn("font-black text-xl tabular-nums", getScoreColor(h.score))}>{h.score}%</span>
                         </div>
                      ) : (
                         <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Score</span>
                            <span className="font-bold text-muted-foreground/50">N/A</span>
                         </div>
                      )}
                      
                      {h.status === "completed" && (
                         <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Time</span>
                            <span className="font-bold text-sm flex items-center gap-1">
                               <Clock className="h-3 w-3" /> 
                               {Math.round((new Date(h.updatedAt).getTime() - new Date(h.createdAt).getTime()) / 60000)}m
                            </span>
                         </div>
                      )}
                   </div>
                   <Button size="sm" variant="ghost" className="hover:bg-primary/10 hover:text-primary rounded-full px-3" onClick={() => setSelectedInterview(h)}>
                      <Eye className="h-4 w-4 mr-2" /> View
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-border/50">
          <CardContent className="text-center py-16 flex flex-col items-center justify-center">
             <Target className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <p className="text-lg font-bold text-muted-foreground">No practice history yet.</p>
            <p className="text-sm text-muted-foreground/70">Start your first interview session to see your progress here.</p>
          </CardContent>
        </Card>
      )}

      {/* Details Modal */}
      <Dialog open={!!selectedInterview} onOpenChange={(open) => !open && setSelectedInterview(null)}>
         <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-border/50 shadow-2xl">
            {selectedInterview && (
               <>
                  <DialogHeader className="p-6 pb-0">
                     <div className="flex justify-between items-start">
                        <div>
                           <DialogTitle className="text-2xl font-black">
                              {selectedInterview.question?.title || "Session Details"}
                           </DialogTitle>
                           <DialogDescription className="mt-1 flex items-center gap-3">
                              <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3"/> {new Date(selectedInterview.createdAt).toLocaleString()}</span>
                              {selectedInterview.question?.category?.name && (
                                 <Badge variant="outline" className="text-[10px] uppercase">{selectedInterview.question.category.name}</Badge>
                              )}
                           </DialogDescription>
                        </div>
                        <div className="text-right">
                           <Badge variant={selectedInterview.status === 'completed' ? 'default' : selectedInterview.status === 'abandoned' ? 'destructive' : 'secondary'} className="capitalize text-sm px-3 py-1">
                              {selectedInterview.status}
                           </Badge>
                        </div>
                     </div>
                  </DialogHeader>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     {/* Stats Row */}
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Card className="border-border/50 bg-muted/20">
                           <CardContent className="p-4 flex items-center gap-4">
                              <div className={cn("p-3 rounded-full", getScoreBg(selectedInterview.score))}>
                                 <Trophy className="h-5 w-5" />
                              </div>
                              <div>
                                 <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Final Score</p>
                                 <p className={cn("text-2xl font-black", getScoreColor(selectedInterview.score))}>
                                    {selectedInterview.score !== null ? `${selectedInterview.score}%` : 'N/A'}
                                 </p>
                              </div>
                           </CardContent>
                        </Card>
                        
                        {selectedInterview.status === 'completed' && (
                           <Card className="border-border/50 bg-muted/20">
                              <CardContent className="p-4 flex items-center gap-4">
                                 <div className="p-3 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                    <Clock className="h-5 w-5" />
                                 </div>
                                 <div>
                                    <p className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Time Taken</p>
                                    <p className="text-2xl font-black">
                                       {Math.round((new Date(selectedInterview.updatedAt).getTime() - new Date(selectedInterview.createdAt).getTime()) / 60000)}<span className="text-sm font-bold text-muted-foreground ml-1">min</span>
                                    </p>
                                 </div>
                              </CardContent>
                           </Card>
                        )}
                     </div>

                     {/* Description */}
                     {selectedInterview.question?.description && (
                        <div className="space-y-2">
                           <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                              <Target className="h-4 w-4" /> Requirements
                           </h3>
                           <Card className="border-border/50 bg-card">
                              <CardContent className="p-4">
                                 <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
                                    {selectedInterview.question.description}
                                 </p>
                              </CardContent>
                           </Card>
                        </div>
                     )}

                     {/* Code Submission */}
                     <div className="space-y-2 flex-1 flex flex-col min-h-[400px]">
                        <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                           <Code2 className="h-4 w-4" /> Submitted Code
                        </h3>
                        <Card className="border-border/50 overflow-hidden flex-1 shadow-inner relative group">
                           <div className="absolute top-0 right-0 p-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Badge variant="outline" className="bg-background/80 backdrop-blur-md text-[10px] uppercase font-bold">
                                 Read Only
                              </Badge>
                           </div>
                           <CardContent className="p-0 h-full min-h-[400px]">
                              <Editor
                                 height="400px"
                                 defaultLanguage="javascript"
                                 theme={themeMode === "dark" ? "vs-dark" : "light"}
                                 value={selectedInterview.code || "// No code submitted"}
                                 options={{
                                    readOnly: true,
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: "on",
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    padding: { top: 20 },
                                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                 }}
                              />
                           </CardContent>
                        </Card>
                     </div>
                  </div>
               </>
            )}
         </DialogContent>
      </Dialog>
    </div>
  );
}

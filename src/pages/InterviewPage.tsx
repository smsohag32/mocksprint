import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
   DialogFooter,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
   Play,
   RotateCcw,
   Send,
   Timer,
   Zap,
   AlertTriangle,
   Shuffle,
   Filter,
   Target,
   Loader2,
   Trophy,
   XCircle,
   ArrowRight,
   LayoutDashboard,
   Sparkles,
   Lightbulb,
   MessageSquare,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useGetQuestionsQuery } from "@/api/endpoints/question.api";
import { useGetCategoriesQuery } from "@/api/endpoints/questionCategory.api";
import {
   useStartInterviewMutation,
   useSubmitInterviewMutation,
   useGetHintMutation,
} from "@/api/endpoints/interview.api";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function InterviewPage() {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const themeMode = useAppSelector((s) => s.theme.mode);
   const { data: questions, isLoading } = useGetQuestionsQuery();
   const { data: categoriesData } = useGetCategoriesQuery({ status: "active" });
   const [startInterview] = useStartInterviewMutation();
   const [submitInterview] = useSubmitInterviewMutation();

   const [filters, setFilters] = useState({ categoryId: "all", difficulty: "all" });
   const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
   const [code, setCode] = useState("");
   const [interviewId, setInterviewId] = useState<string | null>(null);
   const [isRunning, setIsRunning] = useState(false);
   const [timeLeft, setTimeLeft] = useState(1800);
   const [pressureMode, setPressureMode] = useState(false);
   const [isEvaluating, setIsEvaluating] = useState(false);
   const [submissionResult, setSubmissionResult] = useState<{ 
      score: number; 
      feedback?: string; 
      interviewerMessage?: string;
   } | null>(null);
   const [getHint, { isLoading: isHintLoading }] = useGetHintMutation();
   const [hints, setHints] = useState<string[]>([]);

   // Auto-load question from URL query ?q=...
   useEffect(() => {
      if (questions && questions.length > 0) {
         const qId = searchParams.get("q");
         if (qId) {
            const q = questions.find((item: any) => item.id === qId);
            if (q) {
               setSelectedQuestion(q);
               setCode(q.starter_code || "// Start coding here\n");
            }
         }
      }
   }, [questions, searchParams]);

   useEffect(() => {
      if (!isRunning) return;
      const interval = setInterval(() => {
         setTimeLeft((prev) => {
            if (prev <= 0) {
               setIsRunning(false);
               toast.error("Time's up!");
               return 0;
            }
            return prev - 1;
         });
      }, 1000);
      return () => clearInterval(interval);
   }, [isRunning]);

   useEffect(() => {
      if (!pressureMode || !isRunning) return;
      const interval = setInterval(
         () => {
            const alerts = [
               "⏰ Time is running out!",
               "👀 The interviewer is watching...",
               "💡 Have you considered edge cases?",
               "🔥 Other candidates solved this faster!",
               "🤔 Are you sure about that approach?",
            ];
            toast.warning(alerts[Math.floor(Math.random() * alerts.length)]);
         },
         30000 + Math.random() * 30000,
      );
      return () => clearInterval(interval);
   }, [pressureMode, isRunning]);

   const handleStart = async () => {
      if (!selectedQuestion) return toast.error("Select a question first");
      try {
         const result = await startInterview({ question_id: selectedQuestion.id }).unwrap();
         setInterviewId(result.id);
         setCode(selectedQuestion.starter_code || "// Start coding here\n");
         setTimeLeft(1800);
         setIsRunning(true);
         setHints([]); // Clear previous hints
         toast.success("Interview started!");
      } catch {
         toast.error("Failed to start interview");
      }
   };

   const handleSubmit = async () => {
      if (!interviewId || !selectedQuestion) return;
      setIsRunning(false);
      setIsEvaluating(true);
      try {
         const result = await submitInterview({
            id: interviewId,
            code,
         }).unwrap();
         setSubmissionResult({ 
            score: result.score, 
            feedback: result.feedback, 
            interviewerMessage: result.interviewerMessage 
         });
         toast.success("Solution evaluated successfully!");
         setInterviewId(null);
      } catch {
         toast.error("Evaluation failed");
         setIsRunning(true);
      } finally {
         setIsEvaluating(false);
      }
   };

   const handleGetHint = async () => {
      if (!interviewId) return;
      try {
         const result = await getHint({ id: interviewId, code }).unwrap();
         if (result.hint) {
            setHints(prev => [...prev, result.hint]);
            toast("New Hint Received!", {
               icon: <Lightbulb className="h-4 w-4 text-amber-500" />,
               description: result.hint,
               duration: 10000,
            });
         } else if (result.error) {
            toast.error(result.error);
         }
      } catch (err: any) {
         toast.error("Failed to connect to AI service");
      }
   };

   const handleReset = () => {
      setCode(selectedQuestion?.starter_code || "");
   };

   const filteredQuestions =
      questions?.filter((q: any) => {
         const catMatch = filters.categoryId === "all" || q.categoryId === filters.categoryId;
         const diffMatch = filters.difficulty === "all" || q.difficulty === filters.difficulty;
         return catMatch && diffMatch;
      }) || [];

   const handleShuffle = () => {
      if (filteredQuestions.length === 0) return toast.error("No questions match your filters");
      const randomQ = filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
      setSelectedQuestion(randomQ);
      setCode(randomQ.starter_code || "");
   };

   const formatTime = (s: number) => {
      const m = Math.floor(s / 60);
      const sec = s % 60;
      return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
   };

   return (
      <div className="space-y-4 animate-fade-in">
         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold">Interview Practice</h1>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <Switch
                     id="pressure"
                     checked={pressureMode}
                     onCheckedChange={setPressureMode}
                  />
                  <Label
                     htmlFor="pressure"
                     className="flex items-center gap-1 text-sm">
                     <Zap className="h-4 w-4 text-warning" /> Pressure Mode
                  </Label>
               </div>
               <Badge
                  variant={isRunning ? "default" : "secondary"}
                  className="text-lg px-3 py-1 font-mono">
                  <Timer className="h-4 w-4 mr-1" /> {formatTime(timeLeft)}
               </Badge>
            </div>
         </div>

         <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-1 space-y-6">
               <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                     <div className="flex items-center gap-2 text-primary">
                        <Filter className="h-4 w-4" />
                        <CardTitle className="text-sm font-black uppercase tracking-widest">
                           Filters
                        </CardTitle>
                     </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">
                           Category
                        </Label>
                        <Select
                           value={filters.categoryId}
                           onValueChange={(v) => setFilters({ ...filters, categoryId: v })}>
                           <SelectTrigger className="h-9 bg-background/50">
                              <SelectValue placeholder="All Categories" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categoriesData?.categories?.map((cat: any) => (
                                 <SelectItem
                                    key={cat.id}
                                    value={cat.id}>
                                    {cat.name}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                     <div className="space-y-2">
                        <Label className="text-xs font-bold uppercase text-muted-foreground">
                           Difficulty
                        </Label>
                        <Select
                           value={filters.difficulty}
                           onValueChange={(v) => setFilters({ ...filters, difficulty: v })}>
                           <SelectTrigger className="h-9 bg-background/50">
                              <SelectValue placeholder="All Levels" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="all">All Levels</SelectItem>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>
                  </CardContent>
               </Card>

               <Card className="border-border/50 shadow-xl overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                  <CardHeader className="pb-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Target className="h-4 w-4 text-primary" />
                           <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">
                              Challenge
                           </CardTitle>
                        </div>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-all"
                           onClick={handleShuffle}
                           title="Shuffle Question">
                           <Shuffle className="h-4 w-4" />
                        </Button>
                     </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     <Select
                        value={selectedQuestion?.id || ""}
                        onValueChange={(v) => {
                           const q = questions?.find((q: any) => q.id === v);
                           setSelectedQuestion(q || null);
                           if (q) setCode(q.starter_code || "");
                        }}>
                        <SelectTrigger className="border-primary/20 bg-primary/5 font-bold">
                           <SelectValue placeholder="Pick a challenge" />
                        </SelectTrigger>
                        <SelectContent>
                           {isLoading ? (
                              <div className="p-2 flex justify-center">
                                 <Loader2 className="h-4 w-4 animate-spin" />
                              </div>
                           ) : filteredQuestions.length ? (
                              filteredQuestions.map((q: any) => (
                                 <SelectItem
                                    key={q.id}
                                    value={q.id}>
                                    {q.title}
                                 </SelectItem>
                              ))
                           ) : (
                              <div className="p-2 text-sm text-muted-foreground text-center italic">
                                 No matches found
                              </div>
                           )}
                        </SelectContent>
                     </Select>

                     {selectedQuestion && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                           <div className="flex flex-wrap gap-2">
                              <Badge
                                 className={cn(
                                    "text-[10px] uppercase font-black px-2 py-0.5",
                                    selectedQuestion.difficulty === "easy"
                                       ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                       : selectedQuestion.difficulty === "medium"
                                         ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                         : "bg-rose-500/10 text-rose-500 border-rose-500/20",
                                 )}>
                                 {selectedQuestion.difficulty}
                              </Badge>
                              <Badge
                                 variant="outline"
                                 className="text-[10px] uppercase font-bold border-primary/20 text-primary">
                                 {selectedQuestion.category?.name}
                              </Badge>
                           </div>
                           <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter">
                                 Requirements
                              </Label>
                              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-[10] scrollbar-thin overflow-y-auto max-h-[200px]">
                                 {selectedQuestion.description}
                              </p>
                           </div>
                        </div>
                     )}

                     <div className="flex gap-2 pt-2">
                        {!isRunning ? (
                           <Button
                              onClick={handleStart}
                              disabled={!selectedQuestion}
                              className="flex-1 gradient-primary text-white font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all gap-2 h-11">
                              <Play className="h-4 w-4" /> Start Session
                           </Button>
                        ) : (
                           <div className="flex flex-col w-full gap-2">
                              <div className="flex w-full gap-2">
                                 <Button
                                    onClick={handleReset}
                                    variant="outline"
                                    className="flex-1 font-bold border-border/60 h-11">
                                    <RotateCcw className="h-4 w-4" />
                                 </Button>
                                 <Button
                                    onClick={handleSubmit}
                                    disabled={isEvaluating}
                                    className="flex-[2] gradient-primary text-white font-bold shadow-lg shadow-primary/20 h-11 gap-2">
                                    {isEvaluating ? (
                                       <>
                                          <Loader2 className="h-4 w-4 animate-spin" /> Evaluating...
                                       </>
                                    ) : (
                                       <>
                                          <Send className="h-4 w-4" /> Finish
                                       </>
                                    )}
                                 </Button>
                              </div>
                              {isRunning && (
                                 <Button
                                    variant="secondary"
                                    onClick={handleGetHint}
                                    disabled={isHintLoading}
                                    className="w-full font-bold h-10 gap-2 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20">
                                    {isHintLoading ? (
                                       <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                       <Sparkles className="h-4 w-4" />
                                    )}
                                    Ask for AI Hint
                                 </Button>
                              )}
                           </div>
                        )}
                     </div>
                  </CardContent>
               </Card>

               {/* Hints Panel */}
               {isRunning && hints.length > 0 && (
                  <Card className="border-border/50 shadow-sm bg-amber-500/5 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
                     <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-amber-600">
                           <Lightbulb className="h-4 w-4" />
                           <CardTitle className="text-xs font-black uppercase tracking-widest">
                              AI Hints ({hints.length})
                           </CardTitle>
                        </div>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        {hints.map((hint, i) => (
                           <div key={i} className="text-xs p-3 bg-background/50 rounded-lg border border-amber-500/10 text-muted-foreground leading-relaxed animate-in fade-in slide-in-from-left-2 duration-300">
                              {hint}
                           </div>
                        ))}
                     </CardContent>
                  </Card>
               )}
            </div>

            <Card className="lg:col-span-3 border-border/50 overflow-hidden shadow-lg relative group">
               <div className="absolute top-0 right-0 p-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge
                     variant="outline"
                     className="bg-background/80 backdrop-blur-md text-[10px] uppercase font-bold text-muted-foreground">
                     Monaco Engine v0.34
                  </Badge>
               </div>
               <CardContent className="p-0">
                  <Editor
                     height="calc(100vh - 200px)"
                     defaultLanguage="javascript"
                     theme={themeMode === "dark" ? "vs-dark" : "light"}
                     value={code}
                     onChange={(v) => setCode(v || "")}
                     options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20 },
                        cursorBlinking: "smooth",
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        renderLineHighlight: "all",
                     }}
                  />
               </CardContent>
            </Card>
         </div>

         {/* Professional Completion Modal */}
         <Dialog open={!!submissionResult} onOpenChange={(open) => !open && setSubmissionResult(null)}>
            <DialogContent className="sm:max-w-md overflow-hidden p-0 border-border/50 shadow-2xl">
               <div className={cn(
                  "h-32 w-full flex items-center justify-center relative overflow-hidden",
                  submissionResult?.score && submissionResult.score >= 80 ? "bg-emerald-500/20" :
                  submissionResult?.score && submissionResult.score >= 50 ? "bg-amber-500/20" :
                  "bg-rose-500/20"
               )}>
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  {submissionResult?.score && submissionResult.score >= 80 ? (
                     <Trophy className="h-16 w-16 text-emerald-500 drop-shadow-xl z-10" />
                  ) : submissionResult?.score && submissionResult.score >= 50 ? (
                     <AlertTriangle className="h-16 w-16 text-amber-500 drop-shadow-xl z-10" />
                  ) : (
                     <XCircle className="h-16 w-16 text-rose-500 drop-shadow-xl z-10" />
                  )}
               </div>
               
               <div className="p-6 pt-2 space-y-6 text-center relative z-20">
                  <DialogHeader>
                     <DialogTitle className="text-2xl font-black tracking-tight text-center">
                        {submissionResult?.score && submissionResult.score >= 80 ? "Outstanding Work!" :
                         submissionResult?.score && submissionResult.score >= 50 ? "Good Effort!" :
                         "Keep Practicing!"}
                     </DialogTitle>
                     <DialogDescription className="text-center text-sm pt-2">
                        Your solution has been evaluated against our test cases.
                     </DialogDescription>
                  </DialogHeader>

                  <div className="py-6 flex flex-col items-center justify-center space-y-2 bg-muted/30 rounded-xl border border-border/40">
                     <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Final Score</span>
                     <div className={cn(
                        "text-6xl font-black tabular-nums tracking-tighter",
                        submissionResult?.score && submissionResult.score >= 80 ? "text-emerald-500" :
                        submissionResult?.score && submissionResult.score >= 50 ? "text-amber-500" :
                        "text-rose-500"
                     )}>
                        {submissionResult?.score}%
                     </div>
                  </div>

                  {submissionResult?.feedback && (
                     <div className="text-left space-y-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-2 text-primary font-bold text-sm">
                           <MessageSquare className="h-4 w-4" /> Interviewer Feedback
                        </div>
                        <div className="text-xs text-muted-foreground prose prose-invert max-h-[150px] overflow-y-auto pr-2 scrollbar-thin">
                           {submissionResult.feedback}
                        </div>
                     </div>
                  )}

                  {submissionResult?.interviewerMessage && (
                     <p className="text-xs italic text-muted-foreground">
                        "{submissionResult.interviewerMessage}"
                     </p>
                  )}

                  <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 sm:justify-center border-t border-border/40 mt-4">
                     <Button
                        variant="outline"
                        className="w-full sm:w-auto font-bold h-11"
                        onClick={() => navigate("/dashboard")}
                     >
                        <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                     </Button>
                     <Button
                        className="w-full sm:w-auto gradient-primary text-white font-bold h-11 shadow-lg shadow-primary/20"
                        onClick={() => {
                           setSubmissionResult(null);
                           handleShuffle();
                        }}
                     >
                        Next Challenge <ArrowRight className="h-4 w-4 ml-2" />
                     </Button>
                  </DialogFooter>
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}

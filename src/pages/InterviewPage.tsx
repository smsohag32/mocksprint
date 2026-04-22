import { useState, useEffect, useCallback } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Play, RotateCcw, Send, Timer, Zap, AlertTriangle } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useGetQuestionsQuery } from "@/api/endpoints/question.api";
import { useStartInterviewMutation, useSubmitInterviewMutation } from "@/api/endpoints/interview.api";
import { useAppSelector } from "@/store/hooks";
import { toast } from "sonner";

export default function InterviewPage() {
   const themeMode = useAppSelector((s) => s.theme.mode);
   const { data: questions, isLoading } = useGetQuestionsQuery();
   const [startInterview] = useStartInterviewMutation();
   const [submitInterview] = useSubmitInterviewMutation();

   const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
   const [code, setCode] = useState("");
   const [interviewId, setInterviewId] = useState<string | null>(null);
   const [isRunning, setIsRunning] = useState(false);
   const [timeLeft, setTimeLeft] = useState(1800); // 30 min
   const [pressureMode, setPressureMode] = useState(false);

   // Timer
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

   // Pressure mode
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
         toast.success("Interview started!");
      } catch {
         toast.error("Failed to start interview");
      }
   };

   const handleSubmit = async () => {
      if (!interviewId || !selectedQuestion) return;
      setIsRunning(false);
      try {
         const result = await submitInterview({
            id: interviewId,
            code,
         }).unwrap();
         toast.success(`Submitted! Score: ${result.score}%`);
         setInterviewId(null);
      } catch {
         toast.error("Submission failed");
      }
   };

   const handleReset = () => {
      setCode(selectedQuestion?.starter_code || "");
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

         <div className="grid gap-4 lg:grid-cols-3">
            {/* Question Panel */}
            <Card className="lg:col-span-1 border-border/50">
               <CardHeader>
                  <CardTitle className="text-lg">Question</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <Select
                     onValueChange={(v) => {
                        const q = questions?.find((q) => q.id === v);
                        setSelectedQuestion(q || null);
                        if (q) setCode(q.starter_code || "");
                     }}>
                     <SelectTrigger>
                        <SelectValue placeholder="Select a question" />
                     </SelectTrigger>
                     <SelectContent>
                        {isLoading ? (
                           <div className="p-2">
                              <Skeleton className="h-6 w-full" />
                           </div>
                        ) : questions?.length ? (
                           questions.map((q) => (
                              <SelectItem
                                 key={q.id}
                                 value={q.id}>
                                 {q.title}
                              </SelectItem>
                           ))
                        ) : (
                           <div className="p-2 text-sm text-muted-foreground">
                              No questions available
                           </div>
                        )}
                     </SelectContent>
                  </Select>

                  {selectedQuestion && (
                     <div className="space-y-3">
                        <div className="flex gap-2">
                           <Badge
                              variant={
                                 selectedQuestion.difficulty === "easy"
                                    ? "default"
                                    : selectedQuestion.difficulty === "medium"
                                      ? "secondary"
                                      : "destructive"
                              }>
                              {selectedQuestion.difficulty}
                           </Badge>
                           <Badge variant="outline">{selectedQuestion.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                           {selectedQuestion.description}
                        </p>
                     </div>
                  )}

                  <div className="flex gap-2">
                     {!isRunning ? (
                        <Button
                           onClick={handleStart}
                           className="flex-1 gradient-primary text-primary-foreground gap-2">
                           <Play className="h-4 w-4" /> Start
                        </Button>
                     ) : (
                        <>
                           <Button
                              onClick={handleReset}
                              variant="outline"
                              className="flex-1 gap-2">
                              <RotateCcw className="h-4 w-4" /> Reset
                           </Button>
                           <Button
                              onClick={handleSubmit}
                              className="flex-1 gradient-primary text-primary-foreground gap-2">
                              <Send className="h-4 w-4" /> Submit
                           </Button>
                        </>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Code Editor */}
            <Card className="lg:col-span-2 border-border/50 overflow-hidden">
               <CardContent className="p-0">
                  <Editor
                     height="70vh"
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
                        padding: { top: 16 },
                     }}
                  />
               </CardContent>
            </Card>
         </div>
      </div>
   
   );
}

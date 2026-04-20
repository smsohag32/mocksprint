import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Timer, Trophy, Zap, Moon, Sun, ArrowRight } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import heroBg from "@/assets/hero-bg.jpg";
import Logo from "@/assets/logo/Logo";

const features = [
   {
      icon: Code2,
      title: "Monaco Code Editor",
      description: "Write code in a professional editor with syntax highlighting and autocomplete.",
   },
   {
      icon: Timer,
      title: "Timed Interviews",
      description: "Practice under real interview time pressure with countdown timer.",
   },
   {
      icon: Zap,
      title: "Pressure Mode",
      description: "Simulate real interview stress with random alerts and distractions.",
   },
   {
      icon: Trophy,
      title: "Leaderboard",
      description: "Compete with others and track your progress on the global leaderboard.",
   },
];

export default function LandingPage() {
   const { mode, toggle } = useTheme();
   const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

   return (
      <div className="min-h-screen bg-background">
         {/* Nav */}
         <nav className="sticky top-0 z-50 glass">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
               <div className="flex items-center gap-2">
                  <Logo className="w-44" />
               </div>
               <div className="flex items-center gap-3">
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={toggle}>
                     {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  {isAuthenticated ? (
                     <Link to="/dashboard">
                        <Button className="gradient-primary text-primary-foreground">
                           Dashboard
                        </Button>
                     </Link>
                  ) : (
                     <>
                        <Link to="/login">
                           <Button variant="ghost">Log in</Button>
                        </Link>
                        <Link to="/register">
                           <Button className="gradient-primary text-primary-foreground">
                              Get Started
                           </Button>
                        </Link>
                     </>
                  )}
               </div>
            </div>
         </nav>

         <section className="relative overflow-hidden py-20 lg:py-32">
            <div className="absolute inset-0 opacity-10">
               <img
                  src={heroBg}
                  alt=""
                  className="w-full h-full object-cover"
                  width={1920}
                  height={1080}
               />
            </div>
            <div className="container mx-auto px-4 text-center relative">
               <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl animate-fade-in">
                  Practice Interviews <span className="gradient-text">in Real-Time</span>
               </h1>
               <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground animate-slide-up">
                  Sharpen your coding skills with timed practice sessions, a built-in code editor,
                  pressure mode, and instant feedback. Climb the leaderboard and land your dream
                  job.
               </p>
               <div className="mt-10 flex items-center justify-center gap-4 animate-slide-up">
                  <Link to={isAuthenticated ? "/interview" : "/register"}>
                     <Button
                        size="lg"
                        className="gradient-primary text-primary-foreground gap-2 animate-pulse-glow">
                        Start Practice <ArrowRight className="h-4 w-4" />
                     </Button>
                  </Link>
                  <Link to="/questions">
                     <Button
                        size="lg"
                        variant="outline">
                        Browse Questions
                     </Button>
                  </Link>
               </div>
            </div>
         </section>

         {/* Features */}
         <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
               <h2 className="text-3xl font-bold text-center mb-12">
                  Everything you need to <span className="gradient-text">ace your interview</span>
               </h2>
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {features.map((f) => (
                     <Card
                        key={f.title}
                        className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
                        <CardContent className="p-6">
                           <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                              <f.icon className="h-6 w-6 text-primary-foreground" />
                           </div>
                           <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                           <p className="text-sm text-muted-foreground">{f.description}</p>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* CTA */}
         <section className="py-20">
            <div className="container mx-auto px-4 text-center">
               <div className="mx-auto max-w-2xl rounded-2xl gradient-primary p-12">
                  <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                     Ready to level up?
                  </h2>
                  <p className="text-primary-foreground/80 mb-8">
                     Join thousands of developers practicing interviews every day.
                  </p>
                  <Link to="/register">
                     <Button
                        size="lg"
                        variant="secondary"
                        className="gap-2">
                        Get Started Free <ArrowRight className="h-4 w-4" />
                     </Button>
                  </Link>
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="border-t border-border py-8">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
               © {new Date().getFullYear()} MockSprint. All rights reserved.
            </div>
         </footer>
      </div>
   );
}

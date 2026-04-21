import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Code2, Timer, Trophy, Zap, ArrowRight, CheckCircle2, Sparkles, Users } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import Logo from "@/assets/logo/Logo";
import editorMockup from "@/assets/editor-mockup.png";

const features = [
   {
      icon: Code2,
      title: "Pro Monaco Editor",
      description:
         "Industry-standard code editor with intelligent autocomplete and syntax highlighting.",
      color: "from-blue-500/20 to-cyan-500/20",
   },
   {
      icon: Timer,
      title: "Real-Time Pressure",
      description:
         "Practice under actual interview time constraints to build psychological resilience.",
      color: "from-purple-500/20 to-pink-500/20",
   },
   {
      icon: Zap,
      title: "Instant Validation",
      description: "Get immediate feedback on your solutions with our automated test runner.",
      color: "from-orange-500/20 to-yellow-500/20",
   },
   {
      icon: Trophy,
      title: "Global Ranking",
      description: "Compete with global developers and showcase your skills on the leaderboard.",
      color: "from-green-500/20 to-emerald-500/20",
   },
];

const stats = [
   { label: "Active Practicers", value: "10k+", icon: Users },
   { label: "Questions Solved", value: "250k+", icon: CheckCircle2 },
   { label: "Avg. Score Boost", value: "45%", icon: Sparkles },
];

export default function LandingPage() {
   const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

   const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
         opacity: 1,
         transition: {
            staggerChildren: 0.1,
         },
      },
   };

   const itemVariants: Variants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
         y: 0,
         opacity: 1,
         transition: {
            duration: 0.5,
            ease: "easeOut",
         },
      },
   };

   return (
      <div className="bg-background selection:bg-primary/30">
         <main>
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-16 pb-20 lg:pt-32 lg:pb-40 mesh-bg">
               <div className="container mx-auto px-6 relative z-10">
                  <div className="flex flex-col lg:flex-row items-center gap-16">
                     <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="flex-1 text-center lg:text-left">
                        <motion.div
                           variants={itemVariants}
                           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
                           <Sparkles className="h-4 w-4" />
                           <span>The Future of Interview Prep</span>
                        </motion.div>
                        <motion.h1
                           variants={itemVariants}
                           className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
                           Master Technical <br />
                           <span className="gradient-text">Interviews Under Pressure</span>
                        </motion.h1>
                        <motion.p
                           variants={itemVariants}
                           className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                           Stop practicing in isolation. Experience real-world interview conditions
                           with our timed, high-stress simulator. Built for world-class developers.
                        </motion.p>
                        <motion.div
                           variants={itemVariants}
                           className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                           <Link to={isAuthenticated ? "/interview" : "/register"}>
                              <Button
                                 size="lg"
                                 className="gradient-primary text-primary-foreground h-14 px-10 rounded-full text-lg font-bold gap-3 group shadow-xl shadow-primary/30">
                                 Start Free Practice{" "}
                                 <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                              </Button>
                           </Link>
                           <Link to="/questions">
                              <Button
                                 size="lg"
                                 variant="outline"
                                 className="h-14 px-10 rounded-full text-lg font-semibold hover:bg-muted transition-colors">
                                 Explore Challenges
                              </Button>
                           </Link>
                        </motion.div>

                        <motion.div
                           variants={itemVariants}
                           className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground font-medium">
                           <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              <span>Free Tier Available</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-success" />
                              <span>No Credit Card Required</span>
                           </div>
                        </motion.div>
                     </motion.div>

                     <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="flex-1 relative">
                        <div className="relative z-10 glass-card p-2 rounded-3xl overflow-hidden shadow-2xl animate-float">
                           <img
                              src={editorMockup}
                              alt="MockSprint Editor Mockup"
                              className="rounded-2xl w-full h-auto object-cover"
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
                        </div>
                        {/* Decorative Blobs */}
                        <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full animate-pulse-subtle" />
                        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full animate-pulse-subtle" />
                     </motion.div>
                  </div>
               </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-y border-border/50 bg-muted/20">
               <div className="container mx-auto px-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                     {stats.map((stat, idx) => (
                        <motion.div
                           key={idx}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: idx * 0.1 }}
                           className="flex flex-col items-center gap-2">
                           <div className="p-3 rounded-2xl bg-primary/10 mb-2">
                              <stat.icon className="h-6 w-6 text-primary" />
                           </div>
                           <div className="text-4xl font-black">{stat.value}</div>
                           <div className="text-muted-foreground font-semibold">{stat.label}</div>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* Features Section */}
            <section className="py-24 lg:py-32 section-padding">
               <div className="container mx-auto px-6">
                  <div className="text-center max-w-3xl mx-auto mb-20">
                     <h2 className="text-3xl lg:text-5xl font-extrabold mb-6">
                        Everything you need to{" "}
                        <span className="gradient-text">ace your interview</span>
                     </h2>
                     <p className="text-lg text-muted-foreground">
                        We've built a suite of tools designed specifically to help you overcome
                        technical performance anxiety and sharpen your coding speed.
                     </p>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                     {features.map((f, idx) => (
                        <motion.div
                           key={f.title}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: idx * 0.1 }}
                           whileHover={{ y: -10 }}
                           className="flex">
                           <Card className="glass-card group overflow-hidden flex-1 border-white/5 hover:border-primary/20 transition-all duration-300">
                              <CardContent className="p-8">
                                 <div
                                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <f.icon className="h-7 w-7 text-primary" />
                                 </div>
                                 <h3 className="mb-3 text-xl font-bold">{f.title}</h3>
                                 <p className="text-muted-foreground leading-relaxed italic line-clamp-3">
                                    "{f.description}"
                                 </p>
                              </CardContent>
                           </Card>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-background relative overflow-hidden">
               <div className="container mx-auto px-6">
                  <motion.div
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     className="relative mx-auto max-w-5xl rounded-[3rem] overflow-hidden">
                     <div className="absolute inset-0 gradient-primary opacity-90" />
                     <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

                     <div className="relative z-10 px-8 py-16 lg:p-20 text-center text-primary-foreground">
                        <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">
                           Ready to Level Up Your <br className="hidden lg:block" />
                           Engineering Career?
                        </h2>
                        <p className="text-xl lg:text-2xl text-primary-foreground/80 mb-12 max-w-3xl mx-auto font-medium">
                           Join over 10,000 developers who use MockSprint to crush their technical
                           interviews at top-tier tech companies.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                           <Link to="/register">
                              <Button
                                 size="lg"
                                 variant="secondary"
                                 className="h-16 px-12 rounded-full text-xl font-bold gap-3 group shadow-2xl hover:scale-105 transition-transform">
                                 Create Free Account{" "}
                                 <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                              </Button>
                           </Link>
                           <div className="flex items-center gap-3 text-primary-foreground/90 font-semibold">
                              <div className="flex -space-x-3">
                                 {[1, 2, 3, 4].map((i) => (
                                    <div
                                       key={i}
                                       className={`h-10 w-10 rounded-full border-2 border-primary bg-muted flex items-center justify-center text-xs text-foreground`}>
                                       U{i}
                                    </div>
                                 ))}
                              </div>
                              <span>+500 joined this week</span>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </div>
            </section>
         </main>
      </div>
   );
}

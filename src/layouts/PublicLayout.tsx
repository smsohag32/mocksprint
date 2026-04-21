import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Github, CheckCircle2 } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import Logo from "@/assets/logo/Logo";

export default function PublicLayout() {
   const { mode, toggle } = useTheme();
   const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

   return (
      <div className="min-h-screen bg-background selection:bg-primary/30">
         {/* Navigation */}
         <nav className="sticky top-0 z-50 glass">
            <div className="container mx-auto flex h-20 items-center justify-between px-6">
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2">
                  <Logo className="w-40 sm:w-48" />
               </motion.div>
               <div className="flex items-center gap-4">
                  <Button
                     variant="ghost"
                     size="icon"
                     className="rounded-full"
                     onClick={toggle}>
                     {mode === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                  {isAuthenticated ? (
                     <Link to="/dashboard">
                        <Button className="gradient-primary text-primary-foreground rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                           Dashboard
                        </Button>
                     </Link>
                  ) : (
                     <div className="flex items-center gap-2">
                        <Link
                           to="/login"
                           className="hidden sm:block">
                           <Button
                              variant="ghost"
                              className="rounded-full px-6">
                              Log in
                           </Button>
                        </Link>
                        <Link to="/register">
                           <Button className="gradient-primary text-primary-foreground rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-semibold">
                              Get Started
                           </Button>
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         </nav>

         <main>
            <Outlet />
         </main>

         {/* Footer */}
         <footer className="border-t border-border/50 bg-muted/20 py-20">
            <div className="container mx-auto px-6">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                  <div className="col-span-1 md:col-span-2">
                     <Logo className="w-48 mb-6" />
                     <p className="text-muted-foreground max-w-sm mb-6 leading-relaxed">
                        The ultimate destination for developers to practice coding interviews under
                        real-world pressure. Built by engineers, for engineers.
                     </p>
                     <div className="flex items-center gap-4">
                        <Button
                           variant="ghost"
                           size="icon"
                           className="rounded-full">
                           <Github className="h-5 w-5" />
                        </Button>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="rounded-full">
                           <CheckCircle2 className="h-5 w-5" />
                        </Button>
                     </div>
                  </div>
                  <div>
                     <h4 className="font-bold text-lg mb-6">Product</h4>
                     <ul className="space-y-4 text-muted-foreground">
                        <li>
                           <Link
                              to="/questions"
                              className="hover:text-primary transition-colors">
                              Questions
                           </Link>
                        </li>
                        <li>
                           <Link
                              to="/interview"
                              className="hover:text-primary transition-colors">
                              Practice
                           </Link>
                        </li>
                        <li>
                           <Link
                              to="/leaderboard"
                              className="hover:text-primary transition-colors">
                              Leaderboard
                           </Link>
                        </li>
                        <li>
                           <Link
                              to="#"
                              className="hover:text-primary transition-colors">
                              Pricing
                           </Link>
                        </li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-bold text-lg mb-6">Company</h4>
                     <ul className="space-y-4 text-muted-foreground">
                        <li>
                           <Link
                              to="#"
                              className="hover:text-primary transition-colors">
                              About Us
                           </Link>
                        </li>
                        <li>
                           <Link
                              to="#"
                              className="hover:text-primary transition-colors">
                              Blog
                           </Link>
                        </li>
                        <li>
                           <Link
                              to="#"
                              className="hover:text-primary transition-colors">
                              Terms of Service
                           </Link>
                        </li>
                        <li>
                           <Link
                              to="#"
                              className="hover:text-primary transition-colors">
                              Privacy Policy
                           </Link>
                        </li>
                     </ul>
                  </div>
               </div>
               <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-medium">
                  <div>© {new Date().getFullYear()} MockSprint. All rights reserved.</div>
                  <div className="flex items-center gap-8">
                     <Link
                        to="#"
                        className="hover:text-primary transition-colors">
                        Privacy
                     </Link>
                     <Link
                        to="#"
                        className="hover:text-primary transition-colors">
                        Terms
                     </Link>
                     <Link
                        to="#"
                        className="hover:text-primary transition-colors">
                        Cookie Policy
                     </Link>
                  </div>
               </div>
            </div>
         </footer>
      </div>
   );
}

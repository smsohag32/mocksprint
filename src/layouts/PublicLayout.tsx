import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import Footer from "@/components/layout/Footer";
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
               <div className="flex items-center gap-8">
                  <motion.div
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="flex items-center gap-2">
                     <Logo className="w-40 sm:w-48" />
                  </motion.div>

                  {/* Navigation Links */}
                  <div className="hidden lg:flex items-center gap-6">
                     <Link
                        to="/about"
                        className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                        About Us
                     </Link>
                     <Link
                        to="/blogs"
                        className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                        Blog
                     </Link>
                     <Link
                        to="/terms"
                        className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                        Terms
                     </Link>
                     <Link
                        to="/privacy"
                        className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
                        Privacy
                     </Link>
                  </div>
               </div>
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

         <Footer />
      </div>
   );
}

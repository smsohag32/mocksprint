import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2 } from "lucide-react";

import { toast } from "sonner";
import { useLoginMutation } from "@/api/endpoints/auth.api";

export default function LoginPage() {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [login, { isLoading }] = useLoginMutation();
   const navigate = useNavigate();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
         await login({ email, password }).unwrap();
         toast.success("Welcome back!");
         navigate("/dashboard");
      } catch (err: any) {
         toast.error(err?.message || "Login failed");
      }
   };

   return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
         <Card className="w-full max-w-md border-border/50">
            <CardHeader className="text-center">
               <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <Code2 className="h-6 w-6 text-primary-foreground" />
               </div>
               <CardTitle className="text-2xl">Welcome back</CardTitle>
               <CardDescription>Sign in to your account</CardDescription>
            </CardHeader>
            <CardContent>
               <form
                  onSubmit={handleSubmit}
                  className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                     />
                  </div>
                  <Button
                     type="submit"
                     className="w-full gradient-primary text-primary-foreground"
                     disabled={isLoading}>
                     {isLoading ? "Signing in..." : "Sign in"}
                  </Button>
               </form>
               <p className="mt-4 text-center text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                     to="/register"
                     className="text-primary hover:underline">
                     Sign up
                  </Link>
               </p>
            </CardContent>
         </Card>
      </div>
   );
}

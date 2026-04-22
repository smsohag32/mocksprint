import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
   Code2,
   Eye,
   EyeOff,
   ArrowRight,
   Zap,
   Trophy,
   Timer,
   CheckCircle2,
   Mail,
   Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useLoginMutation } from "@/api/endpoints/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth.slice";
import Logo from "@/assets/logo/Logo";

/* ─── types ─────────────────────────────────────────── */
interface LoginFormValues {
   email: string;
   password: string;
}

/* ─── brand highlights ───────────────────────────────── */
const highlights = [
   { icon: Code2, text: "Monaco-powered code editor" },
   { icon: Timer, text: "Real-time timed interviews" },
   { icon: Trophy, text: "Global leaderboard ranking" },
   { icon: Zap, text: "Pressure-mode simulation" },
];

/* ═══════════════════════════════════════════════════════
   LOGIN PAGE
════════════════════════════════════════════════════════ */
export default function LoginPage() {
   const [showPassword, setShowPassword] = useState(false);
   const [login, { isLoading }] = useLoginMutation();
   const navigate = useNavigate();
   const dispatch = useAppDispatch();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<LoginFormValues>({ mode: "onTouched" });

   const onSubmit = async (data: LoginFormValues) => {
      try {
         const result = await login(data).unwrap();
         
         dispatch(setCredentials({
            user: result.user,
            token: result.token,
            refresh_token: result.refresh_token
         }));

         toast.success("Welcome back! 🚀");
         navigate("/dashboard");
      } catch (err: any) {
         toast.error(err?.data?.message || err?.message || "Login failed. Please try again.");
      }
   };

   const onInvalid = () => {
      toast.warning("Please check your login credentials. 🧐");
   };

   return (
      <div className="flex min-h-screen">
         {/* ══════════ LEFT — Brand Panel ══════════ */}
         <div className="relative hidden lg:flex lg:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-[#1a3aff] via-blue-700 to-cyan-500 p-12 text-white">
            {/* Dot-grid background */}
            <div
               className="pointer-events-none absolute inset-0 opacity-[0.07]"
               style={{
                  backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
               }}
            />

            {/* Glow blobs */}
            <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-400/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-12 h-72 w-72 rounded-full bg-cyan-300/25 blur-3xl" />
            <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-2xl" />

            {/* ── Top: Logo ── */}
            <div className="relative">
               <Logo className="w-40 brightness-0 invert drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            </div>

            {/* ── Middle: Floating preview card ── */}
            <div className="relative flex flex-col items-center gap-6">
               {/* Mock interview card */}
               <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 shadow-2xl shadow-black/20 p-5">
                  {/* Card header */}
                  <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-2">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-red-400" />
                        <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <span className="flex h-2.5 w-2.5 rounded-full bg-green-400" />
                     </div>
                     <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-cyan-200">
                        <span className="relative flex h-2 w-2">
                           <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                           <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
                        </span>
                        Live Session
                     </span>
                  </div>
                  {/* Question */}
                  <p className="text-xs font-medium text-blue-200 mb-1">Question #42 · Medium</p>
                  <p className="text-sm font-semibold text-white mb-4 leading-snug">
                     Two Sum — Find indices of two numbers that add up to target
                  </p>
                  {/* Code block */}
                  <div className="rounded-lg bg-black/30 p-3 font-mono text-xs text-cyan-200 leading-relaxed">
                     <span className="text-blue-300">function</span>{" "}
                     <span className="text-yellow-300">twoSum</span>
                     <span className="text-white">(nums, target) {"{"}</span>
                     <br />
                     <span className="text-white pl-4">{"  "}const map = </span>
                     <span className="text-blue-300">new</span>{" "}
                     <span className="text-yellow-300">Map</span>
                     <span className="text-white">();</span>
                     <br />
                     <span className="text-muted-foreground pl-4 text-blue-400">{"  "}// ...</span>
                     <br />
                     <span className="text-white">{"}"}</span>
                  </div>
                  {/* Timer bar */}
                  <div className="mt-4 flex items-center justify-between">
                     <div className="flex-1 mr-3">
                        <div className="h-1.5 w-full rounded-full bg-white/15">
                           <div className="h-1.5 w-3/5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
                        </div>
                     </div>
                     <span className="flex items-center gap-1 text-xs font-semibold text-cyan-200">
                        <Timer size={12} />
                        18:42
                     </span>
                  </div>
               </div>

               {/* Stat pills row */}
               <div className="flex items-center gap-3">
                  {[
                     { value: "10K+", label: "Users" },
                     { value: "500+", label: "Questions" },
                     { value: "98%", label: "Success" },
                  ].map(({ value, label }) => (
                     <div
                        key={label}
                        className="flex flex-col items-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/15 px-5 py-2.5">
                        <span className="text-lg font-extrabold text-white leading-none">
                           {value}
                        </span>
                        <span className="text-[10px] font-medium text-blue-200 mt-0.5">
                           {label}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            {/* ── Bottom: Features + trust ── */}
            <div className="relative space-y-5">
               <ul className="grid grid-cols-2 gap-2.5">
                  {highlights.map(({ icon: Icon, text }) => (
                     <li
                        key={text}
                        className="flex items-center gap-2.5 rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/10 px-3 py-2.5">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15">
                           <Icon className="h-3.5 w-3.5 text-cyan-300" />
                        </span>
                        <span className="text-xs font-medium text-blue-50 leading-tight">
                           {text}
                        </span>
                     </li>
                  ))}
               </ul>
               <div className="flex items-center gap-2 text-xs text-blue-200">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-300" />
                  Trusted by 10,000+ developers worldwide
               </div>
            </div>
         </div>

         {/* ══════════ RIGHT — Form Panel ══════════ */}
         <div className="flex w-full flex-col items-center justify-center bg-background px-6 py-12 lg:w-1/2 lg:px-16">
            <div className="w-full max-w-md animate-fade-in">
               {/* Mobile logo */}
               <div className="mb-8 flex items-center gap-2 lg:hidden">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500">
                     <Code2
                        className="h-5 w-5 text-white"
                        strokeWidth={2.5}
                     />
                  </div>
                  <span className="text-xl font-bold">MockSprint</span>
               </div>

               {/* Heading */}
               <div className="mb-8 space-y-1">
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                     Welcome back
                  </h2>
                  <p className="text-sm text-muted-foreground">
                     Sign in to your account to continue
                  </p>
               </div>

               {/* Form */}
               <form
                  onSubmit={handleSubmit(onSubmit, onInvalid)}
                  className="space-y-5"
                  noValidate>
                  {/* Email */}
                  <div className="space-y-1.5">
                     <div
                        className={`flex items-center rounded-lg border bg-background transition-all duration-200
                  ${
                     errors.email
                        ? "border-red-400 ring-2 ring-red-400/20"
                        : "border-border hover:border-blue-400/60 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/25"
                  }`}>
                        <span className="flex h-full items-center pl-3.5 pr-2.5">
                           <Mail
                              size={16}
                              className={`shrink-0 transition-colors ${
                                 errors.email ? "text-red-400" : "text-muted-foreground"
                              }`}
                           />
                        </span>
                        <div className="h-5 w-px bg-border" />
                        <input
                           id="email"
                           type="email"
                           autoComplete="email"
                           placeholder="you@example.com"
                           className="flex-1 bg-transparent py-2.5 pl-3 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                           {...register("email", {
                              required: "Email is required",
                              pattern: {
                                 value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                 message: "Enter a valid email address",
                              },
                           })}
                        />
                     </div>
                     {errors.email && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                           {errors.email.message}
                        </p>
                     )}
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                     <div
                        className={`flex items-center rounded-lg border bg-background transition-all duration-200
                  ${
                     errors.password
                        ? "border-red-400 ring-2 ring-red-400/20"
                        : "border-border hover:border-blue-400/60 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/25"
                  }`}>
                        <span className="flex h-full items-center pl-3.5 pr-2.5">
                           <Lock
                              size={16}
                              className={`shrink-0 transition-colors ${
                                 errors.password ? "text-red-400" : "text-muted-foreground"
                              }`}
                           />
                        </span>
                        <div className="h-5 w-px bg-border" />
                        <input
                           id="password"
                           type={showPassword ? "text" : "password"}
                           autoComplete="current-password"
                           placeholder="••••••••"
                           className="flex-1 bg-transparent py-2.5 pl-3 pr-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                           {...register("password", {
                              required: "Password is required",
                              minLength: {
                                 value: 6,
                                 message: "Password must be at least 6 characters",
                              },
                           })}
                        />
                        <button
                           type="button"
                           onClick={() => setShowPassword((v) => !v)}
                           className="mr-3 text-muted-foreground hover:text-foreground transition-colors"
                           aria-label={showPassword ? "Hide password" : "Show password"}>
                           {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                     </div>
                     {errors.password && (
                        <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                           {errors.password.message}
                        </p>
                     )}
                  </div>

                  {/* Submit */}
                  <button
                     type="submit"
                     disabled={isLoading}
                     className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/30 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60">
                     {isLoading ? (
                        <>
                           <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                           Signing in…
                        </>
                     ) : (
                        <>
                           Sign in
                           <ArrowRight
                              size={16}
                              className="transition-transform duration-200 group-hover:translate-x-0.5"
                           />
                        </>
                     )}
                  </button>
               </form>

               {/* Divider */}
               <div className="my-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="h-px flex-1 bg-border" />
               </div>

               {/* Register link */}
               <p className="text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                     to="/register"
                     className="font-semibold text-blue-600 hover:text-blue-500 transition-colors underline-offset-2 hover:underline">
                     Create one free
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}

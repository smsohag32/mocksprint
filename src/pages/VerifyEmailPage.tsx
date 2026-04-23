import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Code2, ArrowRight, MailCheck } from "lucide-react";

type Status = "loading" | "success" | "error";

/* ═══════════════════════════════════════════════════════
   VERIFY EMAIL PAGE
════════════════════════════════════════════════════════ */
export default function VerifyEmailPage() {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const token = searchParams.get("token");

   const [status, setStatus] = useState<Status>("loading");
   const [message, setMessage] = useState<string>("");
   const [countdown, setCountdown] = useState(5);
   const hasFired = useRef(false);

   /* ── Verify token on mount ── */
   useEffect(() => {
      if (hasFired.current) return;
      hasFired.current = true;

      if (!token) {
         setStatus("error");
         setMessage("No verification token found. Please check your email link.");
         return;
      }

      const API_BASE =
         import.meta.env.VITE_BASE_API_URL || "http://localhost:5000/api/v1";

      fetch(`${API_BASE}/auth/verify-email?token=${encodeURIComponent(token)}`)
         .then(async (res) => {
            const data = await res.json();
            if (res.ok && data.success) {
               setStatus("success");
               setMessage(data.message || "Email verified successfully!");
            } else {
               setStatus("error");
               setMessage(
                  data.message ||
                     "Verification failed. The link may be invalid or expired."
               );
            }
         })
         .catch(() => {
            setStatus("error");
            setMessage("Unable to connect to the server. Please try again later.");
         });
   }, [token]);

   /* ── Auto-redirect countdown on success ── */
   useEffect(() => {
      if (status !== "success") return;
      if (countdown === 0) {
         navigate("/login");
         return;
      }
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
   }, [status, countdown, navigate]);

   /* ─── Render ────────────────────────────────────── */
   return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
         {/* Background glow */}
         <div className="pointer-events-none fixed inset-0 overflow-hidden">
            <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
         </div>

         <div className="relative w-full max-w-md">
            {/* Logo */}
            <div className="mb-8 flex items-center justify-center gap-2">
               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30">
                  <Code2 className="h-5 w-5 text-white" strokeWidth={2.5} />
               </div>
               <span className="text-2xl font-bold tracking-tight text-foreground">
                  MockSprint
               </span>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-border bg-card shadow-xl shadow-black/5 overflow-hidden">
               {/* Top accent bar */}
               <div
                  className={`h-1 w-full ${
                     status === "loading"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 animate-pulse"
                        : status === "success"
                        ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                        : "bg-gradient-to-r from-red-500 to-rose-400"
                  }`}
               />

               <div className="p-8 text-center">
                  {/* ── Loading ── */}
                  {status === "loading" && (
                     <div className="flex flex-col items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 ring-1 ring-blue-500/20">
                           <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                        <div className="space-y-1">
                           <h1 className="text-xl font-bold text-foreground">
                              Verifying your email…
                           </h1>
                           <p className="text-sm text-muted-foreground">
                              Please wait while we confirm your account.
                           </p>
                        </div>
                     </div>
                  )}

                  {/* ── Success ── */}
                  {status === "success" && (
                     <div className="flex flex-col items-center gap-5">
                        {/* Animated checkmark */}
                        <div className="relative flex h-20 w-20 items-center justify-center">
                           <div className="absolute inset-0 rounded-full bg-emerald-500/15 animate-ping opacity-30" />
                           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 ring-2 ring-emerald-500/30">
                              <CheckCircle2 className="h-9 w-9 text-emerald-500" />
                           </div>
                        </div>

                        <div className="space-y-2">
                           <h1 className="text-2xl font-bold text-foreground">
                              Email Verified! 🎉
                           </h1>
                           <p className="text-sm text-muted-foreground leading-relaxed">
                              {message}
                           </p>
                        </div>

                        {/* Countdown */}
                        <div className="w-full rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
                           <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                              <MailCheck size={15} />
                              <span>
                                 Redirecting to login in{" "}
                                 <strong>{countdown}</strong> second
                                 {countdown !== 1 ? "s" : ""}…
                              </span>
                           </div>
                           {/* Progress bar */}
                           <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-emerald-500/20">
                              <div
                                 className="h-full rounded-full bg-emerald-500 transition-all duration-1000"
                                 style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                              />
                           </div>
                        </div>

                        <Link
                           to="/login"
                           className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:brightness-110 hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98]"
                        >
                           Go to Login
                           <ArrowRight
                              size={15}
                              className="transition-transform duration-200 group-hover:translate-x-0.5"
                           />
                        </Link>
                     </div>
                  )}

                  {/* ── Error ── */}
                  {status === "error" && (
                     <div className="flex flex-col items-center gap-5">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 ring-2 ring-red-500/20">
                           <XCircle className="h-9 w-9 text-red-500" />
                        </div>

                        <div className="space-y-2">
                           <h1 className="text-2xl font-bold text-foreground">
                              Verification Failed
                           </h1>
                           <p className="text-sm text-muted-foreground leading-relaxed">
                              {message}
                           </p>
                        </div>

                        <div className="w-full rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-left">
                           <p className="text-xs font-medium text-red-500 mb-1">
                              Common reasons:
                           </p>
                           <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                              <li>Link has expired (valid for 24 hours)</li>
                              <li>Link was already used</li>
                              <li>Invalid or incomplete link</li>
                           </ul>
                        </div>

                        <div className="flex flex-col items-center gap-2 w-full">
                           <Link
                              to="/register"
                              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                           >
                              Register Again
                              <ArrowRight
                                 size={15}
                                 className="transition-transform duration-200 group-hover:translate-x-0.5"
                              />
                           </Link>
                           <Link
                              to="/login"
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                           >
                              Already verified?{" "}
                              <span className="font-semibold text-blue-600 hover:text-blue-500">
                                 Sign in
                              </span>
                           </Link>
                        </div>
                     </div>
                  )}
               </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-muted-foreground">
               © {new Date().getFullYear()} MockSprint · Practice interviews. Land your
               dream job.
            </p>
         </div>
      </div>
   );
}

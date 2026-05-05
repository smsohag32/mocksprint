import { Users, Target, Zap } from "lucide-react";

export default function AboutUsPage() {
   return (
      <div className="min-h-screen bg-background py-20">
         <div className="container mx-auto max-w-4xl px-6">
            <div className="text-center mb-16">
               <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">About MockSprint</h1>
               <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Empowering developers to ace their technical interviews through realistic, real-time practice and community-driven learning.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Target className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
                  <p className="text-muted-foreground text-sm">To bridge the gap between learning to code and successfully passing technical interviews at top-tier companies.</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community First</h3>
                  <p className="text-muted-foreground text-sm">We believe that peer-to-peer learning is the most effective way to improve communication and problem-solving skills.</p>
               </div>
               <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                  <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
                     <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Real Environment</h3>
                  <p className="text-muted-foreground text-sm">Our platform simulates real interview environments, right down to the Monaco-powered editor and high-pressure timers.</p>
               </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/20 rounded-3xl p-8 md:p-12 text-center">
               <h2 className="text-3xl font-bold mb-4">Ready to level up your career?</h2>
               <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands of developers who have already improved their interview skills and landed their dream jobs.
               </p>
            </div>
         </div>
      </div>
   );
}

export default function TermsPage() {
   return (
      <div className="min-h-screen bg-background py-20">
         <div className="container mx-auto max-w-4xl px-6">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Terms and Conditions</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
               <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
               
               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
               <p>By accessing and using MockSprint, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our service.</p>

               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Description of Service</h2>
               <p>MockSprint provides a platform for software engineers to practice coding interviews in real-time environments. We reserve the right to modify or discontinue the service with or without notice to you.</p>

               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. User Accounts</h2>
               <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>
               
               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Code of Conduct</h2>
               <p>Users are expected to maintain professional behavior. Harassment, cheating, or any form of disruptive behavior during mock interviews will result in account suspension.</p>
            </div>
         </div>
      </div>
   );
}

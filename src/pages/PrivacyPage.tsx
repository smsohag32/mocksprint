export default function PrivacyPage() {
   return (
      <div className="min-h-screen bg-background py-20">
         <div className="container mx-auto max-w-4xl px-6">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Privacy Policy</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
               <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
               
               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
               <p>We collect information you provide directly to us, such as your name, email address, and profile data when you register an account. We also collect data regarding your performance in mock interviews.</p>

               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
               <p>We use the information we collect to provide, maintain, and improve our services, to process transactions, and to communicate with you about your account and our services.</p>

               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Data Security</h2>
               <p>We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process.</p>
               
               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Your Privacy Rights</h2>
               <p>Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or delete your information. Contact us to exercise these rights.</p>
            </div>
         </div>
      </div>
   );
}

export default function CookiePolicyPage() {
   return (
      <div className="min-h-screen bg-background py-20">
         <div className="container mx-auto max-w-4xl px-6">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Cookie Policy</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
               <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>
               
               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. What Are Cookies</h2>
               <p>Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work, or work more efficiently, as well as to provide information to the owners of the site.</p>

               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. How We Use Cookies</h2>
               <p>We use cookies to understand how you use our platform, to remember your preferences (such as editor theme and language), and to keep you signed in. We also use cookies for analytics purposes to improve our services.</p>

               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Types of Cookies We Use</h2>
               <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for the operation of our website, including authentication.</li>
                  <li><strong>Functional Cookies:</strong> Used to recognize you when you return and remember your preferences.</li>
                  <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how they move around the site.</li>
               </ul>
               
               <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Managing Cookies</h2>
               <p>Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may worsen your overall user experience.</p>
            </div>
         </div>
      </div>
   );
}

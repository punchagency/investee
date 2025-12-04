import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function LegalPage() {
  const [location] = useLocation();
  const isPrivacy = location === "/privacy";

  return (
    <div className="container max-w-3xl px-4 py-12">
      <Link href="/">
        <Button variant="ghost" className="mb-6 pl-0 hover:pl-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      
      <h1 className="text-4xl font-heading font-bold mb-8">
        {isPrivacy ? "Privacy Policy" : "Terms of Service"}
      </h1>

      <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <p className="lead text-xl text-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <p>
          This is a demonstration page for the Legacy AI Commercial Investment Portal. 
          In a real application, this page would contain the full legal text regarding 
          {isPrivacy ? " data collection, usage policies, and privacy rights" : " user agreements, acceptable use policies, and liability limitations"}.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Overview</h2>
        <p>
          Legacy AI provides commercial real estate analysis tools. By using our services, 
          you acknowledge that all financial calculations are estimates and do not constitute 
          guaranteed offers of funding.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. {isPrivacy ? "Data Collection" : "Usage License"}</h2>
        <p>
          {isPrivacy 
            ? "We collect information necessary to provide investment quotes and property analysis. We do not sell your personal data to third parties without consent."
            : "Permission is granted to temporarily download one copy of the materials (information or software) on Legacy AI's website for personal, non-commercial transitory viewing only."
          }
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Disclaimer</h2>
        <p>
          The materials on Legacy AI's website are provided on an 'as is' basis. Legacy AI makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
      </div>
    </div>
  );
}

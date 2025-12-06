import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CheckCircle2, Clock, FileText, Upload, ShieldCheck, Building2, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function LoanDetailPage() {
  const [, params] = useRoute("/loan/:id");
  const id = params?.id ? parseInt(params.id) : 0;
  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    const found = stored.find((app: any) => app.id === id);
    if (found) {
      // Ensure status exists
      if (!found.status) found.status = "submitted";
      setApplication(found);
    }
  }, [id]);

  if (!application) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Loan Not Found</h1>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const getProgress = () => {
    switch(application.status) {
      case "submitted": return 25;
      case "underwriting": return 50;
      case "approved": return 75;
      case "funded": return 100;
      default: return 0;
    }
  };

  const steps = [
    { id: "submitted", label: "Application Submitted", icon: FileText },
    { id: "underwriting", label: "Underwriting Review", icon: ShieldCheck },
    { id: "approved", label: "Conditional Approval", icon: CheckCircle2 },
    { id: "funded", label: "Funded", icon: DollarSign },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === application.status);

  const handleUpload = () => {
    toast.success("Document uploaded successfully", {
      description: "Our underwriting team has been notified."
    });
  };

  return (
    <div className="container max-w-screen-xl px-4 md:px-8 py-8 min-h-screen">
      <Link href="/dashboard">
        <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Loan #{application.id}
            </h1>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none text-sm px-3 py-1">
              {application.status.toUpperCase().replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {application.formData.propertyType} • {application.formData.loanType}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Loan Amount</p>
          <p className="text-3xl font-bold text-primary">${application.loanAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="mb-12">
        <Progress value={getProgress()} className="h-2 mb-6" />
        <div className="grid grid-cols-4 gap-4">
          {steps.map((step, index) => {
            const isActive = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            
            return (
              <div key={step.id} className={`flex flex-col items-center text-center ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-all ${
                  isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-muted"
                }`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <p className={`text-sm font-medium ${isCurrent ? "font-bold" : ""}`}>{step.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 space-x-6">
              <TabsTrigger value="details" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3">Details</TabsTrigger>
              <TabsTrigger value="documents" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3">Documents</TabsTrigger>
              <TabsTrigger value="terms" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-3">Term Sheet</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Application Details</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Property Details</h4>
                    <div className="space-y-1">
                      <p><span className="font-semibold">Purchase Price:</span> ${application.formData.purchasePrice.toLocaleString()}</p>
                      <p><span className="font-semibold">Down Payment:</span> ${application.formData.downPayment.toLocaleString()}</p>
                      <p><span className="font-semibold">Property Type:</span> {application.formData.propertyType}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Borrower Info</h4>
                    <div className="space-y-1">
                      <p><span className="font-semibold">Name:</span> {application.formData.firstName} {application.formData.lastName}</p>
                      <p><span className="font-semibold">Email:</span> {application.formData.email}</p>
                      <p><span className="font-semibold">Credit Score:</span> {application.formData.creditScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="pt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                  <CardDescription>Upload pending items to move to the next stage</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {["Purchase Contract", "Scope of Work", "Bank Statements", "Entity Docs"].map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-muted/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <span className="font-medium">{doc}</span>
                      </div>
                      {application.documents && application.documents.includes(doc) ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3 mr-1"/> Received</Badge>
                      ) : (
                        <Button size="sm" variant="outline" onClick={handleUpload}>
                          <Upload className="w-4 h-4 mr-2" />
                          Upload
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="terms" className="pt-6">
               {application.status === "submitted" || application.status === "underwriting" ? (
                 <Card className="bg-muted/30 border-dashed">
                   <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                     <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                     <h3 className="text-lg font-semibold mb-2">Term Sheet Processing</h3>
                     <p className="text-muted-foreground max-w-md">
                       Your application is currently being reviewed. Once preliminary underwriting is complete, your term sheet will appear here.
                     </p>
                   </CardContent>
                 </Card>
               ) : (
                 <Card className="border-primary/20 shadow-lg bg-primary/5">
                   <CardHeader>
                     <CardTitle className="text-primary">Conditional Approval Issued</CardTitle>
                     <CardDescription>Please review and accept the terms below</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                     <div className="grid grid-cols-3 gap-4 text-center">
                       <div className="bg-white p-4 rounded-lg shadow-sm">
                         <p className="text-xs text-muted-foreground uppercase">Interest Rate</p>
                         <p className="text-2xl font-bold text-primary">7.125%</p>
                       </div>
                       <div className="bg-white p-4 rounded-lg shadow-sm">
                         <p className="text-xs text-muted-foreground uppercase">LTV</p>
                         <p className="text-2xl font-bold text-primary">75%</p>
                       </div>
                       <div className="bg-white p-4 rounded-lg shadow-sm">
                         <p className="text-xs text-muted-foreground uppercase">Term</p>
                         <p className="text-2xl font-bold text-primary">30 Yr</p>
                       </div>
                     </div>
                     <Button className="w-full" size="lg" onClick={() => toast.success("Terms Accepted! Moving to final processing.")}>
                       Accept Terms & Proceed
                     </Button>
                   </CardContent>
                 </Card>
               )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Loan Officer</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                JD
              </div>
              <div>
                <p className="font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Senior Underwriter</p>
                <Button variant="link" className="h-auto p-0 text-xs">john.doe@investee.com</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
               <CardTitle>Need Help?</CardTitle>
             </CardHeader>
             <CardContent className="space-y-2">
               <p className="text-sm text-muted-foreground">Our support team is available 9am - 6pm EST.</p>
               <Button variant="outline" className="w-full">Contact Support</Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
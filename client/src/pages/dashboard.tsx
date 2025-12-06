import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, Bell, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("loanApplications") || "[]");
    // Add default status if missing
    const withStatus = stored.map((app: any) => ({
      ...app,
      status: app.status || "submitted"
    }));
    setApplications(withStatus);
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case "submitted": return "bg-blue-100 text-blue-700";
      case "underwriting": return "bg-yellow-100 text-yellow-700";
      case "approved": return "bg-green-100 text-green-700";
      case "funded": return "bg-purple-100 text-purple-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Investor Dashboard</h1>
            <p className="text-muted-foreground">Track your loan applications and offers</p>
        </div>
        <div className="flex gap-3">
            <Link href="/admin">
                <Button variant="outline" className="hidden md:flex">
                   Admin View
                </Button>
            </Link>
            <Button>
                <Bell className="w-4 h-4 mr-2" />
                Notifications
            </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{applications.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {applications.filter(a => a.status === "submitted").length} Awaiting Review
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Requested Volume</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    ${applications.reduce((sum, app) => sum + (app.loanAmount || 0), 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all active deals</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Offers Received</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600">
                     {applications.filter(a => a.status === "approved").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Ready for acceptance</p>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold">My Applications</h2>
            <Link href="/calculator">
                <Button>Start New Application</Button>
            </Link>
        </div>

        <Card>
            <CardContent className="p-0">
                {applications.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-medium">No active applications</p>
                        <p className="text-sm mb-4">Start a new loan request to get matched with lenders.</p>
                        <Link href="/calculator">
                            <Button variant="outline">Request Loan Offers</Button>
                        </Link>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b last:border-0 hover:bg-muted/5 transition-colors gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg text-primary hidden sm:block">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-lg">
                                            {app.formData.loanType} Loan
                                        </h3>
                                        <Badge className={getStatusColor(app.status)} variant="secondary">
                                            {app.status.toUpperCase().replace("_", " ")}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {app.formData.propertyType} • Requested: ${app.loanAmount?.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Submitted on {new Date(app.submittedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <Link href={`/loan/${app.id}`}>
                                <Button variant="outline" className="w-full md:w-auto group">
                                    View Status
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Check, Clock, FileText, Search, AlertCircle } from "lucide-react";

interface Application {
  id: number;
  submittedAt: string;
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    loanType: string;
    propertyType: string;
    purchasePrice: number;
    downPayment: number;
  };
  status?: string; // submitted, underwriting, approved, funded, rejected
  loanAmount: number;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/applications");
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      const updated = applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      );
      setApplications(updated);
      toast.success(`Application status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "submitted": return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "underwriting": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "approved": return "bg-green-100 text-green-700 hover:bg-green-100";
      case "funded": return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "rejected": return "bg-red-100 text-red-700 hover:bg-red-100";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-8 min-h-screen bg-muted/10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Lender Admin Portal</h1>
          <p className="text-muted-foreground">Manage loan pipeline and processing</p>
        </div>
        <Button variant="outline">
          Export Report
        </Button>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(a => a.status === "submitted" || a.status === "underwriting").length}
            </div>
            <p className="text-xs text-muted-foreground">In Processing</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(a => a.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">Approved / Clear to Close</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              ${applications.reduce((sum, app) => sum + app.loanAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total Pipeline Volume</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Loan Pipeline</CardTitle>
          <CardDescription>Manage application statuses and workflow</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Loading applications...</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
              No applications found. Submit one from the calculator page first.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>App ID</TableHead>
                  <TableHead>Borrower</TableHead>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-mono text-xs">#{app.id.substring(0, 8)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{app.firstName} {app.lastName}</div>
                      <div className="text-xs text-muted-foreground">{app.email}</div>
                    </TableCell>
                    <TableCell>{app.loanType}</TableCell>
                    <TableCell>${app.loanAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(app.status || "submitted")}>
                        {(app.status || "submitted").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={app.status || "submitted"} 
                        onValueChange={(val) => updateStatus(app.id, val)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="submitted">Submitted</SelectItem>
                          <SelectItem value="underwriting">Underwriting</SelectItem>
                          <SelectItem value="approved">Conditional Approval</SelectItem>
                          <SelectItem value="funded">Funded</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
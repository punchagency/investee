import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, Building2, TrendingUp, DollarSign, Bell } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Investor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Demo User</p>
        </div>
        <Button>
            <Bell className="w-4 h-4 mr-2" />
            Notifications
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Deals</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">2 Underwriting, 1 Closing</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$1,250,000</div>
                <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Available Credit</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">$4,500,000</div>
                <p className="text-xs text-muted-foreground mt-1">Pre-approved for new deals</p>
            </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-heading font-semibold">Recent Activity</h2>
        <Card>
            <CardContent className="p-0">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/20 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="bg-primary/10 p-2 rounded-full text-primary">
                                <Building2 className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-medium">Property Inquiry #{1000 + i}</p>
                                <p className="text-sm text-muted-foreground">123 Investment Lane, PA</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">
                            View Status
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
        
        <div className="flex justify-center mt-8">
            <Link href="/search">
                <Button size="lg" variant="outline">
                    Start New Deal Search
                </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}

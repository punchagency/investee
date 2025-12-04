import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { searchProperties, generateQuote, calculateDSCR, calculateFixFlip, submitApplication, Property } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, Calculator, DollarSign, Building, Percent, 
  CheckCircle2, AlertCircle, FileText, Send
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

export default function AnalysisPage() {
  const [, params] = useRoute("/analysis/:id");
  const propertyId = params?.id ? parseInt(params.id) : null;

  // Fetch property details
  const { data: properties } = useQuery({
    queryKey: ["properties"],
    queryFn: () => searchProperties({}), // In real app, would fetch single by ID
    staleTime: Infinity
  });

  const property = properties?.find(p => p.id === propertyId);

  // State for calculators
  const [activeTab, setActiveTab] = useState("overview");
  const [quote, setQuote] = useState<any>(null);
  const [calcResult, setCalcResult] = useState<any>(null);

  // Mutations
  const quoteMutation = useMutation({
    mutationFn: generateQuote,
    onSuccess: (data) => {
      setQuote(data);
      toast({
        title: "Quote Generated",
        description: `Approved for $${data.loanAmount.toLocaleString()}`,
      });
    }
  });

  const dscrMutation = useMutation({
    mutationFn: calculateDSCR,
    onSuccess: (data) => setCalcResult(data)
  });

  const flipMutation = useMutation({
    mutationFn: calculateFixFlip,
    onSuccess: (data) => setCalcResult(data)
  });

  const applyMutation = useMutation({
    mutationFn: submitApplication,
    onSuccess: () => {
      toast({
        title: "Application Received",
        description: "Our team will contact you shortly.",
      });
    }
  });

  // Auto-run calculators when property loads
  useEffect(() => {
    if (property && !quote) {
      quoteMutation.mutate({
        propertyId: property.id,
        investmentType: property.investmentType
      });
    }
  }, [property]);

  useEffect(() => {
    if (property && quote) {
      if (property.investmentType === "DSCR") {
        dscrMutation.mutate({
          loanAmount: quote.loanAmount,
          interestRate: quote.interestRate,
          termYears: quote.termYears,
          rent: property.estRent || 0,
          taxes: property.taxes,
          insurance: property.insurance
        });
      } else {
        flipMutation.mutate({
          purchasePrice: property.purchasePrice,
          rehabBudget: property.rehab || 0,
          arv: property.estARV || property.purchasePrice * 1.5,
          holdingMonths: 6,
          monthlyCosts: 1200
        });
      }
    }
  }, [property, quote]);


  if (!property) return <div className="p-8">Loading property...</div>;

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-8 min-h-screen">
      <div className="mb-6">
        <Link href="/search">
          <Button variant="ghost" className="pl-0 hover:pl-2 transition-all text-muted-foreground hover:text-primary">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Property Details & Quote */}
        <div className="space-y-6">
          <Card className="border-border/60 shadow-sm overflow-hidden">
            <div className="h-32 bg-muted relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-muted" />
                <Badge className="absolute top-4 left-4 bg-background/90 text-foreground backdrop-blur">
                    {property.investmentType}
                </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl font-heading">{property.address}</CardTitle>
              <CardDescription>{property.state}, USA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Purchase Price</span>
                  <p className="text-lg font-semibold">${property.purchasePrice.toLocaleString()}</p>
                </div>
                <div className="space-y-1">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {property.investmentType === "DSCR" ? "Est. Rent" : "Est. ARV"}
                    </span>
                  <p className="text-lg font-semibold">
                    ${(property.investmentType === "DSCR" ? property.estRent : property.estARV)?.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3 pt-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                   <FileText className="w-4 h-4 text-primary" />
                   Live Quote
                </h4>
                {quote ? (
                    <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Loan Amount</span>
                            <span className="font-bold text-primary">${quote.loanAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rate</span>
                            <span className="font-medium">{quote.interestRate}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Term</span>
                            <span className="font-medium">{quote.termYears} Years</span>
                        </div>
                         <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">LTV</span>
                            <span className="font-medium">80%</span>
                        </div>
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center text-muted-foreground text-sm animate-pulse">
                        Generating Quote...
                    </div>
                )}
              </div>
              
              <Button 
                className="w-full" 
                size="lg" 
                disabled={applyMutation.isPending}
                onClick={() => applyMutation.mutate({})}
              >
                {applyMutation.isPending ? "Submitting..." : "Submit Full Application"}
                {!applyMutation.isPending && <Send className="w-4 h-4 ml-2" />}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Analysis & Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="financials" className="w-full">
            <TabsList className="w-full justify-start h-12 bg-transparent border-b border-border rounded-none px-0 mb-6">
              <TabsTrigger value="financials" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 text-base">
                Financials
              </TabsTrigger>
              <TabsTrigger value="cashflow" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-6 text-base">
                Cash Flow
              </TabsTrigger>
            </TabsList>

            <TabsContent value="financials" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {/* KPI Cards */}
                    {calcResult && (
                        <>
                            <Card className={property.investmentType === "DSCR" ? "bg-card" : "hidden"}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">DSCR Ratio</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-4xl font-bold ${calcResult.dscr >= 1.1 ? "text-green-600" : "text-red-500"}`}>
                                            {calcResult.dscr}x
                                        </span>
                                        <Badge variant={calcResult.dscr >= 1.1 ? "default" : "destructive"}>
                                            {calcResult.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Min req: 1.10x</p>
                                </CardContent>
                            </Card>

                             <Card className={property.investmentType === "Fix & Flip" ? "bg-card" : "hidden"}>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Projected ROI</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-4xl font-bold ${calcResult.roi >= 20 ? "text-green-600" : "text-yellow-500"}`}>
                                            {calcResult.roi}%
                                        </span>
                                        <Badge variant="outline" className="uppercase">
                                            {calcResult.verdict}
                                        </Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                    
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Payment</CardTitle>
                        </CardHeader>
                        <CardContent>
                             <div className="text-4xl font-bold text-foreground">
                                ${calcResult?.monthlyDebt?.toLocaleString() || "---"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">P&I + Taxes + Insurance</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Income vs Expenses</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        {calcResult ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={[
                                    { name: 'Income', amount: property.investmentType === "DSCR" ? property.estRent : property.estARV, fill: 'var(--primary)' },
                                    { name: 'Expenses', amount: property.investmentType === "DSCR" ? calcResult.monthlyDebt : calcResult.totalBasis, fill: 'var(--destructive)' },
                                    { name: 'Net', amount: property.investmentType === "DSCR" ? (property.estRent! - calcResult.monthlyDebt) : calcResult.profit, fill: 'var(--chart-2)' }
                                ]} layout="vertical" margin={{ left: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                                    <Tooltip 
                                        cursor={{fill: 'transparent'}}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={40}>
                                        {
                                          [0, 1, 2].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 0 ? 'hsl(var(--primary))' : index === 1 ? 'hsl(var(--destructive))' : 'hsl(var(--chart-2))'} />
                                          ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center">Loading Chart...</div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
            
            <TabsContent value="cashflow">
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-muted-foreground text-center">Detailed cashflow table would go here.</p>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

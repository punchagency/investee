import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Upload, Check, Calendar, Building2, Star, ShieldCheck, Clock, Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { searchProperty, type AttomPropertyData } from "@/services/attom";

export default function Calculator() {
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    loanType: "DSCR",
    propertyType: "single-family",
    address: "",
    purchasePrice: 300000,
    estimatedValue: 300000,
    downPayment: 60000,
    creditScore: "700-739",
    // DSCR specific fields
    monthlyRent: 2500,
    annualTaxes: 4000,
    annualInsurance: 1500,
    monthlyHOA: 0,
    vacancyRate: 5,
    maintenanceRate: 5,
    interestRate: 7.5,
    loanTermYears: 30,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "email",
    agreeMarketing: false,
    agreeTerms: false,
    preferredCallTime: "morning",
    attomData: null as AttomPropertyData | null,
  });

  // DSCR Calculation Logic
  const calculateDSCR = () => {
    const loanAmount = formData.purchasePrice - formData.downPayment;
    const monthlyRate = formData.interestRate / 100 / 12;
    const numPayments = formData.loanTermYears * 12;
    
    // Monthly P&I Payment (standard mortgage formula)
    const monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    const annualDebtService = monthlyPI * 12;
    
    // Gross Annual Income
    const grossAnnualRent = formData.monthlyRent * 12;
    
    // Operating Expenses
    const vacancyLoss = grossAnnualRent * (formData.vacancyRate / 100);
    const maintenance = grossAnnualRent * (formData.maintenanceRate / 100);
    const totalOperatingExpenses = formData.annualTaxes + formData.annualInsurance + (formData.monthlyHOA * 12) + vacancyLoss + maintenance;
    
    // Net Operating Income
    const noi = grossAnnualRent - totalOperatingExpenses;
    
    // DSCR Ratio
    const dscr = noi / annualDebtService;
    
    return {
      loanAmount,
      monthlyPI: Math.round(monthlyPI),
      annualDebtService: Math.round(annualDebtService),
      grossAnnualRent,
      totalOperatingExpenses: Math.round(totalOperatingExpenses),
      noi: Math.round(noi),
      dscr: dscr.toFixed(2),
      dscrPasses: dscr >= 1.0,
      dscrStrong: dscr >= 1.25,
    };
  };

  const dscrResults = calculateDSCR();

  const progress = (step / 8) * 100;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePropertySearch = async () => {
    if (!formData.address) {
      toast.error("Please enter a property address");
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchProperty(formData.address);
      if (data) {
        setFormData(prev => ({
          ...prev,
          attomData: data,
          propertyType: data.summary.propClass === "Residential" ? "single-family" : "commercial",
          estimatedValue: data.assessment.market.mktTotalValue,
          purchasePrice: data.assessment.market.mktTotalValue, // Default to market value
          downPayment: Math.round(data.assessment.market.mktTotalValue * 0.2), // Default 20% down
        }));
        toast.success("Property found!", {
          description: `Verified data for ${data.address.line1}`,
        });
      } else {
        toast.error("Property not found");
      }
    } catch (error) {
      toast.error("Failed to fetch property data");
    } finally {
      setIsSearching(false);
    }
  };

  const handleNext = () => {
    if (step === 8) {
      if (formData.firstName === "") {
        toast.error("Please enter your first name");
        return;
      }
      if (formData.email === "") {
        toast.error("Please enter your email");
        return;
      }
      if (!formData.agreeTerms) {
        toast.error("Please agree to the terms and conditions");
        return;
      }
    }
    if (step < 8) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles([...files, file.name]);
      toast.success(`Document uploaded: ${file.name}`, {
        description: "Your document is ready for submission",
      });
    }
  };

  const handleSubmit = async () => {
    const loanAmount = formData.purchasePrice - formData.downPayment;
    
    const applicationData = {
      loanType: formData.loanType,
      propertyType: formData.propertyType,
      address: formData.address,
      purchasePrice: formData.purchasePrice,
      estimatedValue: formData.estimatedValue,
      downPayment: formData.downPayment,
      loanAmount,
      creditScore: formData.creditScore,
      status: "submitted",
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || "",
      preferredContact: formData.preferredContact,
      preferredCallTime: formData.preferredCallTime,
      agreeMarketing: formData.agreeMarketing ? "yes" : "no",
      documents: files,
      attomData: formData.attomData,
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      toast.success("Request submitted successfully!", {
        description: `We found 3 lender matches for your deal. Confirmation email sent to ${formData.email}`,
      });

      setShowResults(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application", {
        description: "Please try again later",
      });
    }
  };

  const loanAmount = formData.purchasePrice - formData.downPayment;
  const ltv = ((loanAmount / formData.purchasePrice) * 100).toFixed(1);

  if (showResults) {
    return (
      <div className="container max-w-4xl px-4 md:px-8 py-12 min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-heading font-bold">Matches Found!</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Based on your scenario, we've matched you with 3 lenders.
              <br />
              <span className="text-sm text-muted-foreground/80">Your application has been sent to these partners.</span>
            </p>
          </div>

          <div className="grid gap-6">
            {/* Best Match - Legacy Biz Capital */}
            <Card className="border-2 border-primary/20 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                BEST MATCH
              </div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Building2 className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold flex items-center gap-2">
                        Legacy Biz Capital
                        <Badge variant="secondary" className="text-xs font-normal bg-blue-100 text-blue-700">
                          Featured Partner
                        </Badge>
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> 4.9/5
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> 14 Day Close
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-8 w-full md:w-auto">
                    <div>
                      <p className="text-sm text-muted-foreground">Est. Rate</p>
                      <p className="text-2xl font-bold text-primary">6.5% - 7.25%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Max LTV</p>
                      <p className="text-2xl font-bold">Up to 80%</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 inline mr-1 text-green-600" />
                    Pre-qualified based on your credit score of {formData.creditScore}
                  </p>
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                    View Term Sheet
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Other Matches */}
            {[
              { name: "Premier Capital Group", rate: "7.0% - 7.75%", ltv: "75%", time: "21 Days" },
              { name: "Rapid Funders LLC", rate: "7.25% - 8.5%", ltv: "70%", time: "10 Days" },
            ].map((lender, i) => (
              <Card key={i} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="bg-muted p-3 rounded-lg">
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{lender.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs font-normal">
                            <Clock className="w-3 h-3 mr-1" /> {lender.time}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-8">
                      <div>
                        <p className="text-sm text-muted-foreground">Est. Rate</p>
                        <p className="text-xl font-bold">{lender.rate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Max LTV</p>
                        <p className="text-xl font-bold">{lender.ltv}</p>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full md:w-auto">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button variant="ghost" onClick={() => { setShowResults(false); setStep(1); }} className="text-muted-foreground">
              Start New Request
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl px-4 md:px-8 py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Request Loan Offers</h1>
          <p className="text-muted-foreground text-lg">One application. Multiple quotes. 8 simple steps.</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Step {step} of 8</span>
            <span className="text-muted-foreground">{progress.toFixed(0)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {step === 1 && "What type of financing do you need?"}
              {step === 2 && "Tell us about the property"}
              {step === 3 && "What's your investment amount?"}
              {step === 4 && (formData.loanType === "DSCR" ? "Rental Income & Expenses" : "Credit profile")}
              {step === 5 && "Credit profile"}
              {step === 6 && "Review your DSCR scenario"}
              {step === 7 && "Upload documents"}
              {step === 8 && "Contact information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Loan Type */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <Label className="text-base font-semibold">Loan Type</Label>
                <div className="space-y-3">
                  {[
                    { value: "DSCR", label: "DSCR Rental - For investment properties generating rental income", desc: "Best for buy & hold investors" },
                    { value: "Fix & Flip", label: "Fix & Flip - For renovation and resale projects", desc: "Best for active flippers" },
                    { value: "Portfolio", label: "Portfolio Loan - For multiple properties", desc: "Best for scaling investors" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateField("loanType", option.value)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        formData.loanType === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-semibold">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Property Type & Search */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Property Address</Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="e.g. 123 Main St, Austin, TX" 
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                    />
                    <Button onClick={handlePropertySearch} disabled={isSearching}>
                      {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Search powered by ATTOM Data Solutions
                  </p>
                </div>

                {formData.attomData && (
                   <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                     <div className="flex items-start gap-3">
                       <Check className="w-5 h-5 text-blue-600 mt-0.5" />
                       <div>
                         <p className="font-semibold text-blue-900">Verified Property Data Found</p>
                         <p className="text-sm text-blue-700">
                           {formData.attomData.summary.propClass} • Built {formData.attomData.summary.yearBuilt} • {formData.attomData.building.rooms.beds} Beds / {formData.attomData.building.rooms.bathsTotal} Baths
                         </p>
                         <p className="text-sm text-blue-700 font-medium mt-1">
                           Est. Market Value: ${formData.attomData.assessment.market.mktTotalValue.toLocaleString()}
                         </p>
                       </div>
                     </div>
                   </div>
                )}

                <div className="space-y-2">
                  <Label className="text-base font-semibold">Property Type</Label>
                  <Select value={formData.propertyType} onValueChange={(v) => updateField("propertyType", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-family">Single Family Home</SelectItem>
                      <SelectItem value="multi-family">Multi-Family (2-4 units)</SelectItem>
                      <SelectItem value="apartment">Apartment Building</SelectItem>
                      <SelectItem value="commercial">Commercial Property</SelectItem>
                      <SelectItem value="mixed-use">Mixed Use</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {/* Step 3: Investment Amount */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <Label>Purchase Price: ${formData.purchasePrice.toLocaleString()}</Label>
                  <Input
                    type="range"
                    min="50000"
                    max="2000000"
                    step="10000"
                    value={formData.purchasePrice}
                    onChange={(e) => updateField("purchasePrice", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Down Payment: ${formData.downPayment.toLocaleString()} ({((formData.downPayment / formData.purchasePrice) * 100).toFixed(0)}%)</Label>
                  <Input
                    type="range"
                    min="0"
                    max={formData.purchasePrice * 0.5}
                    step="5000"
                    value={formData.downPayment}
                    onChange={(e) => updateField("downPayment", parseInt(e.target.value))}
                    className="mt-2"
                  />
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mt-6">
                  <p className="text-sm text-muted-foreground">Estimated Loan Amount</p>
                  <p className="text-3xl font-bold text-primary">${loanAmount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">LTV: {ltv}%</p>
                </div>
              </motion.div>
            )}

            {/* Step 4: DSCR Rental Income & Expenses */}
            {step === 4 && formData.loanType === "DSCR" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label className="text-base font-semibold">Monthly Rental Income</Label>
                    <Input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => updateField("monthlyRent", parseInt(e.target.value) || 0)}
                      className="mt-2 text-lg"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Expected or actual monthly rent</p>
                  </div>
                  
                  <div>
                    <Label>Annual Property Taxes</Label>
                    <Input
                      type="number"
                      value={formData.annualTaxes}
                      onChange={(e) => updateField("annualTaxes", parseInt(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Annual Insurance</Label>
                    <Input
                      type="number"
                      value={formData.annualInsurance}
                      onChange={(e) => updateField("annualInsurance", parseInt(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Monthly HOA (if any)</Label>
                    <Input
                      type="number"
                      value={formData.monthlyHOA}
                      onChange={(e) => updateField("monthlyHOA", parseInt(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label>Interest Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.125"
                      value={formData.interestRate}
                      onChange={(e) => updateField("interestRate", parseFloat(e.target.value) || 0)}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className={`rounded-lg p-4 border-2 ${dscrResults.dscrStrong ? 'bg-green-50 border-green-200' : dscrResults.dscrPasses ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your DSCR</span>
                    <span className={`text-3xl font-bold ${dscrResults.dscrStrong ? 'text-green-600' : dscrResults.dscrPasses ? 'text-yellow-600' : 'text-red-600'}`}>
                      {dscrResults.dscr}
                    </span>
                  </div>
                  <p className={`text-sm ${dscrResults.dscrStrong ? 'text-green-700' : dscrResults.dscrPasses ? 'text-yellow-700' : 'text-red-700'}`}>
                    {dscrResults.dscrStrong ? 'Strong qualification! Most lenders require 1.0+' : dscrResults.dscrPasses ? 'Meets minimum requirements (1.0+)' : 'Below 1.0 - may need higher down payment or rent'}
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div>NOI: ${dscrResults.noi.toLocaleString()}/yr</div>
                    <div>Debt Service: ${dscrResults.annualDebtService.toLocaleString()}/yr</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Credit Score (for non-DSCR) / Step 5: Credit Score (for DSCR) */}
            {((step === 4 && formData.loanType !== "DSCR") || step === 5) && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <Label className="text-base font-semibold">Credit Score Range</Label>
                <div className="space-y-3">
                  {[
                    { value: "740+", label: "Excellent (740+)", color: "text-green-600" },
                    { value: "700-739", label: "Good (700-739)", color: "text-blue-600" },
                    { value: "660-699", label: "Average (660-699)", color: "text-yellow-600" },
                    { value: "600-659", label: "Fair (600-659)", color: "text-orange-600" },
                    { value: "<600", label: "Poor (<600)", color: "text-red-600" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateField("creditScore", option.value)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        formData.creditScore === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <span className={`font-semibold ${option.color}`}>{option.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 6: Review with DSCR Analysis */}
            {step === 6 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="bg-muted rounded-lg p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Type</p>
                      <p className="font-semibold text-lg">{formData.loanType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Property Type</p>
                      <p className="font-semibold text-lg">{formData.propertyType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Price</p>
                      <p className="font-semibold text-lg">${formData.purchasePrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Loan Amount</p>
                      <p className="font-semibold text-lg text-primary">${loanAmount.toLocaleString()}</p>
                    </div>
                    {formData.loanType === "DSCR" && (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Rent</p>
                          <p className="font-semibold text-lg">${formData.monthlyRent.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">DSCR Ratio</p>
                          <p className={`font-semibold text-lg ${dscrResults.dscrStrong ? 'text-green-600' : dscrResults.dscrPasses ? 'text-yellow-600' : 'text-red-600'}`}>
                            {dscrResults.dscr}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly P&I</p>
                          <p className="font-semibold text-lg">${dscrResults.monthlyPI.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">NOI</p>
                          <p className="font-semibold text-lg">${dscrResults.noi.toLocaleString()}/yr</p>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground">Credit Score</p>
                      <p className="font-semibold text-lg">{formData.creditScore}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center py-4">
                  Everything look good? Next, we'll need to collect some supporting documents.
                </p>
              </motion.div>
            )}

            {/* Step 7: Document Upload */}
            {step === 7 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-4 block">Upload Supporting Documents</Label>
                  <p className="text-sm text-muted-foreground mb-4">Upload recent documents to speed up approval (2 of 3 recommended):</p>
                  
                  <div className="space-y-3">
                    {[
                      { name: "Tax Returns", desc: "Last 2 years" },
                      { name: "Pay Stubs", desc: "Recent 30-60 days" },
                      { name: "Bank Statements", desc: "Recent 2-3 months" },
                      { name: "Property Purchase Contract", desc: "If under contract" },
                    ].map((doc) => (
                      <label key={doc.name} className="flex items-center gap-3 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <input type="file" className="hidden" onChange={handleFileUpload} />
                        <Upload className="w-5 h-5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-xs text-muted-foreground">{doc.desc}</p>
                        </div>
                        {files.includes(doc.name) && <Check className="w-5 h-5 text-green-600" />}
                      </label>
                    ))}
                  </div>

                  {files.length > 0 && (
                    <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-900">{files.length} document(s) ready to upload</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 Documents are kept secure and encrypted. We only use them to verify your income and creditworthiness.
                </p>
              </motion.div>
            )}

            {/* Step 8: Contact Info & Lead Capture */}
            {step === 8 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Preferred Contact Method</Label>
                  <Select value={formData.preferredContact} onValueChange={(v) => updateField("preferredContact", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="phone">Phone Call</SelectItem>
                      <SelectItem value="both">Both</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Best Time to Reach You</Label>
                  <Select value={formData.preferredCallTime} onValueChange={(v) => updateField("preferredCallTime", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                      <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                      <SelectItem value="evening">Evening (5pm - 8pm)</SelectItem>
                      <SelectItem value="any">Any time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 bg-muted/40 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="marketing"
                      checked={formData.agreeMarketing}
                      onCheckedChange={(checked) => updateField("agreeMarketing", checked)}
                    />
                    <label htmlFor="marketing" className="text-sm cursor-pointer leading-relaxed">
                      I'd like to receive updates about loan products, market insights, and investment opportunities from Investee
                    </label>
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => updateField("agreeTerms", checked)}
                    />
                    <label htmlFor="terms" className="text-sm cursor-pointer leading-relaxed">
                      I agree to the Terms of Service and acknowledge my information will be used to match me with lenders <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-900">
                    <Clock className="w-4 h-4 inline mr-2" />
                    <span className="font-medium">What happens next?</span> We'll instantly match you with lenders who fit your criteria.
                  </p>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {step === 8 ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2"
            >
              Get My Offers
              <Check className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
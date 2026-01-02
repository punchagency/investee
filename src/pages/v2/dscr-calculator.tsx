import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  DollarSign,
  TrendingUp,
  FileText,
  Share2,
  Save,
  Check,
  Building2,
  Star,
  ShieldCheck,
  Clock,
  Search,
  Loader2,
  Send,
  X,
  Percent,
  Calculator,
  Wallet,
  PiggyBank,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchProperty, type AttomPropertyData } from "@/services/attom";
import {
  calculateDSCR,
  estimateMonthlyTaxes,
  estimateMonthlyInsurance,
  calculateLTV,
  calculateCashOnCash,
  formatCurrency,
  type DSCRInputs,
} from "@/lib/dscr";
import {
  DSCRIndicator,
  DSCRSummary,
  DSCRTrafficLight,
} from "@/components/dscr-indicator";
import { createApplication } from "@/services/ApplicationServices";

// Parse URL search params
function useURLParams() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  return {
    address: params.get("address") || "",
    price: parseInt(params.get("price") || "0") || 0,
  };
}

export default function DSCRCalculator() {
  const urlParams = useURLParams();
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Calculate initial values based on URL params
  const initialPrice = urlParams.price || 350000;
  const initialTaxes = estimateMonthlyTaxes(initialPrice);
  const initialInsurance = estimateMonthlyInsurance(initialPrice);

  const [formData, setFormData] = useState({
    // Property info
    address: urlParams.address,
    propertyType: "Single Family",
    sqft: "",
    beds: "",
    baths: "",

    // Income
    monthlyRent: 2500,

    // Loan Terms
    purchasePrice: initialPrice,
    downPaymentPercent: 25,
    interestRate: 7.5,
    loanTermYears: 30,

    // Expenses
    monthlyTaxes: initialTaxes,
    monthlyInsurance: initialInsurance,
    monthlyHOA: 0,

    // Application fields
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    creditScore: "700-739",
    preferredContact: "email",
    agreeTerms: false,
    agreeMarketing: false,

    // ATTOM data
    attomData: null as AttomPropertyData | null,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-estimate taxes and insurance when purchase price changes
  const handlePurchasePriceChange = (price: number) => {
    updateField("purchasePrice", price);
    updateField("monthlyTaxes", estimateMonthlyTaxes(price));
    updateField("monthlyInsurance", estimateMonthlyInsurance(price));
  };

  // Calculate DSCR and related metrics
  const dscrResult = useMemo(() => {
    const inputs: DSCRInputs = {
      monthlyRent: formData.monthlyRent,
      purchasePrice: formData.purchasePrice,
      downPaymentPercent: formData.downPaymentPercent,
      interestRate: formData.interestRate,
      loanTermYears: formData.loanTermYears,
      monthlyTaxes: formData.monthlyTaxes,
      monthlyInsurance: formData.monthlyInsurance,
      monthlyHOA: formData.monthlyHOA,
    };
    return calculateDSCR(inputs);
  }, [formData]);

  // Additional calculated values
  const ltv = calculateLTV(dscrResult.loanAmount, formData.purchasePrice);
  const downPayment =
    formData.purchasePrice * (formData.downPaymentPercent / 100);
  const cashOnCash = calculateCashOnCash(
    dscrResult.annualNetCashFlow,
    downPayment
  );

  const handlePropertySearch = async () => {
    if (!formData.address) {
      toast.error("Please enter a property address");
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchProperty(formData.address);
      if (data) {
        const marketValue =
          data.assessment?.market?.mktTotalValue ||
          data.assessment?.assessed?.assdTotalValue ||
          0;
        // Use bldgSize as fallback since livingSize may not be available
        const sqftValue =
          data.building?.size?.bldgSize || data.building?.size?.grossSize || 0;

        setFormData((prev) => ({
          ...prev,
          attomData: data,
          propertyType:
            data.summary?.propClass === "Residential"
              ? "Single Family"
              : "Commercial",
          purchasePrice: marketValue,
          sqft: sqftValue > 0 ? sqftValue.toLocaleString() : "",
          beds: data.building?.rooms?.beds?.toString() || "",
          baths: data.building?.rooms?.bathsTotal?.toString() || "",
          monthlyTaxes: estimateMonthlyTaxes(marketValue),
          monthlyInsurance: estimateMonthlyInsurance(marketValue),
        }));
        toast.success("Property found!", {
          description: `Verified data for ${data.address?.line1}`,
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

  const handleSubmitApplication = async () => {
    if (!formData.firstName || !formData.email) {
      toast.error("Please fill in required fields");
      return;
    }
    if (!formData.agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    const applicationData = {
      loanType: "DSCR",
      propertyType: formData.propertyType,
      address: formData.address,
      purchasePrice: formData.purchasePrice,
      estimatedValue: formData.purchasePrice,
      downPayment: downPayment,
      loanAmount: dscrResult.loanAmount,
      creditScore: formData.creditScore,
      status: "submitted",
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || "",
      preferredContact: formData.preferredContact,
      agreeMarketing: formData.agreeMarketing ? "yes" : "no",
      attomData: formData.attomData,
      // DSCR specific data
      monthlyRent: formData.monthlyRent,
      dscr: dscrResult.dscr,
      monthlyNetCashFlow: dscrResult.monthlyNetCashFlow,
    };

    try {
      const response = await createApplication(applicationData);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error("Failed to submit application");
      }

      toast.success("Application submitted!", {
        description: "We'll match you with lenders shortly.",
      });

      setShowApplyModal(false);
      setShowResults(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h1 className="text-4xl font-bold">DSCR Loan Matches Found!</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Based on your DSCR of {dscrResult.dscr}x, we've matched you with
              lenders.
            </p>
          </motion.div>

          <div className="grid gap-6">
            {/* Best Match */}
            <div className="bg-white border-2 border-primary/20 rounded-xl p-6 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                BEST MATCH
              </div>
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Building2 className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      Legacy Biz Capital
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal bg-blue-100 text-blue-700"
                      >
                        Featured Partner
                      </Badge>
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{" "}
                        4.9/5
                      </Badge>
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3" /> 21 Day Close
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 w-full md:w-auto">
                  <div>
                    <p className="text-sm text-slate-500">Est. Rate</p>
                    <p className="text-2xl font-bold text-primary">
                      {dscrResult.dscr >= 1.25
                        ? "7.0% - 8.5%"
                        : dscrResult.dscr >= 1.1
                        ? "8.0% - 9.5%"
                        : "9.5% - 11%"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Max LTV</p>
                    <p className="text-2xl font-bold">80%</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
                <p className="text-sm text-slate-500">
                  <ShieldCheck className="w-4 h-4 inline mr-1 text-green-600" />
                  Pre-qualified for DSCR loan with{" "}
                  {formatCurrency(dscrResult.monthlyNetCashFlow)}/mo cash flow
                </p>
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                >
                  View Term Sheet
                </Button>
              </div>
            </div>

            {/* Other Matches */}
            {[
              {
                name: "DSCR Lending Group",
                rate: "7.5% - 9.0%",
                ltv: "75%",
                time: "30 Days",
              },
              {
                name: "Rental Property Loans",
                rate: "8.0% - 9.5%",
                ltv: "80%",
                time: "25 Days",
              },
            ].map((lender, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                  <div className="flex items-start gap-4">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <Building2 className="w-6 h-6 text-slate-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{lender.name}</h3>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal mt-1"
                      >
                        <Clock className="w-3 h-3 mr-1" /> {lender.time}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-sm text-slate-500">Est. Rate</p>
                      <p className="text-xl font-bold">{lender.rate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Max LTV</p>
                      <p className="text-xl font-bold">{lender.ltv}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full md:w-auto">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center pt-8">
            <Button
              variant="ghost"
              onClick={() => {
                setShowResults(false);
              }}
              className="text-slate-500"
            >
              Back to Calculator
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)] bg-white">
      {/* Main Calculator Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 p-6 sticky top-0 z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 max-w-5xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  DSCR Calculator
                </h1>
                <p className="text-slate-500 text-sm">
                  Calculate Debt Service Coverage Ratio for rental properties
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="shadow-sm">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 shadow-sm"
              >
                <Save className="h-4 w-4 mr-2" /> Save Analysis
              </Button>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="flex-1 overflow-y-auto p-6 pb-24 lg:pb-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Property Section */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">
                  Property
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Property Address
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      placeholder="123 Main St, City, State"
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handlePropertySearch}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Property Type
                  </Label>
                  <Select
                    value={formData.propertyType}
                    onValueChange={(v) => updateField("propertyType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single Family">
                        Single Family
                      </SelectItem>
                      <SelectItem value="Multi-Family">
                        Multi-Family (2-4 units)
                      </SelectItem>
                      <SelectItem value="Condo">Condo</SelectItem>
                      <SelectItem value="Townhouse">Townhouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                      Beds
                    </Label>
                    <Input
                      type="number"
                      value={formData.beds}
                      onChange={(e) => updateField("beds", e.target.value)}
                      placeholder="3"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                      Baths
                    </Label>
                    <Input
                      type="number"
                      value={formData.baths}
                      onChange={(e) => updateField("baths", e.target.value)}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                      Sq Ft
                    </Label>
                    <Input
                      value={formData.sqft}
                      onChange={(e) => updateField("sqft", e.target.value)}
                      placeholder="1,800"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Income Section */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="bg-green-100 p-1.5 rounded-md text-green-600">
                  <Wallet className="h-5 w-5" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">
                  Rental Income
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Monthly Rent
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600 font-bold">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) =>
                        updateField(
                          "monthlyRent",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="pl-7 tabular-nums text-lg font-semibold border-l-4 border-l-green-500"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Expected monthly rental income
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-600">Annual Rental Income</span>
                    <span className="text-green-700 font-bold tabular-nums">
                      {formatCurrency(formData.monthlyRent * 12)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">
                      Gross Rent Multiplier
                    </span>
                    <span className="text-slate-900 font-semibold tabular-nums">
                      {formData.purchasePrice > 0
                        ? (
                            formData.purchasePrice /
                            (formData.monthlyRent * 12)
                          ).toFixed(1)
                        : "0"}
                      x
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Loan Terms Section */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="bg-blue-100 p-1.5 rounded-md text-blue-600">
                  <PiggyBank className="h-5 w-5" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">
                  Loan Terms
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Purchase Price
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) =>
                        handlePurchasePriceChange(parseInt(e.target.value) || 0)
                      }
                      className="pl-7 tabular-nums"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                      Down Payment %
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={formData.downPaymentPercent}
                        onChange={(e) =>
                          updateField(
                            "downPaymentPercent",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="pr-8 tabular-nums"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                      Interest Rate
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.125"
                        value={formData.interestRate}
                        onChange={(e) =>
                          updateField(
                            "interestRate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="pr-8 tabular-nums"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Loan Term
                  </Label>
                  <Select
                    value={formData.loanTermYears.toString()}
                    onValueChange={(v) =>
                      updateField("loanTermYears", parseInt(v))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 years</SelectItem>
                      <SelectItem value="25">25 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-600">Loan Amount</span>
                    <span className="text-slate-900 font-bold tabular-nums">
                      {formatCurrency(dscrResult.loanAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-600">LTV Ratio</span>
                    <span className="text-slate-900 font-semibold tabular-nums">
                      {ltv}%
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Expenses Section */}
            <section className="flex flex-col gap-5 md:col-span-2 xl:col-span-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="bg-red-100 p-1.5 rounded-md text-red-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">
                  Monthly Expenses
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Property Taxes (Monthly)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.monthlyTaxes}
                      onChange={(e) =>
                        updateField(
                          "monthlyTaxes",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="pl-7 tabular-nums"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-estimated at 1.25% annually
                  </p>
                </div>
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Insurance (Monthly)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.monthlyInsurance}
                      onChange={(e) =>
                        updateField(
                          "monthlyInsurance",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="pl-7 tabular-nums"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Auto-estimated at 0.5% annually
                  </p>
                </div>
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    HOA Fees (Monthly)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.monthlyHOA}
                      onChange={(e) =>
                        updateField("monthlyHOA", parseInt(e.target.value) || 0)
                      }
                      className="pl-7 tabular-nums"
                      placeholder="0"
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Optional - if applicable
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* DSCR Analysis Sidebar - Desktop */}
      <aside className="hidden lg:flex w-80 xl:w-96 flex-col bg-slate-50 border-l border-slate-200 h-full overflow-y-auto">
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            DSCR Analysis
          </h2>

          {/* DSCR Indicator */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm flex flex-col items-center">
            <DSCRIndicator
              dscr={dscrResult.dscr}
              status={dscrResult.status}
              statusColor={dscrResult.statusColor}
              size="lg"
            />
            <p className="text-sm text-slate-600 mt-4 text-center">
              {dscrResult.message}
            </p>
          </div>

          {/* Cash Flow */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Monthly Cash Flow
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Rental Income</span>
                <span className="text-green-600 font-semibold tabular-nums">
                  +{formatCurrency(formData.monthlyRent)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Mortgage (P&I)</span>
                <span className="text-red-500 font-semibold tabular-nums">
                  -{formatCurrency(dscrResult.monthlyMortgage)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Taxes</span>
                <span className="text-red-500 font-semibold tabular-nums">
                  -{formatCurrency(formData.monthlyTaxes)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Insurance</span>
                <span className="text-red-500 font-semibold tabular-nums">
                  -{formatCurrency(formData.monthlyInsurance)}
                </span>
              </div>
              {formData.monthlyHOA > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">HOA</span>
                  <span className="text-red-500 font-semibold tabular-nums">
                    -{formatCurrency(formData.monthlyHOA)}
                  </span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="font-semibold text-slate-900">
                  Net Cash Flow
                </span>
                <span
                  className={`text-xl font-bold tabular-nums ${
                    dscrResult.monthlyNetCashFlow >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }`}
                >
                  {formatCurrency(dscrResult.monthlyNetCashFlow)}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">
                Annual Cash Flow
              </p>
              <p
                className={`text-xl font-bold tabular-nums ${
                  dscrResult.annualNetCashFlow >= 0
                    ? "text-slate-900"
                    : "text-red-500"
                }`}
              >
                {formatCurrency(dscrResult.annualNetCashFlow)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">
                Cash on Cash
              </p>
              <p className="text-slate-900 text-xl font-bold tabular-nums">
                {cashOnCash.toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">
                Down Payment
              </p>
              <p className="text-slate-900 text-xl font-bold tabular-nums">
                {formatCurrency(downPayment)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">
                Total Debt Service
              </p>
              <p className="text-slate-900 text-xl font-bold tabular-nums">
                {formatCurrency(dscrResult.totalDebtService)}
              </p>
            </div>
          </div>

          {/* Qualification Status */}
          <div
            className={`p-4 rounded-xl text-center font-medium mb-6 ${
              dscrResult.qualifies
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {dscrResult.qualifies ? (
              <>
                <Check className="w-5 h-5 inline-block mr-2" />
                Qualifies for DSCR Loan
              </>
            ) : (
              <>
                <X className="w-5 h-5 inline-block mr-2" />
                Does Not Meet DSCR Requirements
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-auto pt-6 border-t border-slate-200 flex flex-col gap-3">
            <Button
              onClick={() => setShowApplyModal(true)}
              className="w-full bg-primary hover:bg-primary/90 font-bold"
              disabled={!dscrResult.qualifies}
            >
              <Send className="h-4 w-4 mr-2" />
              Apply for DSCR Loan
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full border-4 flex items-center justify-center font-bold ${
              dscrResult.statusColor === "green"
                ? "border-green-500 text-green-700 bg-green-50"
                : dscrResult.statusColor === "yellow"
                ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                : "border-red-500 text-red-700 bg-red-50"
            }`}
          >
            {dscrResult.dscr.toFixed(2)}x
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wide">
              Cash Flow
            </p>
            <p
              className={`text-lg font-bold tabular-nums ${
                dscrResult.monthlyNetCashFlow >= 0
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {formatCurrency(dscrResult.monthlyNetCashFlow)}/mo
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowApplyModal(true)}
          className="bg-primary hover:bg-primary/90"
          disabled={!dscrResult.qualifies}
        >
          <Send className="h-4 w-4 mr-2" />
          Apply
        </Button>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowApplyModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Apply for DSCR Loan
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    DSCR: {dscrResult.dscr}x | Cash Flow:{" "}
                    {formatCurrency(dscrResult.monthlyNetCashFlow)}/mo
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowApplyModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* Deal Summary */}
                <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Loan Amount</p>
                    <p className="font-bold text-slate-900">
                      {formatCurrency(dscrResult.loanAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Monthly Rent</p>
                    <p className="font-bold text-slate-900">
                      {formatCurrency(formData.monthlyRent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">DSCR</p>
                    <p
                      className={`font-bold ${
                        dscrResult.statusColor === "green"
                          ? "text-green-600"
                          : dscrResult.statusColor === "yellow"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {dscrResult.dscr}x
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Net Cash Flow</p>
                    <p className="font-bold text-primary">
                      {formatCurrency(dscrResult.monthlyNetCashFlow)}/mo
                    </p>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name *</Label>
                    <Input
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Email Address *</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Credit Score Range</Label>
                  <Select
                    value={formData.creditScore}
                    onValueChange={(v) => updateField("creditScore", v)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="740+">Excellent (740+)</SelectItem>
                      <SelectItem value="700-739">Good (700-739)</SelectItem>
                      <SelectItem value="660-699">Average (660-699)</SelectItem>
                      <SelectItem value="600-659">Fair (600-659)</SelectItem>
                      <SelectItem value="<600">Poor (&lt;600)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="marketing"
                      checked={formData.agreeMarketing}
                      onCheckedChange={(checked) =>
                        updateField("agreeMarketing", checked)
                      }
                    />
                    <label
                      htmlFor="marketing"
                      className="text-sm cursor-pointer leading-relaxed text-slate-600"
                    >
                      I'd like to receive updates about DSCR loan products and
                      investment opportunities
                    </label>
                  </div>
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        updateField("agreeTerms", checked)
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm cursor-pointer leading-relaxed text-slate-600"
                    >
                      I agree to the Terms of Service and acknowledge my
                      information will be used to match me with lenders{" "}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowApplyModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={handleSubmitApplication}
                >
                  Submit Application
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

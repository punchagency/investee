import { useState } from "react";
import { toast } from "sonner";
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
  Wrench,
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
  ChevronUp,
  Send,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchProperty, type AttomPropertyData } from "@/services/attom";
import { createApplication } from "@/services/ApplicationServices";

export default function Calculator() {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  const [formData, setFormData] = useState({
    // Property info
    address: "123 Maple Avenue",
    propertyType: "Single Family",
    sqft: "2,400",
    status: "Under Contract",

    // Acquisition
    purchasePrice: 350000,
    closingCosts: 12500,
    downPaymentPercent: 20,
    interestRate: 7.5,

    // Renovation & Hold
    repairBudget: 65000,
    contingencyPercent: 10,
    durationMonths: 6,
    monthlyCosts: 1200,

    // Exit Strategy
    arv: 585000,
    agentCommissionPercent: 5.0,
    sellingClosingPercent: 2.0,
    sellingExpenses: 2500,

    // Notes
    notes: "",

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

  // Calculate derived values
  const loanAmount =
    formData.purchasePrice * (1 - formData.downPaymentPercent / 100);
  const cashToClose =
    formData.purchasePrice * (formData.downPaymentPercent / 100) +
    formData.closingCosts;

  const totalRenovation =
    formData.repairBudget * (1 + formData.contingencyPercent / 100);
  const totalHoldingCosts =
    formData.monthlyCosts * formData.durationMonths +
    loanAmount * (formData.interestRate / 100 / 12) * formData.durationMonths;

  const commissions = formData.arv * (formData.agentCommissionPercent / 100);
  const sellingClosingCosts =
    formData.arv * (formData.sellingClosingPercent / 100);
  const totalSellingCosts =
    commissions + sellingClosingCosts + formData.sellingExpenses;

  const totalInvestment =
    formData.purchasePrice +
    formData.closingCosts +
    totalRenovation +
    totalHoldingCosts +
    totalSellingCosts;
  const netProfit = formData.arv - totalInvestment;
  const profitMargin = (netProfit / formData.arv) * 100;
  const roi = (netProfit / cashToClose) * 100;
  const cashOnCash = (netProfit / (cashToClose + formData.repairBudget)) * 100;

  const handlePropertySearch = async () => {
    if (!formData.address) {
      toast.error("Please enter a property address");
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchProperty(formData.address);
      if (data) {
        setFormData((prev) => ({
          ...prev,
          attomData: data,
          propertyType:
            data.summary.propClass === "Residential"
              ? "Single Family"
              : "Commercial",
          purchasePrice: data.assessment.market.mktTotalValue,
          sqft: data.building.size.bldgSize?.toLocaleString() || "N/A",
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
      loanType: "Fix & Flip",
      propertyType: formData.propertyType,
      address: formData.address,
      purchasePrice: formData.purchasePrice,
      estimatedValue: formData.arv,
      downPayment: cashToClose,
      loanAmount,
      creditScore: formData.creditScore,
      status: "submitted",
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone || "",
      preferredContact: formData.preferredContact,
      agreeMarketing: formData.agreeMarketing ? "yes" : "no",
      attomData: formData.attomData,
      // Deal specific data
      repairBudget: formData.repairBudget,
      arv: formData.arv,
      expectedProfit: netProfit,
      roi: roi.toFixed(1),
    };

    try {
      const response = await createApplication(applicationData);

      if (response.status === 201 || response.status === 200) {
        toast.success("Application submitted!", {
          description: "We'll match you with lenders shortly.",
        });
        setShowApplyModal(false);
        setShowResults(true);
      } else {
        throw new Error(
          `Failed to submit application with status: ${response.status}`
        );
      }
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
            <h1 className="text-4xl font-bold">Matches Found!</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Based on your deal analysis, we've matched you with 3 lenders.
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
                        <Clock className="w-3 h-3" /> 14 Day Close
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-8 w-full md:w-auto">
                  <div>
                    <p className="text-sm text-slate-500">Est. Rate</p>
                    <p className="text-2xl font-bold text-primary">10% - 12%</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Max LTC</p>
                    <p className="text-2xl font-bold">90%</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t flex flex-col sm:flex-row gap-4 justify-between items-center">
                <p className="text-sm text-slate-500">
                  <ShieldCheck className="w-4 h-4 inline mr-1 text-green-600" />
                  Pre-qualified for $
                  {netProfit > 0
                    ? Math.round(netProfit).toLocaleString()
                    : "N/A"}{" "}
                  profit deal
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
                name: "Rapid Flip Funding",
                rate: "11% - 13%",
                ltc: "85%",
                time: "10 Days",
              },
              {
                name: "Hard Money Direct",
                rate: "12% - 14%",
                ltc: "80%",
                time: "7 Days",
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
                      <p className="text-sm text-slate-500">Max LTC</p>
                      <p className="text-xl font-bold">{lender.ltc}</p>
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
              <div
                className="h-16 w-16 rounded-lg bg-cover bg-center shrink-0 border border-slate-200 shadow-sm"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200&q=80')`,
                }}
              ></div>
              <div>
                <div className="flex items-center gap-2">
                  <Input
                    value={formData.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="text-xl font-bold border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                  />
                  <Button
                    variant="ghost"
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
                <p className="text-slate-500 text-sm mt-0.5">
                  Springfield, IL • {formData.propertyType} • {formData.sqft}{" "}
                  sqft
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Badge className="bg-blue-50 text-blue-600 border-blue-100">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1.5"></span>
                {formData.status}
              </Badge>
              <Button variant="outline" size="sm" className="shadow-sm">
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
              <Button
                size="sm"
                className="bg-primary hover:bg-primary/90 shadow-sm"
              >
                <Save className="h-4 w-4 mr-2" /> Save Deal
              </Button>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="flex-1 overflow-y-auto p-6 pb-24 lg:pb-6">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* Acquisition Section */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                  <Home className="h-5 w-5" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">
                  Acquisition
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
                        updateField(
                          "purchasePrice",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="pl-7 tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Closing Costs
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.closingCosts}
                      onChange={(e) =>
                        updateField(
                          "closingCosts",
                          parseInt(e.target.value) || 0
                        )
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
                        step="0.1"
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
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="text-slate-500">Loan Amount</span>
                    <span className="text-slate-900 font-semibold tabular-nums">
                      ${Math.round(loanAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Cash to Close</span>
                    <span className="text-slate-900 font-semibold tabular-nums">
                      ${Math.round(cashToClose).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Renovation & Hold Section */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                  <Wrench className="h-5 w-5" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">
                  Renovation & Hold
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Repair Budget
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.repairBudget}
                      onChange={(e) =>
                        updateField(
                          "repairBudget",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="pl-7 tabular-nums"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    Contingency: {formData.contingencyPercent}%
                  </Label>
                  <Input
                    type="range"
                    min="0"
                    max="25"
                    value={formData.contingencyPercent}
                    onChange={(e) =>
                      updateField(
                        "contingencyPercent",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full accent-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                      Duration
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={formData.durationMonths}
                        onChange={(e) =>
                          updateField(
                            "durationMonths",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="pr-12 tabular-nums"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium uppercase">
                        mos
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                      Monthly Costs
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        $
                      </span>
                      <Input
                        type="number"
                        value={formData.monthlyCosts}
                        onChange={(e) =>
                          updateField(
                            "monthlyCosts",
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="pl-7 tabular-nums"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total Renovation</span>
                    <span className="text-slate-900 font-semibold tabular-nums">
                      ${Math.round(totalRenovation).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total Holding Costs</span>
                    <span className="text-slate-900 font-semibold tabular-nums">
                      ${Math.round(totalHoldingCosts).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Exit Strategy Section */}
            <section className="flex flex-col gap-5">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                  <DollarSign className="h-5 w-5" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">
                  Exit Strategy
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                    After Repair Value (ARV)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-bold">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.arv}
                      onChange={(e) =>
                        updateField("arv", parseInt(e.target.value) || 0)
                      }
                      className="pl-7 tabular-nums font-bold border-l-4 border-l-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-slate-500 text-sm font-medium mb-1.5 block">
                      Agent Comm.
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.5"
                        value={formData.agentCommissionPercent}
                        onChange={(e) =>
                          updateField(
                            "agentCommissionPercent",
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
                      Closing Costs
                    </Label>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.5"
                        value={formData.sellingClosingPercent}
                        onChange={(e) =>
                          updateField(
                            "sellingClosingPercent",
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
                    Selling Expenses ($)
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
                    <Input
                      type="number"
                      value={formData.sellingExpenses}
                      onChange={(e) =>
                        updateField(
                          "sellingExpenses",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className="pl-7 tabular-nums"
                      placeholder="Staging, etc."
                    />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Commissions</span>
                    <span className="text-slate-900 font-semibold tabular-nums">
                      ${Math.round(commissions).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Total Selling Costs</span>
                    <span className="text-slate-900 font-semibold tabular-nums">
                      ${Math.round(totalSellingCosts).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Notes Section */}
            <section className="col-span-1 md:col-span-2 xl:col-span-3 mt-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 mb-4">
                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="text-slate-900 font-semibold text-lg">Notes</h3>
              </div>
              <textarea
                className="w-full h-24 bg-white border border-slate-200 rounded-lg p-3 text-slate-900 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder-slate-400 shadow-sm"
                placeholder="Add notes about specific neighborhood comps, contractor bids, or loan terms..."
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
              ></textarea>
            </section>
          </div>
        </div>
      </div>

      {/* Deal Analysis Sidebar - Desktop */}
      <aside className="hidden lg:flex w-80 xl:w-96 flex-col bg-slate-50 border-l border-slate-200 h-full overflow-y-auto">
        <div className="p-6 flex flex-col h-full">
          <h2 className="text-slate-900 text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Deal Analysis
          </h2>

          {/* Net Profit Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6 shadow-sm text-center">
            <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
              Estimated Net Profit
            </p>
            <h1
              className={`text-4xl xl:text-5xl font-extrabold tabular-nums tracking-tight mb-3 ${
                netProfit >= 0 ? "text-primary" : "text-red-500"
              }`}
            >
              ${Math.round(netProfit).toLocaleString()}
            </h1>
            <div
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${
                profitMargin >= 15
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : profitMargin >= 10
                  ? "bg-yellow-50 text-yellow-700 border-yellow-100"
                  : "bg-red-50 text-red-700 border-red-100"
              }`}
            >
              <TrendingUp className="h-4 w-4" />
              {profitMargin.toFixed(1)}% Margin
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">
                ROI
              </p>
              <p className="text-slate-900 text-xl font-bold tabular-nums">
                {roi.toFixed(1)}%
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
                Cap Rate
              </p>
              <p className="text-slate-400 text-xl font-bold tabular-nums">
                N/A
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:border-primary/30 transition-colors">
              <p className="text-slate-500 text-xs font-semibold uppercase mb-1">
                Total Inv.
              </p>
              <p className="text-slate-900 text-xl font-bold tabular-nums">
                ${Math.round(totalInvestment / 1000)}k
              </p>
            </div>
          </div>

          {/* Profit Distribution */}
          <div className="flex-1">
            <h3 className="text-slate-900 text-sm font-semibold mb-4">
              Profit Distribution
            </h3>
            <div className="relative w-40 h-40 mx-auto mb-6">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#cbd5e1"
                  strokeWidth="10"
                  strokeDasharray="251"
                  strokeDashoffset={
                    251 -
                    251 *
                      ((formData.purchasePrice + formData.closingCosts) /
                        formData.arv)
                  }
                ></circle>
                <circle
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke="#22c55e"
                  strokeWidth="10"
                  strokeDasharray="251"
                  strokeDashoffset={251 - 251 * (netProfit / formData.arv)}
                  strokeLinecap="round"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-slate-500 uppercase font-bold">
                  ARV
                </span>
                <span className="text-slate-900 font-bold text-lg tabular-nums">
                  ${Math.round(formData.arv / 1000)}k
                </span>
              </div>
            </div>
            <div className="space-y-3 px-2">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span>
                  <span className="text-slate-500">Purchase & Close</span>
                </div>
                <span className="text-slate-900 font-medium tabular-nums">
                  $
                  {Math.round(
                    (formData.purchasePrice + formData.closingCosts) / 1000
                  )}
                  k
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-300"></span>
                  <span className="text-slate-500">Renovation</span>
                </div>
                <span className="text-slate-900 font-medium tabular-nums">
                  ${Math.round(totalRenovation / 1000)}k
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-slate-200"></span>
                  <span className="text-slate-500">Hold & Sell</span>
                </div>
                <span className="text-slate-900 font-medium tabular-nums">
                  ${Math.round((totalHoldingCosts + totalSellingCosts) / 1000)}k
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mt-3 pt-3 border-t border-slate-200 font-bold">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary shadow-sm"></span>
                  <span className="text-primary">Net Profit</span>
                </div>
                <span className="text-primary tabular-nums">
                  ${Math.round(netProfit / 1000)}k
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col gap-3">
            <Button
              onClick={() => setShowApplyModal(true)}
              className="w-full bg-primary hover:bg-primary/90 font-bold"
            >
              <Send className="h-4 w-4 mr-2" />
              Apply for Financing
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-slate-500 text-xs uppercase font-bold tracking-wide">
            Net Profit
          </p>
          <p
            className={`text-2xl font-bold tabular-nums ${
              netProfit >= 0 ? "text-primary" : "text-red-500"
            }`}
          >
            ${Math.round(netProfit).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="text-right mr-2 hidden sm:block">
            <p className="text-slate-500 text-xs uppercase font-bold tracking-wide">
              ROI
            </p>
            <p className="text-slate-900 text-lg font-bold tabular-nums">
              {roi.toFixed(1)}%
            </p>
          </div>
          <Button
            onClick={() => setShowApplyModal(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4 mr-2" />
            Apply
          </Button>
        </div>
      </div>

      {/* Apply for Financing Modal */}
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
                    Apply for Financing
                  </h2>
                  <p className="text-slate-500 text-sm mt-1">
                    Get matched with lenders for your $
                    {Math.round(netProfit).toLocaleString()} profit deal
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
                      ${Math.round(loanAmount).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">ARV</p>
                    <p className="font-bold text-slate-900">
                      ${formData.arv.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Rehab Budget</p>
                    <p className="font-bold text-slate-900">
                      ${formData.repairBudget.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Expected ROI</p>
                    <p className="font-bold text-primary">{roi.toFixed(1)}%</p>
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
                      I'd like to receive updates about loan products and
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

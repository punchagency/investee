import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Calculator() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    loanType: "DSCR",
    propertyType: "single-family",
    purchasePrice: 300000,
    estimatedValue: 300000,
    downPayment: 60000,
    creditScore: "700-739",
    employment: "employed",
    annualIncome: 100000,
  });

  const progress = (step / 6) * 100;

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    alert(`Great! Here's your scenario:\n\nLoan Type: ${formData.loanType}\nProperty: ${formData.propertyType}\nPrice: $${formData.purchasePrice.toLocaleString()}\nDown Payment: $${formData.downPayment.toLocaleString()}\nCredit Score: ${formData.creditScore}\n\nOur team will contact you with a personalized quote!`);
    setStep(1);
  };

  const loanAmount = formData.purchasePrice - formData.downPayment;
  const ltv = ((loanAmount / formData.purchasePrice) * 100).toFixed(1);

  return (
    <div className="container max-w-2xl px-4 md:px-8 py-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Mortgage Calculator</h1>
          <p className="text-muted-foreground text-lg">Get an instant quote based on your scenario</p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">Step {step} of 6</span>
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
              {step === 4 && "Financial details"}
              {step === 5 && "Credit profile"}
              {step === 6 && "Review your scenario"}
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

            {/* Step 2: Property Type */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
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

            {/* Step 4: Employment & Income */}
            {step === 4 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Employment Status</Label>
                  <Select value={formData.employment} onValueChange={(v) => updateField("employment", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-Employed</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Annual Household Income: ${formData.annualIncome.toLocaleString()}</Label>
                  <Select value={formData.annualIncome.toString()} onValueChange={(v) => updateField("annualIncome", parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="75000">Less than $75,000</SelectItem>
                      <SelectItem value="100000">$75,000 - $100,000</SelectItem>
                      <SelectItem value="150000">$100,000 - $150,000</SelectItem>
                      <SelectItem value="200000">$150,000 - $200,000</SelectItem>
                      <SelectItem value="300000">$200,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </motion.div>
            )}

            {/* Step 5: Credit Score */}
            {step === 5 && (
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

            {/* Step 6: Review */}
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
                    <div>
                      <p className="text-sm text-muted-foreground">Credit Score</p>
                      <p className="font-semibold text-lg">{formData.creditScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Annual Income</p>
                      <p className="font-semibold text-lg">${formData.annualIncome.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center py-4">
                  Ready to get your personalized quote? Click submit and our team will contact you within 24 hours.
                </p>
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

          {step === 6 ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90 text-white font-semibold flex items-center gap-2"
            >
              Get My Quote
              <ArrowRight className="w-4 h-4" />
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

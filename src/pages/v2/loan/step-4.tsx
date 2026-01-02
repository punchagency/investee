import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { V2Layout } from "../V2Layout";
import { createApplication } from "@/services/ApplicationServices";

export default function V2LoanStep4() {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const [formData, setFormData] = useState({
    loanType: "",
    propertyType: "",
    address: "",
    purchasePrice: "",
    estimatedValue: "",
    downPayment: "",
    creditScore: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    preferredContact: "email",
    preferredCallTime: "morning",
  });

  // Load saved data from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("v2LoanApplication");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData((prev) => ({ ...prev, ...parsed }));
    } else {
      // Redirect to step 1 if no data
      setLocation("/v2/loan/step-1");
    }
  }, [setLocation]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const purchasePrice = parseInt(formData.purchasePrice) || 0;
      const downPayment = parseInt(formData.downPayment) || 0;
      const loanAmount = purchasePrice - downPayment;

      const applicationData = {
        loanType: formData.loanType,
        propertyType: formData.propertyType,
        address: formData.address,
        purchasePrice: purchasePrice,
        estimatedValue: parseInt(formData.estimatedValue) || 0,
        downPayment: downPayment,
        loanAmount: loanAmount,
        creditScore: formData.creditScore,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        preferredContact: formData.preferredContact,
        preferredCallTime: formData.preferredCallTime,
        agreeMarketing: agreeMarketing ? "yes" : "no",
        documents: [],
        attomData: null,
      };

      const response = await createApplication(applicationData);
      return response.data;
    },
    onSuccess: (data) => {
      // Clear session storage
      sessionStorage.removeItem("v2LoanApplication");
      // Redirect to success page or application detail
      setLocation(`/v2/application/${data.id}?success=true`);
    },
    onError: (error) => {
      console.error("Failed to submit application:", error);
      alert("Failed to submit application. Please try again.");
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    submitMutation.mutate();
  };

  const purchasePrice = parseInt(formData.purchasePrice) || 0;
  const downPayment = parseInt(formData.downPayment) || 0;
  const loanAmount = purchasePrice - downPayment;
  const ltv =
    purchasePrice > 0 ? ((loanAmount / purchasePrice) * 100).toFixed(1) : 0;

  return (
    <V2Layout variant="auth">
      <main className="flex-grow flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <div className="w-12 h-1 bg-[#0f49bd] rounded" />
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <div className="w-12 h-1 bg-[#0f49bd] rounded" />
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <div className="w-12 h-1 bg-[#0f49bd] rounded" />
            <div className="w-8 h-8 rounded-full bg-[#0f49bd] text-white flex items-center justify-center text-sm font-medium">
              4
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Review & Submit
            </h1>
            <p className="text-gray-600">
              Please review your application before submitting
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Details */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Property Details</h3>
                <Link
                  href="/v2/loan/step-1"
                  className="text-[#0f49bd] text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Type</span>
                  <span className="text-gray-900 font-medium">
                    {formData.loanType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Property Type</span>
                  <span className="text-gray-900 font-medium">
                    {formData.propertyType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address</span>
                  <span className="text-gray-900 font-medium text-right max-w-[200px]">
                    {formData.address}
                  </span>
                </div>
              </div>
            </div>

            {/* Loan Terms */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Loan Terms</h3>
                <Link
                  href="/v2/loan/step-2"
                  className="text-[#0f49bd] text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Price</span>
                  <span className="text-gray-900 font-medium">
                    ${purchasePrice.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Down Payment</span>
                  <span className="text-gray-900 font-medium">
                    ${downPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount</span>
                  <span className="text-[#0f49bd] font-bold">
                    ${loanAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">LTV</span>
                  <span className="text-gray-900 font-medium">{ltv}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Credit Score</span>
                  <span className="text-gray-900 font-medium">
                    {formData.creditScore}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
                <h3 className="font-bold text-gray-900">Contact Information</h3>
                <Link
                  href="/v2/loan/step-3"
                  className="text-[#0f49bd] text-sm font-medium"
                >
                  Edit
                </Link>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name</span>
                  <span className="text-gray-900 font-medium">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="text-gray-900 font-medium">
                    {formData.email}
                  </span>
                </div>
                {formData.phone && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone</span>
                    <span className="text-gray-900 font-medium">
                      {formData.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Marketing Consent */}
            <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={agreeMarketing}
                onChange={(e) => setAgreeMarketing(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#0f49bd] focus:ring-[#0f49bd]"
              />
              <span className="text-sm text-gray-600">
                I agree to receive marketing communications about investment
                opportunities, market updates, and new features. You can
                unsubscribe at any time.
              </span>
            </label>

            {/* Terms Notice */}
            <p className="text-sm text-gray-500 text-center">
              By submitting this application, you agree to our{" "}
              <a href="/terms" className="text-[#0f49bd] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-[#0f49bd] hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <div className="flex gap-4 pt-4">
              <Link
                href="/v2/loan/step-3"
                className="flex-1 flex items-center justify-center h-12 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Back
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 h-12 rounded-full bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">
                      progress_activity
                    </span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined">send</span>
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </V2Layout>
  );
}

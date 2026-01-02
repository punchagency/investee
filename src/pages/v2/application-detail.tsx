import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { V2Sidebar } from "./V2Layout";
import type { LoanApplication } from "@/lib/schema";
import { useEffect, useState } from "react";
import { getApplicationById } from "@/services/ApplicationServices";

export default function V2ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const [showSuccess, setShowSuccess] = useState(false);

  // Check for success query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      setShowSuccess(true);
      // Clear the success param from URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const {
    data: application,
    isLoading,
    error,
  } = useQuery<LoanApplication>({
    queryKey: ["application", id],
    queryFn: async () => {
      const response = await getApplicationById(id!);
      return response.data;
    },
    enabled: !!id,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "in_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return "check_circle";
      case "rejected":
        return "cancel";
      case "in_review":
        return "pending";
      default:
        return "schedule";
    }
  };

  if (isLoading) {
    return (
      <V2Sidebar>
        <div className="max-w-4xl mx-auto flex items-center justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
            progress_activity
          </span>
        </div>
      </V2Sidebar>
    );
  }

  if (error || !application) {
    return (
      <V2Sidebar>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-600 text-2xl">
              error
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Application Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The application you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            href="/v2/applications"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold"
          >
            Back to Applications
          </Link>
        </div>
      </V2Sidebar>
    );
  }

  const ltv =
    application.purchasePrice > 0
      ? ((application.loanAmount / application.purchasePrice) * 100).toFixed(1)
      : 0;

  return (
    <V2Sidebar>
      <div className="max-w-4xl mx-auto">
        {/* Success Banner */}
        {showSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
            <span className="material-symbols-outlined text-green-600">
              check_circle
            </span>
            <div>
              <p className="font-medium text-green-800">
                Application Submitted Successfully!
              </p>
              <p className="text-sm text-green-700">
                We've received your application and will contact you within
                24-48 hours.
              </p>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <Link
              href="/v2/applications"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm mb-2"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              Back to Applications
            </Link>
            <h1 className="text-gray-900 text-2xl font-black leading-tight">
              Application Details
            </h1>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
              application.status
            )} flex items-center gap-2`}
          >
            <span className="material-symbols-outlined text-base">
              {getStatusIcon(application.status)}
            </span>
            {application.status.replace("_", " ").charAt(0).toUpperCase() +
              application.status.slice(1).replace("_", " ")}
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Summary */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-[#0f49bd]/5 to-transparent border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Loan Summary</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Loan Type</p>
                    <p className="text-gray-900 font-medium">
                      {application.loanType}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Property Type</p>
                    <p className="text-gray-900 font-medium">
                      {application.propertyType}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Loan Amount</p>
                    <p className="text-2xl font-bold text-[#0f49bd]">
                      {formatCurrency(application.loanAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">LTV</p>
                    <p className="text-gray-900 font-medium">{ltv}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Property Details</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Address</p>
                  <p className="text-gray-900">
                    {application.address || "Not provided"}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Purchase Price</p>
                    <p className="text-gray-900 font-medium">
                      {formatCurrency(application.purchasePrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">
                      Estimated Value
                    </p>
                    <p className="text-gray-900 font-medium">
                      {formatCurrency(application.estimatedValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Down Payment</p>
                    <p className="text-gray-900 font-medium">
                      {formatCurrency(application.downPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Credit Score</p>
                    <p className="text-gray-900 font-medium">
                      {application.creditScore}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Contact Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Name</p>
                    <p className="text-gray-900">
                      {application.firstName} {application.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm mb-1">Email</p>
                    <p className="text-gray-900">{application.email}</p>
                  </div>
                  {application.phone && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">Phone</p>
                      <p className="text-gray-900">{application.phone}</p>
                    </div>
                  )}
                  {application.preferredContact && (
                    <div>
                      <p className="text-gray-600 text-sm mb-1">
                        Preferred Contact
                      </p>
                      <p className="text-gray-900 capitalize">
                        {application.preferredContact}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline & Actions */}
          <div className="space-y-6">
            {/* Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Timeline</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-green-600 text-base">
                        check
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">
                        Application Submitted
                      </p>
                      <p className="text-gray-500 text-xs">
                        {formatDate(application.submittedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        application.status !== "submitted"
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-base ${
                          application.status !== "submitted"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {application.status !== "submitted"
                          ? "check"
                          : "schedule"}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">
                        Under Review
                      </p>
                      <p className="text-gray-500 text-xs">
                        {application.status !== "submitted"
                          ? "Completed"
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        application.status === "approved"
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-base ${
                          application.status === "approved"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {application.status === "approved"
                          ? "check"
                          : "schedule"}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">
                        Final Decision
                      </p>
                      <p className="text-gray-500 text-xs">
                        {application.status === "approved" ||
                        application.status === "rejected"
                          ? "Completed"
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Actions</h2>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  href="/v2/ai-assistant"
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[#0f49bd]">
                    smart_toy
                  </span>
                  <span className="text-gray-900 text-sm font-medium">
                    Ask AI Assistant
                  </span>
                </Link>
                <button className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors w-full text-left">
                  <span className="material-symbols-outlined text-[#0f49bd]">
                    mail
                  </span>
                  <span className="text-gray-900 text-sm font-medium">
                    Contact Support
                  </span>
                </button>
                <button className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors w-full text-left">
                  <span className="material-symbols-outlined text-[#0f49bd]">
                    download
                  </span>
                  <span className="text-gray-900 text-sm font-medium">
                    Download Summary
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </V2Sidebar>
  );
}

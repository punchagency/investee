import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { V2Sidebar } from "./V2Layout";
import type { LoanApplication } from "@/lib/schema";
import { getAllApplications } from "@/services/ApplicationServices";

export default function V2Dashboard() {
  const { data: applications, isLoading } = useQuery<LoanApplication[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await getAllApplications();
      return response.data;
    },
  });

  // Calculate portfolio stats from applications
  const stats = {
    totalApplications: applications?.length || 0,
    totalLoanAmount:
      applications?.reduce((sum, app) => sum + (app.loanAmount || 0), 0) || 0,
    pendingApplications:
      applications?.filter(
        (app) => app.status === "submitted" || app.status === "pending"
      ).length || 0,
    approvedApplications:
      applications?.filter((app) => app.status === "approved").length || 0,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <V2Sidebar>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between gap-3 mb-6">
          <div>
            <h1 className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track your investments and applications
            </p>
          </div>
          <Link
            href="/v2/loan/step-1"
            className="flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Application
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
            <p className="text-gray-600 text-sm font-medium">
              Total Applications
            </p>
            <p className="text-gray-900 text-3xl font-bold">
              {isLoading ? "..." : stats.totalApplications}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
            <p className="text-gray-600 text-sm font-medium">
              Total Loan Value
            </p>
            <p className="text-gray-900 text-3xl font-bold">
              {isLoading ? "..." : formatCurrency(stats.totalLoanAmount)}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <p className="text-yellow-600 text-3xl font-bold">
              {isLoading ? "..." : stats.pendingApplications}
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl p-6 border border-gray-200 bg-white">
            <p className="text-gray-600 text-sm font-medium">Approved</p>
            <p className="text-green-600 text-3xl font-bold">
              {isLoading ? "..." : stats.approvedApplications}
            </p>
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-8">
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-900">
              Recent Applications
            </h2>
            <Link
              href="/v2/applications"
              className="text-[#0f49bd] text-sm font-medium hover:underline"
            >
              View All
            </Link>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-gray-500">
              Loading applications...
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {applications.slice(0, 5).map((app) => (
                <Link
                  key={app.id}
                  href={`/v2/application/${app.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-[#0f49bd]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#0f49bd]">
                      {app.loanType === "DSCR"
                        ? "account_balance"
                        : "construction"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium truncate">
                      {app.address || "No address provided"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {app.loanType} · {app.propertyType} ·{" "}
                      {formatCurrency(app.loanAmount)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : app.status === "in_review"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {app.status.replace("_", " ").charAt(0).toUpperCase() +
                        app.status.slice(1).replace("_", " ")}
                    </span>
                    <span className="material-symbols-outlined text-gray-400">
                      chevron_right
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-gray-400 text-2xl">
                  description
                </span>
              </div>
              <p className="text-gray-600 mb-4">No applications yet</p>
              <Link
                href="/v2/loan/step-1"
                className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
              >
                Start Your First Application
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/v2/property-search"
            className="flex flex-col gap-4 p-6 rounded-xl border border-gray-200 bg-white hover:border-[#0f49bd] hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#0f49bd]/10 flex items-center justify-center group-hover:bg-[#0f49bd]/20 transition-colors">
              <span className="material-symbols-outlined text-[#0f49bd]">
                search
              </span>
            </div>
            <div>
              <h3 className="text-gray-900 font-bold mb-1">
                Search Properties
              </h3>
              <p className="text-gray-600 text-sm">
                Find and analyze investment properties with real-time data
              </p>
            </div>
          </Link>

          <Link
            href="/v2/ai-assistant"
            className="flex flex-col gap-4 p-6 rounded-xl border border-gray-200 bg-white hover:border-[#0f49bd] hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#0f49bd]/10 flex items-center justify-center group-hover:bg-[#0f49bd]/20 transition-colors">
              <span className="material-symbols-outlined text-[#0f49bd]">
                smart_toy
              </span>
            </div>
            <div>
              <h3 className="text-gray-900 font-bold mb-1">AI Assistant</h3>
              <p className="text-gray-600 text-sm">
                Get instant answers about investing and loan options
              </p>
            </div>
          </Link>

          <Link
            href="/v2/loan/step-1"
            className="flex flex-col gap-4 p-6 rounded-xl border-2 border-dashed border-[#0f49bd]/50 bg-[#0f49bd]/5 hover:bg-[#0f49bd]/10 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-[#0f49bd]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0f49bd]">
                add
              </span>
            </div>
            <div>
              <h3 className="text-[#0f49bd] font-bold mb-1">
                New Loan Application
              </h3>
              <p className="text-gray-600 text-sm">
                Apply for DSCR or Fix & Flip financing
              </p>
            </div>
          </Link>
        </div>
      </div>
    </V2Sidebar>
  );
}

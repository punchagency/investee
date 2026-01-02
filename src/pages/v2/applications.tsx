import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { V2Sidebar } from "./V2Layout";
import type { LoanApplication } from "@/lib/schema";
import { getAllApplications } from "@/services/ApplicationServices";

export default function V2Applications() {
  const { data: applications, isLoading } = useQuery<LoanApplication[]>({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await getAllApplications();
      return response.data;
    },
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
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <V2Sidebar>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">
              My Applications
            </h1>
            <p className="text-gray-600 mt-1">
              Track and manage your loan applications
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

        {isLoading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
              progress_activity
            </span>
            <p className="text-gray-600 mt-4">Loading applications...</p>
          </div>
        ) : applications && applications.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan Type
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#0f49bd]/10 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#0f49bd]">
                              {app.loanType === "DSCR"
                                ? "account_balance"
                                : "construction"}
                            </span>
                          </div>
                          <div>
                            <p className="text-gray-900 font-medium truncate max-w-[200px]">
                              {app.address || "No address"}
                            </p>
                            <p className="text-sm text-gray-500">
                              {app.propertyType}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{app.loanType}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-medium">
                          {formatCurrency(app.loanAmount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status
                            .replace("_", " ")
                            .charAt(0)
                            .toUpperCase() +
                            app.status.slice(1).replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600">
                          {formatDate(app.submittedAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/v2/application/${app.id}`}
                          className="text-[#0f49bd] text-sm font-medium hover:underline flex items-center gap-1"
                        >
                          View Details
                          <span className="material-symbols-outlined text-base">
                            chevron_right
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-gray-400 text-2xl">
                description
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No Applications Yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start your first loan application to get financing for your
              investment property.
            </p>
            <Link
              href="/v2/loan/step-1"
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Start Application
            </Link>
          </div>
        )}

        {/* Stats Summary */}
        {applications && applications.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-gray-600 text-sm">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-gray-600 text-sm">Total Loan Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  applications.reduce(
                    (sum, app) => sum + (app.loanAmount || 0),
                    0
                  )
                )}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-gray-600 text-sm">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {applications.filter((app) => app.status === "approved").length}
              </p>
            </div>
          </div>
        )}
      </div>
    </V2Sidebar>
  );
}

import { Link } from "wouter";
import { ProposalSidebar } from "./ProposalLayout";

export default function ProposalAdminDashboard() {
  const stats = [
    { label: "Active Leads", value: "1,204", change: "+2.5%", positive: true },
    { label: "Deals Submitted", value: "89", change: "-1.2%", positive: false },
    { label: "Loan Value Funded", value: "$12.5M", change: "+8%", positive: true },
    { label: "Average Deal Size", value: "$250k", change: "+2.8%", positive: true },
  ];

  const recentDeals = [
    { name: "Commercial Plaza, TX", status: "Funded", value: "$1,200,000", date: "2023-10-23" },
    { name: "Metro Office Bldg", status: "Under Review", value: "$850,000", date: "2023-10-22" },
    { name: "Sunrise Apartments", status: "Submitted", value: "$2,500,000", date: "2023-10-21" },
    { name: "Downtown Retail FL", status: "Closed", value: "$475,000", date: "2023-10-18" },
  ];

  return (
    <ProposalSidebar>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Good morning, Admin</h1>
            <p className="text-gray-600">Here's a summary of business activity.</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
            <button className="h-10 px-4 rounded-lg bg-[#0f49bd] text-white text-sm font-medium">
              Generate Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200">
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className={`text-sm ${stat.positive ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Placeholder */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-4xl text-gray-400">map</span>
                <p className="text-gray-500 mt-2">Deal Locations Map</p>
              </div>
            </div>
          </div>

          {/* Funnel Conversion */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Funnel Conversion</h3>
            <div className="flex items-center justify-center h-48">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-[#0f49bd] flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">68%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Deals Table */}
        <div className="bg-white rounded-xl border border-gray-200 mt-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Recent Deals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal Name
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentDeals.map((deal) => (
                  <tr key={deal.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{deal.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          deal.status === "Funded"
                            ? "bg-green-100 text-green-800"
                            : deal.status === "Under Review"
                            ? "bg-yellow-100 text-yellow-800"
                            : deal.status === "Submitted"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{deal.value}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{deal.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProposalSidebar>
  );
}

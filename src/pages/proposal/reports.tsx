import { ProposalSidebar } from "./ProposalLayout";

export default function ProposalReports() {
  return (
    <ProposalSidebar>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Funnel Performance Reports</h1>
            <p className="text-gray-600">Track your lead conversion and deal pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="h-10 px-4 rounded-lg border border-gray-200 bg-white text-sm">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
            <button className="h-10 px-4 rounded-lg bg-[#0f49bd] text-white text-sm font-medium">
              Export Report
            </button>
          </div>
        </div>

        {/* Funnel Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Conversion Funnel</h2>
          <div className="flex items-end justify-center gap-4 h-64">
            {[
              { label: "Visitors", value: 10000, height: "100%" },
              { label: "Leads", value: 2500, height: "70%" },
              { label: "Qualified", value: 800, height: "45%" },
              { label: "Proposals", value: 300, height: "25%" },
              { label: "Funded", value: 89, height: "15%" },
            ].map((stage, index) => (
              <div key={stage.label} className="flex flex-col items-center gap-2 flex-1 max-w-32">
                <div className="text-sm font-medium text-gray-900">{stage.value.toLocaleString()}</div>
                <div
                  className="w-full bg-[#0f49bd] rounded-t-lg transition-all"
                  style={{ height: stage.height, opacity: 1 - index * 0.15 }}
                />
                <div className="text-xs text-gray-600">{stage.label}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">0.89%</p>
              <p className="text-sm text-gray-600">Overall Conversion</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">$12.5M</p>
              <p className="text-sm text-gray-600">Total Funded</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">$140k</p>
              <p className="text-sm text-gray-600">Avg Deal Size</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Source Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Lead Sources</h2>
            <div className="space-y-4">
              {[
                { source: "Website", leads: 1200, percent: 48 },
                { source: "AI Assistant", leads: 650, percent: 26 },
                { source: "Referrals", leads: 400, percent: 16 },
                { source: "Social Media", leads: 250, percent: 10 },
              ].map((item) => (
                <div key={item.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{item.source}</span>
                    <span className="text-gray-600">{item.leads} leads ({item.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className="h-2 bg-[#0f49bd] rounded-full"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Trend */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance</h2>
            <div className="h-48 flex items-end justify-between gap-2">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"].map((month, i) => {
                const heights = [40, 55, 45, 60, 70, 65, 80, 75, 85, 90];
                return (
                  <div key={month} className="flex flex-col items-center gap-2 flex-1">
                    <div
                      className="w-full bg-[#0f49bd]/80 rounded-t-sm"
                      style={{ height: `${heights[i]}%` }}
                    />
                    <span className="text-xs text-gray-500">{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top Performing Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { market: "Austin, TX", deals: 24, volume: "$3.2M" },
              { market: "Denver, CO", deals: 18, volume: "$2.8M" },
              { market: "Phoenix, AZ", deals: 15, volume: "$2.1M" },
            ].map((item) => (
              <div key={item.market} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{item.market}</p>
                <p className="text-sm text-gray-600">{item.deals} deals · {item.volume}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProposalSidebar>
  );
}

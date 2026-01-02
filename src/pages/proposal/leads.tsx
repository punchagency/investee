import { ProposalSidebar } from "./ProposalLayout";

export default function ProposalLeads() {
  const leads = [
    { name: "John Smith", email: "john@email.com", status: "New", source: "Website", date: "Oct 24" },
    { name: "Sarah Johnson", email: "sarah@email.com", status: "Contacted", source: "Referral", date: "Oct 23" },
    { name: "Mike Williams", email: "mike@email.com", status: "Qualified", source: "AI Chat", date: "Oct 22" },
    { name: "Emily Davis", email: "emily@email.com", status: "Proposal", source: "Website", date: "Oct 21" },
    { name: "David Brown", email: "david@email.com", status: "New", source: "AI Chat", date: "Oct 20" },
  ];

  return (
    <ProposalSidebar>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-gray-600">Track and manage your investment leads</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#0f49bd] text-white text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Add Lead
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6">
          <button className="px-4 py-2 rounded-full bg-[#0f49bd] text-white text-sm font-medium">All Leads</button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">New</button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Contacted</button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Qualified</button>
          <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200">Proposal</button>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.email} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#0f49bd]/10 flex items-center justify-center">
                        <span className="text-[#0f49bd] text-sm font-medium">
                          {lead.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <span className="text-gray-900 font-medium">{lead.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === "New"
                          ? "bg-blue-100 text-blue-800"
                          : lead.status === "Contacted"
                          ? "bg-yellow-100 text-yellow-800"
                          : lead.status === "Qualified"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{lead.source}</td>
                  <td className="px-6 py-4 text-gray-600">{lead.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <span className="material-symbols-outlined text-gray-500 text-lg">mail</span>
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <span className="material-symbols-outlined text-gray-500 text-lg">phone</span>
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <span className="material-symbols-outlined text-gray-500 text-lg">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProposalSidebar>
  );
}

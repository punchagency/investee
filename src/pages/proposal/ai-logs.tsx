import { ProposalSidebar } from "./ProposalLayout";

export default function ProposalAiLogs() {
  const conversations = [
    {
      id: 1,
      date: "Oct 24, 2023",
      preview: "Show me deals under $200k in Atlanta...",
      messages: 12,
      properties: 3,
    },
    {
      id: 2,
      date: "Oct 23, 2023",
      preview: "What's the average cap rate in Austin?",
      messages: 8,
      properties: 0,
    },
    {
      id: 3,
      date: "Oct 22, 2023",
      preview: "Find multifamily properties in Denver...",
      messages: 15,
      properties: 5,
    },
    {
      id: 4,
      date: "Oct 20, 2023",
      preview: "Compare DSCR vs Fix & Flip loans...",
      messages: 6,
      properties: 0,
    },
  ];

  return (
    <ProposalSidebar>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Interaction Logs</h1>
            <p className="text-gray-600">Review your past conversations with the AI assistant</p>
          </div>
          <button className="px-4 py-2 rounded-lg bg-[#0f49bd] text-white text-sm font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            New Conversation
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Total Conversations</p>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Properties Discovered</p>
            <p className="text-2xl font-bold text-gray-900">48</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-600 text-sm">Deals Saved</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </div>
        </div>

        {/* Conversation List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50"
            />
          </div>
          <div className="divide-y divide-gray-200">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full bg-[#0f49bd]/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#0f49bd]">chat</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">{convo.preview}</p>
                  <p className="text-sm text-gray-500">
                    {convo.messages} messages · {convo.properties} properties found
                  </p>
                </div>
                <div className="text-sm text-gray-500">{convo.date}</div>
                <span className="material-symbols-outlined text-gray-400">chevron_right</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ProposalSidebar>
  );
}

import { useState, useRef, useEffect } from "react";
import { V2Sidebar } from "./V2Layout";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function V2AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your Investee AI assistant. I can help you with:\n\n• Real estate investment strategies\n• Understanding loan options (DSCR, Fix & Flip)\n• Property analysis and valuation\n• Market trends and insights\n• Calculating ROI and cap rates\n\nWhat would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI response based on keywords
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("dscr") || lowerMessage.includes("debt service")) {
      return "**DSCR (Debt Service Coverage Ratio) Loans** are designed for real estate investors who want to qualify based on property income rather than personal income.\n\n**Key Features:**\n• Typically require DSCR of 1.0 or higher\n• No personal income verification needed\n• Based on property's rental income vs. debt payments\n• Great for investors with multiple properties\n\n**Formula:** DSCR = Net Operating Income / Total Debt Service\n\nWould you like to start a DSCR loan application?";
    }

    if (lowerMessage.includes("fix") && lowerMessage.includes("flip")) {
      return "**Fix & Flip Loans** are short-term financing options designed for investors who buy, renovate, and sell properties.\n\n**Key Features:**\n• Loan terms typically 6-18 months\n• Can finance both purchase and renovation costs\n• Based on After Repair Value (ARV)\n• Interest rates typically 8-15%\n\n**Best for:** Properties that need significant renovation before resale.\n\nWould you like help analyzing a potential fix and flip deal?";
    }

    if (lowerMessage.includes("cap rate") || lowerMessage.includes("capitalization")) {
      return "**Cap Rate (Capitalization Rate)** is a key metric for evaluating investment properties.\n\n**Formula:** Cap Rate = (Net Operating Income / Property Value) × 100\n\n**Example:**\n• Property Value: $500,000\n• Annual NOI: $40,000\n• Cap Rate: 8%\n\n**General Guidelines:**\n• 4-6%: Lower risk, prime locations\n• 6-8%: Moderate risk, suburban areas\n• 8-12%: Higher risk, potentially higher returns\n\nWould you like me to calculate the cap rate for a specific property?";
    }

    if (lowerMessage.includes("roi") || lowerMessage.includes("return")) {
      return "**ROI (Return on Investment)** measures the profitability of your real estate investment.\n\n**Cash-on-Cash ROI Formula:**\nAnnual Cash Flow / Total Cash Invested × 100\n\n**Example:**\n• Down Payment: $100,000\n• Annual Cash Flow: $12,000\n• Cash-on-Cash ROI: 12%\n\n**Factors to consider:**\n• Rental income\n• Operating expenses\n• Mortgage payments\n• Property appreciation\n• Tax benefits\n\nWould you like help calculating the ROI for a specific investment?";
    }

    if (lowerMessage.includes("market") || lowerMessage.includes("trends")) {
      return "**Current Real Estate Market Insights:**\n\n**Hot Markets (2024):**\n• Austin, TX - Strong job growth, tech hub\n• Phoenix, AZ - Affordable, growing population\n• Nashville, TN - Entertainment industry growth\n• Denver, CO - Outdoor lifestyle appeal\n\n**Key Trends:**\n• Interest rates stabilizing\n• Remote work driving suburban demand\n• Multifamily investments remain strong\n• PropTech improving due diligence\n\nWould you like information about a specific market?";
    }

    if (lowerMessage.includes("property") && (lowerMessage.includes("search") || lowerMessage.includes("find"))) {
      return "I can help you search for properties! Our platform integrates with ATTOM data to provide:\n\n• Property valuations\n• Sale history\n• Property characteristics (beds, baths, sq ft)\n• Assessed and market values\n\n**To search:** Go to the Property Search page and enter any address to get instant property data.\n\nWould you like me to explain what to look for when evaluating a property?";
    }

    if (lowerMessage.includes("apply") || lowerMessage.includes("loan") || lowerMessage.includes("application")) {
      return "Ready to apply for financing? Here's what you'll need:\n\n**For DSCR Loans:**\n• Property address\n• Purchase price and estimated value\n• Expected rental income\n• Credit score (660+ typically required)\n\n**For Fix & Flip Loans:**\n• Property address\n• Purchase price\n• Renovation budget\n• After Repair Value (ARV) estimate\n\nYou can start your application from the dashboard or by clicking 'Apply for Loan' in the navigation.\n\nWould you like me to guide you through the application process?";
    }

    // Default response
    return "Thanks for your question! As your Investee AI assistant, I specialize in real estate investment guidance.\n\nI can help you with:\n• **Loan Options** - DSCR and Fix & Flip loans\n• **Property Analysis** - Evaluating investment potential\n• **Financial Metrics** - Cap rates, ROI, cash flow\n• **Market Insights** - Current trends and opportunities\n\nCould you provide more details about what you're looking for? For example:\n- Are you interested in a specific property?\n- Looking to understand financing options?\n- Want to analyze an investment opportunity?";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const response = await generateResponse(userMessage.content);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const suggestedQuestions = [
    "What is a DSCR loan?",
    "How do I calculate cap rate?",
    "What are the hot real estate markets?",
    "How do Fix & Flip loans work?",
  ];

  return (
    <V2Sidebar>
      <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
        <div className="mb-4">
          <h1 className="text-gray-900 text-2xl font-black leading-tight tracking-[-0.033em]">
            AI Assistant
          </h1>
          <p className="text-gray-600 text-sm">Your personal real estate investment advisor</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200 p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-[#0f49bd] text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content.split("\n").map((line, i) => (
                    <span key={i}>
                      {line.startsWith("**") && line.endsWith("**") ? (
                        <strong>{line.slice(2, -2)}</strong>
                      ) : line.startsWith("• ") ? (
                        <span className="block ml-2">{line}</span>
                      ) : (
                        line
                      )}
                      {i < message.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
                <p className={`text-xs mt-2 ${message.role === "user" ? "text-white/70" : "text-gray-500"}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[#0f49bd]">progress_activity</span>
                  <span className="text-gray-600 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {suggestedQuestions.map((question) => (
              <button
                key={question}
                onClick={() => setInput(question)}
                className="px-3 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-[#0f49bd] hover:text-[#0f49bd] transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about real estate investing..."
              className="flex-1 h-12 px-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="h-12 px-6 rounded-xl bg-[#0f49bd] text-white font-medium hover:bg-[#0d3da0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">send</span>
            </button>
          </div>
        </form>
      </div>
    </V2Sidebar>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const mockResponses: { [key: string]: string } = {
  "dscr": "DSCR (Debt Service Coverage Ratio) loans are perfect for rental properties. We typically look for a minimum 1.1x DSCR. The loan amount depends on the property's rental income relative to the mortgage payment. Want to know your estimated DSCR? I can help analyze a property!",
  "fix and flip": "Fix & Flip financing is designed for investors looking to purchase, renovate, and resell properties. We typically offer 6-12 month terms with competitive rates. The loan is based on the after-repair value (ARV) of the property. What's your target property type?",
  "rate": "Our rates vary based on loan type and market conditions. DSCR loans typically range from 6.5-8.5%, while Fix & Flip loans range from 9.5-12%. Get an instant quote by analyzing a property in our system!",
  "preapproved": "Getting pre-approved is easy! We'll need basic info about your deal, credit score range, and property details. Pre-approval typically takes 24-48 hours. Ready to start? Just answer a few questions about your investment strategy!",
  "portfolio": "Managing a rental portfolio? We can help! Whether it's cash-out refinances, portfolio loans, or scaling your holdings nationwide, we've got solutions. How many properties are you currently managing?",
  "commercial": "We fund residential and commercial properties nationwide—apartments, hotels, retail, self-storage, and mixed-use properties. What type of commercial property are you interested in?",
  "hello": "Hey! Welcome to Legacy Biz Capital. I'm here to help you understand our financing options for DSCR rentals, Fix & Flip deals, and more. What type of investment are you working on?",
  "hi": "Hey there! 👋 Ready to fund your next deal? Ask me about DSCR loans, Fix & Flip financing, or get pre-approved today!",
  "how long": "Funding timelines depend on the loan type. For DSCR loans, we typically close in 15-21 days with full documentation. Fix & Flip deals can close as fast as 10-14 days. Speed is one of our core strengths!",
  "qualification": "We work with investors of all levels. Key factors: credit score (typically 620+), experience in real estate, and a solid deal. Ready for a quote? Tell me about your property!",
  "default": "Great question! I'm here to help with info about DSCR loans, Fix & Flip financing, rates, pre-approval, commercial properties, and more. What can I help you with today?",
};

function getBotResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  
  // Check for keyword matches
  for (const [key, response] of Object.entries(mockResponses)) {
    if (lower.includes(key)) {
      return response;
    }
  }
  
  // Check for common patterns
  if (lower.includes("thank") || lower.includes("thanks")) {
    return "You're welcome! Let me know if you have any other questions about financing your investments. 💪";
  }
  
  if (lower.includes("?") && lower.length < 20) {
    return "That's a great question! Our team can help with the details. In the meantime, you can get a personalized quote by exploring our property analysis tool. Want to get started?";
  }
  
  if (lower.includes("loan")) {
    return "We offer multiple loan products tailored to different investment strategies. Are you looking for a DSCR loan for rental income or a Fix & Flip loan for renovation projects?";
  }
  
  if (lower.includes("money") || lower.includes("fund") || lower.includes("cash")) {
    return "Ready to get funded? We can provide quotes and pre-approval quickly. Tell me more about the property or deal you're working on!";
  }
  
  return mockResponses.default;
}

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm your Legacy Biz Capital assistant. Ask me anything about DSCR loans, Fix & Flip financing, or getting pre-approved today!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[80vh] flex flex-col bg-white rounded-xl shadow-2xl border border-border overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Legacy Biz Capital</h3>
                <p className="text-xs text-primary/80">AI Assistant • Always here to help</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary/90 p-1 rounded transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-muted text-foreground rounded-bl-none"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-muted text-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="border-t border-border p-4 flex gap-2">
              <Input
                type="text"
                placeholder="Ask about DSCR, Fix & Flip, rates..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

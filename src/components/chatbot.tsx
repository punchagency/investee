import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send, Paperclip } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

import { getChatCompletion } from "@/services/AiServices";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! 👋 I'm Cindee, your Investee assistant. Ask me anything about DSCR loans, Fix & Flip financing, or comparing rates from multiple lenders!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

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

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      // Convert to API format
      const apiMessages = newMessages.map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));

      const response = await getChatCompletion(apiMessages);

      const botText =
        response.data.response ||
        response.data.content ||
        (typeof response.data === "string"
          ? response.data
          : "I'm having trouble understanding that.");

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Failed to get chat response:", error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to the server right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center border-2 border-white/30 overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Cindy&backgroundColor=b6e3f4"
                      alt="Cindy"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-green-700 rounded-full"></span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">
                    Cindee
                  </h3>
                  <p className="text-green-100 text-xs flex items-center gap-1">
                    <span className="animate-pulse">●</span> Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          p: ({ children }: any) => (
                            <p className="mb-2 last:mb-0">{children}</p>
                          ),
                          ul: ({ children }: any) => (
                            <ul className="list-disc ml-4 mb-2">{children}</ul>
                          ),
                          ol: ({ children }: any) => (
                            <ol className="list-decimal ml-4 mb-2">
                              {children}
                            </ol>
                          ),
                          li: ({ children }: any) => (
                            <li className="mb-1">{children}</li>
                          ),
                          strong: ({ children }: any) => (
                            <span className="font-semibold">{children}</span>
                          ),
                          a: ({ href, children }: any) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary underline hover:text-secondary/80 transition-colors font-medium"
                            >
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {msg.text
                          .replace(/\\\[/g, "$$")
                          .replace(/\\\]/g, "$$")
                          .replace(/\\\(/g, "$")
                          .replace(/\\\)/g, "$")}
                      </ReactMarkdown>
                    ) : (
                      msg.text
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center w-fit">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDuration: "1s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{
                        animationDuration: "1s",
                        animationDelay: "150ms",
                      }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{
                        animationDuration: "1s",
                        animationDelay: "300ms",
                      }}
                    ></span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100">
              <form
                onSubmit={handleSendMessage}
                className="flex items-end gap-2"
              >
                <div
                  className={`flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-2 border border-transparent transition-all ${
                    inputValue.trim()
                      ? "border-primary/50 bg-white ring-2 ring-primary/10"
                      : ""
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Ask Cindee..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    className="text-gray-400 hover:text-secondary transition-colors ml-2"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className={`p-3 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${
                    inputValue.trim() && !isLoading
                      ? "bg-secondary text-white hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <div className="text-center mt-2">
                <p className="text-[10px] text-gray-400">
                  Powered by AI Widget
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: isOpen ? 90 : 0 }}
        whileHover={{ scale: isOpen ? 1 : 1.1, rotate: isOpen ? 90 : 12 }}
        transition={{ duration: 0.3 }}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white z-50 ${
          isOpen ? "bg-gray-800" : "bg-primary"
        }`}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <X className="w-7 h-7" />
        ) : (
          <MessageCircle className="w-7 h-7 fill-current" />
        )}
      </motion.button>
    </div>
  );
}

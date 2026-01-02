import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

export default function ProposalAiAssistant() {
  const suggestions = [
    "Find duplexes in Austin, TX",
    "What's the cap rate for properties in Miami?",
    "Show me off-market opportunities",
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-3xl flex-1 w-full">
            <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
              <Link href="/proposal" className="flex items-center gap-3 text-[#1A2A4D]">
                <InvesteeLogo size={24} />
                <h2 className="text-lg font-bold tracking-[-0.015em]">Investee</h2>
              </Link>
              <Link
                href="/proposal/auth"
                className="px-4 py-2 rounded-full bg-[#0f49bd] text-white text-sm font-medium"
              >
                Sign In
              </Link>
            </header>

            <main className="flex-grow flex flex-col items-center px-4 py-12">
              {/* AI Avatar */}
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2O-J-ZnwSZxrFUDRtYdGLjKSR63tFRdFIsNrhSLioAeaChH5IYkTxXyUliwdCZrMOwN-OwDiKktmW6Ojdi71pALbL6azi1F0jhfjrVzCm9hdGk5D6CdWG6yAR-vgIz_py3u-0Kutvfe8dm7YY1mhXbr___7fdyYvdH-cJeNB_3MnjVweL5VLTZdVh8xleLqVmcGa1o6CvPVqeWHgtn1OwmXwHNfT4SMxD-KD-bHJesR093iiX-vtqWx40BZylWOGJCtkZdWohK54")`,
                  }}
                />
                <div
                  className="w-12 h-12 rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuBVHrVZ56MN_Rmc7k5B59P6Tbsmuan9Z_Pbv-NVu9yZN0PLizak2BQbFhHMxsXgSsp8WCxctsmCVDgJNs1t8k2rt3n3-ZmJ7llp6fCUPIN95k62uXVV9PsUwzc6969utzsbZWrtXqWcO2Ts9xOaq2MCgORL7pA9HXOi0-BCFq7PlUuBfmj195wbsh9Ka2YA83TYlLINhfFMXTCzGOkstPunVy1RDuJ7tlZMb9ScXHv2vY3iUYc-gJL7gfJB1LNBHJ118M_EnDJ6dNA")`,
                  }}
                />
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-2">
                Hi, I'm your real estate investment assistant.
              </h1>
              <p className="text-gray-600 text-center mb-8">
                How can I help you find your next deal? Here are a few things you can ask me:
              </p>

              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 text-sm hover:border-[#0f49bd] hover:text-[#0f49bd] transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Chat Messages */}
              <div className="w-full max-w-2xl space-y-4 mb-8">
                {/* User Message */}
                <div className="flex justify-end">
                  <div className="bg-[#0f49bd] text-white px-4 py-3 rounded-2xl rounded-br-none max-w-md">
                    Show me deals under $200k in Atlanta.
                  </div>
                </div>

                {/* AI Response */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#0f49bd]/20 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#0f49bd] text-sm">smart_toy</span>
                  </div>
                  <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none max-w-md">
                    <p className="text-gray-900">
                      Of course. I've found 3 properties in Atlanta under $200k with a projected cap rate above 8%.
                      They are located in the Summerhill and West End neighborhoods. Would you like to see the details?
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button className="px-3 py-1.5 rounded-full border border-[#0f49bd] text-[#0f49bd] text-sm">
                        Yes, show me details
                      </button>
                      <button className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 text-sm">
                        What are the risks?
                      </button>
                      <button className="px-3 py-1.5 rounded-full border border-gray-300 text-gray-700 text-sm">
                        See more options
                      </button>
                    </div>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 flex-shrink-0" />
                  <div className="bg-[#0f49bd]/5 border border-[#0f49bd]/20 px-4 py-4 rounded-xl max-w-md">
                    <p className="font-medium text-gray-900 mb-2">Ready to discuss these deals?</p>
                    <p className="text-sm text-gray-600 mb-3">
                      It looks like you've found some interesting options. Schedule a free consultation with one
                      of our experts to dive deeper.
                    </p>
                    <Link
                      href="/proposal/book-call"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0f49bd] text-white text-sm font-medium"
                    >
                      <span className="material-symbols-outlined text-lg">calendar_today</span>
                      Book a Consultation
                    </Link>
                  </div>
                </div>
              </div>

              {/* Input */}
              <div className="w-full max-w-2xl">
                <div className="flex items-center gap-2 p-2 bg-white rounded-full border border-gray-300 shadow-sm">
                  <input
                    type="text"
                    placeholder="Ask me anything..."
                    className="flex-1 px-4 py-2 bg-transparent focus:outline-none"
                  />
                  <button className="w-10 h-10 rounded-full bg-[#0f49bd] text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

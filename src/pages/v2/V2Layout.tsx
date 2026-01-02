import { Link, useLocation } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";
import { useState } from "react";

interface V2LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  variant?: "default" | "auth" | "minimal";
}

export function V2Layout({ children, showNav = true, variant = "default" }: V2LayoutProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (variant === "auth" || variant === "minimal") {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-5xl flex-1 w-full">
              <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
                <Link href="/v2" className="flex items-center gap-3 text-[#1A2A4D]">
                  <InvesteeLogo size={24} />
                  <h2 className="text-lg font-bold tracking-[-0.015em]">Investee</h2>
                </Link>
              </header>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: "/v2/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/v2/property-search", label: "Properties", icon: "search" },
    { href: "/v2/applications", label: "My Applications", icon: "description" },
    { href: "/v2/ai-assistant", label: "AI Assistant", icon: "smart_toy" },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1 w-full">
            <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
              <Link href="/v2" className="flex items-center gap-3 text-[#1A2A4D]">
                <InvesteeLogo size={24} />
                <h2 className="text-lg font-bold tracking-[-0.015em]">Investee</h2>
              </Link>

              {showNav && (
                <>
                  {/* Desktop Navigation */}
                  <nav className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                          location.startsWith(item.href)
                            ? "text-[#0f49bd]"
                            : "text-[#6B7A8F] hover:text-[#1A2A4D]"
                        }`}
                      >
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="flex items-center gap-4">
                    <Link
                      href="/v2/loan/step-1"
                      className="hidden md:flex items-center justify-center h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
                    >
                      Apply for Loan
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                      className="md:hidden p-2 text-gray-600"
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                      <span className="material-symbols-outlined">
                        {mobileMenuOpen ? "close" : "menu"}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </header>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-white border-b border-gray-200 py-4 px-4">
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors ${
                        location.startsWith(item.href)
                          ? "text-[#0f49bd] bg-[#0f49bd]/10"
                          : "text-[#6B7A8F] hover:bg-gray-100"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="material-symbols-outlined">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    href="/v2/loan/step-1"
                    className="flex items-center justify-center h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Apply for Loan
                  </Link>
                </nav>
              </div>
            )}

            <main className="flex-grow">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export function V2Sidebar({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const sidebarItems = [
    { href: "/v2/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/v2/properties", label: "Browse Properties", icon: "home" },
    { href: "/v2/property-search", label: "Search by Address", icon: "search" },
    { href: "/v2/my-properties", label: "My Properties", icon: "favorite" },
    { href: "/v2/vendors", label: "Vendor Services", icon: "engineering" },
    { href: "/v2/applications", label: "My Applications", icon: "description" },
    { href: "/v2/ai-assistant", label: "AI Assistant", icon: "smart_toy" },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <Link href="/v2" className="flex items-center gap-3 text-[#1A2A4D]">
            <InvesteeLogo size={24} />
            <h2 className="text-lg font-bold tracking-[-0.015em]">Investee</h2>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location === item.href || location.startsWith(item.href + "/")
                      ? "text-[#0f49bd] bg-[#0f49bd]/10"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <Link
            href="/v2/loan/step-1"
            className="flex items-center justify-center gap-2 h-12 w-full rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
          >
            <span className="material-symbols-outlined">add</span>
            Apply for Loan
          </Link>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <Link href="/v2" className="flex items-center gap-3 text-[#1A2A4D]">
          <InvesteeLogo size={24} />
          <h2 className="text-lg font-bold tracking-[-0.015em]">Investee</h2>
        </Link>
        <Link
          href="/v2/loan/step-1"
          className="flex items-center justify-center h-10 px-4 rounded-full bg-[#0f49bd] text-white text-sm font-bold"
        >
          Apply
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-6 lg:p-8 mt-16 lg:mt-0">
        {children}
      </main>
    </div>
  );
}

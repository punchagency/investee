import { Link, useLocation } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

interface ProposalLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  variant?: "default" | "auth" | "minimal";
}

const navLinks = [
  { href: "/proposal/dashboard", label: "Dashboard" },
  { href: "/proposal/property-map", label: "Properties" },
  { href: "/proposal/market-trends", label: "Market Trends" },
  { href: "/proposal/ai-assistant", label: "AI Assistant" },
];

export function ProposalLayout({
  children,
  showNav = true,
  variant = "default",
}: ProposalLayoutProps) {
  const [location] = useLocation();

  if (variant === "auth") {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
        {children}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col max-w-5xl flex-1 w-full">
              <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4">
                <Link
                  href="/proposal"
                  className="flex items-center gap-3 text-[#1A2A4D]"
                >
                  <InvesteeLogo size={24} />
                  <h2 className="text-lg font-bold tracking-[-0.015em]">
                    Investee
                  </h2>
                </Link>
                <Link
                  href="/proposal"
                  className="text-[#0f49bd] text-sm font-medium hover:underline"
                >
                  Back to Proposals
                </Link>
              </header>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-full max-w-5xl flex-1 px-4 md:px-10">
            {showNav && (
              <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 px-0 md:px-10 py-4">
                <Link
                  href="/proposal"
                  className="flex items-center gap-4 text-gray-900"
                >
                  <InvesteeLogo size={24} />
                  <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
                    Investee
                  </h2>
                </Link>
                <div className="hidden md:flex flex-1 justify-center gap-8">
                  <div className="flex items-center gap-9">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`text-sm font-medium leading-normal ${
                          location === link.href
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-900"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href="/proposal/loan/step-1"
                    className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 bg-[#0f49bd] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#0d3da0] transition-colors"
                  >
                    <span className="truncate">Start Loan Application</span>
                  </Link>
                  <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 bg-gray-200/50 text-gray-900 gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                    <span className="material-symbols-outlined text-gray-900">
                      notifications
                    </span>
                  </button>
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                    style={{
                      backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2O-J-ZnwSZxrFUDRtYdGLjKSR63tFRdFIsNrhSLioAeaChH5IYkTxXyUliwdCZrMOwN-OwDiKktmW6Ojdi71pALbL6azi1F0jhfjrVzCm9hdGk5D6CdWG6yAR-vgIz_py3u-0Kutvfe8dm7YY1mhXbr___7fdyYvdH-cJeNB_3MnjVweL5VLTZdVh8xleLqVmcGa1o6CvPVqeWHgtn1OwmXwHNfT4SMxD-KD-bHJesR093iiX-vtqWx40BZylWOGJCtkZdWohK54")`,
                    }}
                  />
                </div>
              </header>
            )}
            <main className="flex flex-col gap-8 md:gap-12 mt-8">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProposalSidebar({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const sidebarLinks = [
    { href: "/proposal/admin", label: "Dashboard", icon: "dashboard" },
    { href: "/proposal/leads", label: "Leads", icon: "people" },
    {
      href: "/proposal/property-manage",
      label: "Deals",
      icon: "real_estate_agent",
    },
    { href: "/proposal/reports", label: "Reports", icon: "analytics" },
  ];

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-row bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-4">
        <Link
          href="/proposal"
          className="flex items-center gap-3 text-[#0f49bd] px-4 py-4"
        >
          <InvesteeLogo size={24} />
          <div className="flex flex-col">
            <span className="text-sm font-bold">Investee</span>
            <span className="text-xs text-gray-500">Admin Panel</span>
          </div>
        </Link>

        <div className="flex flex-col gap-2 mt-6">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${
                location === link.href
                  ? "bg-[#0f49bd]/10 text-[#0f49bd]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className="material-symbols-outlined text-xl">
                {link.icon}
              </span>
              {link.label}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          <Link
            href="/proposal"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
            Settings
          </Link>
          <Link
            href="/proposal"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-xl">help</span>
            Help
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search deals, leads, reports..."
              className="w-64 h-10 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/20"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div
                className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8"
                style={{
                  backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA2O-J-ZnwSZxrFUDRtYdGLjKSR63tFRdFIsNrhSLioAeaChH5IYkTxXyUliwdCZrMOwN-OwDiKktmW6Ojdi71pALbL6azi1F0jhfjrVzCm9hdGk5D6CdWG6yAR-vgIz_py3u-0Kutvfe8dm7YY1mhXbr___7fdyYvdH-cJeNB_3MnjVweL5VLTZdVh8xleLqVmcGa1o6CvPVqeWHgtn1OwmXwHNfT4SMxD-KD-bHJesR093iiX-vtqWx40BZylWOGJCtkZdWohK54")`,
                }}
              />
              <span className="font-medium text-gray-900">Admin</span>
              <span className="text-gray-500">admin@investee.com</span>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

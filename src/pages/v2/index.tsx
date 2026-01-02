import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { InvesteeLogo } from "@/components/InvesteeLogo";
import type { Property } from "@/lib/schema";
import { calculateQuickDSCR } from "@/lib/dscr";
import { DSCRBadge } from "@/components/dscr-indicator";
import {
  getAllProperties,
  getStreetViewImageUrl,
} from "@/services/PropertyServices";

// Generate Street View URL for a property
const getStreetViewUrl = (address: string | null, city: string | null) => {
  if (!address || !city) return null;
  const fullAddress = `${address}, ${city}, CA`;
  return getStreetViewImageUrl(fullAddress);
};

export default function V2Landing() {
  const { data: properties } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await getAllProperties();
      return response.data;
    },
  });

  // Get featured properties (first 6, prioritizing foreclosures and high-value)
  const featuredProperties = properties
    ?.sort((a, b) => {
      // Prioritize foreclosures
      if (a.foreclosure && !b.foreclosure) return -1;
      if (!a.foreclosure && b.foreclosure) return 1;
      // Then by value
      const aValue = parseFloat(String(a.estValue) || "0");
      const bValue = parseFloat(String(b.estValue) || "0");
      return bValue - aValue;
    })
    .slice(0, 6);

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "N/A";
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(num);
  };

  const propertyTypeLabels: Record<string, string> = {
    SFR: "Single Family",
    MFR: "Multi-Family",
    CND: "Condo",
    APT: "Apartment",
    COM: "Commercial",
    IND: "Industrial",
    LND: "Land",
  };

  // Stats from properties
  const totalProperties = properties?.length || 0;
  const totalValue =
    properties?.reduce(
      (sum, p) => sum + parseFloat(String(p.estValue || "0")),
      0
    ) || 0;
  const foreclosureCount = properties?.filter((p) => p.foreclosure).length || 0;

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      {/* Clean Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/v2"
              className="flex items-center gap-2 text-white group"
            >
              <InvesteeLogo size={28} />
              <h1 className="text-lg font-bold tracking-tight">Investee</h1>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { href: "/v2/properties", label: "Properties", icon: "home" },
                {
                  href: "/v2/dscr-calculator",
                  label: "DSCR Calculator",
                  icon: "calculate",
                },
                { href: "/v2/vendors", label: "Vendors", icon: "handyman" },
                {
                  href: "/v2/loan/step-1",
                  label: "Financing",
                  icon: "payments",
                },
                {
                  href: "/v2/ai-assistant",
                  label: "AI Assistant",
                  icon: "smart_toy",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-white/70 text-sm font-medium hover:text-white hover:bg-white/10 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <Link
                href="/v2/loan/step-1"
                className="hidden md:flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white text-sm font-bold hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-base">
                  bolt
                </span>
                Get Started
              </Link>
              <Link
                href="/v2/dashboard"
                className="flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-all"
              >
                <span className="material-symbols-outlined text-base">
                  dashboard
                </span>
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Premium Design */}
      <section className="relative min-h-[45vh] flex items-center pt-24 pb-16 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628] via-[#0f49bd] to-[#1A2A4D]">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6B00]/30 rounded-full blur-[128px] animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#0f49bd]/50 rounded-full blur-[128px] animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/3 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>

          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

          {/* Radial Gradient Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,22,40,0.5)_100%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-white mb-8">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-[10px] font-bold ring-2 ring-white/20">
                    JD
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold ring-2 ring-white/20">
                    MK
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-[10px] font-bold ring-2 ring-white/20">
                    AS
                  </div>
                </div>
                <span className="text-white/80">
                  Trusted by{" "}
                  <span className="text-white font-bold">2,500+</span> investors
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tight text-white mb-6">
                Find Your Next
                <br />
                <span className="relative">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] via-[#FFB347] to-[#FF6B00] bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                    Investment Property
                  </span>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Access{" "}
                <span className="text-white font-semibold">
                  {totalProperties}+
                </span>{" "}
                curated properties with AI-powered analysis. Get financing
                approved in{" "}
                <span className="text-white font-semibold">24 hours</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
                <Link
                  href="/v2/properties"
                  className="group w-full sm:w-auto flex items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-white text-[#0f49bd] text-base font-bold hover:shadow-2xl hover:shadow-white/25 transition-all hover:-translate-y-1"
                >
                  <span className="material-symbols-outlined text-xl">
                    search
                  </span>
                  Browse {totalProperties} Properties
                  <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
                <Link
                  href="/v2/loan/step-1"
                  className="group w-full sm:w-auto flex items-center justify-center gap-3 h-14 px-8 rounded-2xl bg-gradient-to-r from-[#FF6B00] to-[#FF8533] text-white text-base font-bold hover:shadow-2xl hover:shadow-orange-500/30 transition-all hover:-translate-y-1"
                >
                  <span className="material-symbols-outlined text-xl">
                    rocket_launch
                  </span>
                  Get Pre-Approved
                </Link>
              </div>

              {/* Quick Stats Row */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-400">
                    verified
                  </span>
                  <span className="text-white/70">
                    <span className="text-white font-bold">
                      ${(totalValue / 1000000).toFixed(0)}M+
                    </span>{" "}
                    Portfolio Value
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-orange-400">
                    local_fire_department
                  </span>
                  <span className="text-white/70">
                    <span className="text-white font-bold">
                      {foreclosureCount}
                    </span>{" "}
                    Hot Foreclosures
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">
                    speed
                  </span>
                  <span className="text-white/70">
                    <span className="text-white font-bold">24hr</span> Approval
                  </span>
                </div>
              </div>
            </div>

            {/* Right Side - Property Preview Cards */}
            <div className="relative hidden lg:block">
              {/* Main Featured Property Card */}
              <div className="relative z-20 bg-white rounded-3xl shadow-2xl shadow-black/20 overflow-hidden transform hover:scale-[1.02] transition-transform">
                <div className="h-52 bg-gradient-to-br from-[#0f49bd]/20 to-[#0f49bd]/5 relative">
                  <img
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"
                    alt="Luxury home"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      Foreclosure
                    </span>
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full">
                      Featured
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <div className="flex items-center gap-1 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
                      <span className="material-symbols-outlined text-sm">
                        360
                      </span>
                      Street View
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#1A2A4D]">
                        Modern Beverly Hills Estate
                      </h3>
                      <p className="text-[#6B7A8F] text-sm">Los Angeles, CA</p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">
                      <span className="material-symbols-outlined text-sm">
                        trending_up
                      </span>
                      +12%
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#6B7A8F] mb-4">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        bed
                      </span>{" "}
                      5
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        bathtub
                      </span>{" "}
                      4
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">
                        square_foot
                      </span>{" "}
                      4,200
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-[#6B7A8F]">Est. Value</p>
                      <p className="text-2xl font-black text-[#0f49bd]">
                        $2.8M
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[#6B7A8F]">Est. Equity</p>
                      <p className="text-lg font-bold text-green-600">$890K</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card - Top Right */}
              <div className="absolute -top-4 -right-4 z-30 bg-white rounded-2xl shadow-xl p-4 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-2xl">
                      trending_up
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7A8F]">Avg. ROI</p>
                    <p className="text-xl font-black text-[#1A2A4D]">24%</p>
                  </div>
                </div>
              </div>

              {/* Floating Card - Bottom Left */}
              <div className="absolute -bottom-6 -left-6 z-30 bg-white rounded-2xl shadow-xl p-4 transform -rotate-3 hover:rotate-0 transition-transform">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FFB347] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-2xl">
                      bolt
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-[#6B7A8F]">Active Deals</p>
                    <p className="text-xl font-black text-[#1A2A4D]">
                      {totalProperties}
                    </p>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f49bd]/20 to-[#FF6B00]/20 rounded-3xl blur-3xl -z-10 transform scale-110"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholder Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A2A4D] mb-4">
              Built for Every Stakeholder
            </h2>
            <p className="text-lg text-[#6B7A8F] max-w-2xl mx-auto">
              Whether you're an investor, lender, or property owner, Investee
              provides the tools and connections you need to succeed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "trending_up",
                title: "Investors",
                description:
                  "Access curated investment properties with real-time valuations and equity analysis.",
                link: "/v2/properties",
                cta: "Find Deals",
              },
              {
                icon: "account_balance",
                title: "Lenders",
                description:
                  "Review qualified borrowers and fund DSCR or Fix & Flip loans with confidence.",
                link: "/v2/applications",
                cta: "View Applications",
              },
              {
                icon: "home",
                title: "Property Owners",
                description:
                  "List your property, unlock equity, and connect with serious buyers.",
                link: "/v2/property-search",
                cta: "List Property",
              },
              {
                icon: "engineering",
                title: "Vendors",
                description:
                  "Connect with contractors, inspectors, attorneys, and trusted service providers.",
                link: "/v2/vendors",
                cta: "Find Vendors",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.link}
                className="group flex flex-col p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-[#0f49bd] hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-[#0f49bd]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#0f49bd] text-2xl">
                    {card.icon}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1A2A4D] mb-2">
                  {card.title}
                </h3>
                <p className="text-[#6B7A8F] text-sm mb-4 flex-grow">
                  {card.description}
                </p>
                <span className="text-[#0f49bd] font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                  {card.cta}
                  <span className="material-symbols-outlined text-base">
                    arrow_forward
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20 bg-[#f6f6f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#1A2A4D] mb-2">
                Featured Properties
              </h2>
              <p className="text-[#6B7A8F]">
                High-potential investment opportunities from our database
              </p>
            </div>
            <Link
              href="/v2/properties"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#0f49bd] text-[#0f49bd] font-medium hover:bg-[#0f49bd] hover:text-white transition-colors"
            >
              View All {totalProperties} Properties
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties?.map((property) => (
              <Link
                key={property.id}
                href={`/v2/property/${property.id}`}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-[#0f49bd]/20 to-[#0f49bd]/5 relative overflow-hidden">
                  {getStreetViewUrl(property.address, property.city) ? (
                    <img
                      src={getStreetViewUrl(property.address, property.city)!}
                      alt={`Street view of ${property.address}`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback =
                          e.currentTarget.parentElement?.querySelector(
                            ".fallback-icon"
                          );
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`fallback-icon absolute inset-0 flex items-center justify-center ${
                      getStreetViewUrl(property.address, property.city)
                        ? "hidden"
                        : ""
                    }`}
                  >
                    <span className="material-symbols-outlined text-[#0f49bd]/30 text-6xl">
                      home
                    </span>
                  </div>
                  {property.foreclosure && (
                    <span className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded z-10">
                      Foreclosure
                    </span>
                  )}
                  <span className="absolute top-3 left-3 px-2 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded z-10">
                    {propertyTypeLabels[property.propertyType || ""] ||
                      property.propertyType}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-[#1A2A4D] truncate group-hover:text-[#0f49bd] transition-colors flex-1">
                      {property.address}
                    </h3>
                    {/* DSCR Badge */}
                    {property.estValue &&
                      (() => {
                        const propertyValue = property.estValue;
                        // Use actual estRent if available, otherwise estimate based on property characteristics
                        const estRent = property.rentcastRentEstimate
                          ? property.rentcastRentEstimate
                          : undefined;
                        const dscrResult = calculateQuickDSCR(propertyValue, {
                          estimatedRent: estRent,
                          beds: property.beds ? property.beds : undefined,
                          sqft: property.sqFt ? property.sqFt : undefined,
                          propertyType: property.propertyType || undefined,
                        });
                        return (
                          <DSCRBadge
                            dscr={dscrResult.dscr}
                            statusColor={dscrResult.statusColor}
                          />
                        );
                      })()}
                  </div>
                  <p className="text-sm text-[#6B7A8F] mb-3">{property.city}</p>
                  <div className="flex items-center gap-4 text-sm text-[#6B7A8F] mb-4">
                    {property.beds && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          bed
                        </span>
                        {property.beds}
                      </span>
                    )}
                    {property.baths && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          bathtub
                        </span>
                        {property.baths}
                      </span>
                    )}
                    {property.sqFt && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          square_foot
                        </span>
                        {property.sqFt.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-[#6B7A8F]">Est. Value</p>
                      <p className="text-xl font-bold text-[#0f49bd]">
                        {formatCurrency(property.estValue)}
                      </p>
                    </div>
                    {property.estEquity &&
                      parseFloat(String(property.estEquity)) > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-[#6B7A8F]">Est. Equity</p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(property.estEquity)}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A2A4D] mb-4">
              How Investee Works
            </h2>
            <p className="text-lg text-[#6B7A8F] max-w-2xl mx-auto">
              From discovery to financing, we streamline every step of your
              investment journey.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-[#0f49bd]/20"></div>

            {[
              {
                num: 1,
                title: "Discover",
                desc: "Browse our curated database of investment properties with real-time valuations.",
                icon: "search",
              },
              {
                num: 2,
                title: "Analyze",
                desc: "Use AI-powered tools to evaluate deals, calculate ROI, and assess risk.",
                icon: "analytics",
              },
              {
                num: 3,
                title: "Apply",
                desc: "Submit a loan application in minutes with our streamlined multi-step process.",
                icon: "description",
              },
              {
                num: 4,
                title: "Fund & Invest",
                desc: "Get approved, close the deal, and start building your real estate portfolio.",
                icon: "account_balance",
              },
            ].map((step) => (
              <div key={step.num} className="text-center relative">
                <div className="w-24 h-24 mx-auto rounded-full bg-[#0f49bd] text-white flex items-center justify-center mb-6 relative z-10 shadow-lg">
                  <span className="material-symbols-outlined text-4xl">
                    {step.icon}
                  </span>
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-8 h-8 rounded-full bg-[#FF6B00] text-white flex items-center justify-center text-sm font-bold z-20">
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-[#1A2A4D] mb-2">
                  {step.title}
                </h3>
                <p className="text-[#6B7A8F] text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#f6f6f8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A2A4D] mb-4">
              Powerful Tools for Investors
            </h2>
            <p className="text-lg text-[#6B7A8F] max-w-2xl mx-auto">
              Everything you need to make informed investment decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="w-14 h-14 rounded-xl bg-[#0f49bd]/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#0f49bd] text-2xl">
                  database
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A2A4D] mb-3">
                ATTOM Property Data
              </h3>
              <p className="text-[#6B7A8F]">
                Access comprehensive property data including valuations, sale
                history, and market trends powered by ATTOM's industry-leading
                database.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="w-14 h-14 rounded-xl bg-[#0f49bd]/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#0f49bd] text-2xl">
                  smart_toy
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A2A4D] mb-3">
                AI Investment Assistant
              </h3>
              <p className="text-[#6B7A8F]">
                Get instant answers about cap rates, ROI calculations, market
                trends, and loan options from our intelligent AI assistant.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="w-14 h-14 rounded-xl bg-[#0f49bd]/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#0f49bd] text-2xl">
                  speed
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#1A2A4D] mb-3">
                Fast Loan Processing
              </h3>
              <p className="text-[#6B7A8F]">
                Apply for DSCR or Fix & Flip loans with our streamlined 4-step
                application. Get pre-approval in as little as 24 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#0f49bd] to-[#1A2A4D] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Start Investing?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of investors who trust Investee to find, analyze, and
            finance their next deal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/v2/properties"
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-white text-[#0f49bd] text-base font-bold hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined">home</span>
              Explore Properties
            </Link>
            <Link
              href="/v2/ai-assistant"
              className="w-full sm:w-auto flex items-center justify-center gap-2 h-14 px-8 rounded-full border-2 border-white text-white text-base font-bold hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined">smart_toy</span>
              Talk to AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2A4D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <InvesteeLogo size={24} />
                <span className="text-lg font-bold">Investee</span>
              </div>
              <p className="text-blue-200 text-sm">
                The all-in-one platform for real estate investors, lenders, and
                property owners.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>
                  <Link
                    href="/v2/properties"
                    className="hover:text-white transition-colors"
                  >
                    Browse Properties
                  </Link>
                </li>
                <li>
                  <Link
                    href="/v2/property-search"
                    className="hover:text-white transition-colors"
                  >
                    Search by Address
                  </Link>
                </li>
                <li>
                  <Link
                    href="/v2/dscr-calculator"
                    className="hover:text-white transition-colors"
                  >
                    DSCR Calculator
                  </Link>
                </li>
                <li>
                  <Link
                    href="/v2/vendors"
                    className="hover:text-white transition-colors"
                  >
                    Vendor Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/v2/loan/step-1"
                    className="hover:text-white transition-colors"
                  >
                    Apply for Loan
                  </Link>
                </li>
                <li>
                  <Link
                    href="/v2/ai-assistant"
                    className="hover:text-white transition-colors"
                  >
                    AI Assistant
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <Link
                    href="/v2/dashboard"
                    className="hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="/v2/applications"
                    className="hover:text-white transition-colors"
                  >
                    My Applications
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-blue-800 text-center text-blue-300 text-sm">
            © 2024 Investee. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

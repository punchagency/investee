import { Link } from "wouter";
import { InvesteeLogo } from "@/components/InvesteeLogo";

// Import all screen previews
import welcomeScreen from "@/assets/proposal-screens/welcome_to_legacy_biz_capital.png";
import dashboardScreen from "@/assets/proposal-screens/dashboard_home.png";
import adminScreen from "@/assets/proposal-screens/admin_dashboard.png";
import funnelScreen from "@/assets/proposal-screens/funnel_landing_page.png";
import authScreen from "@/assets/proposal-screens/create_account_-_log_in.png";
import profileSelectScreen from "@/assets/proposal-screens/select_investor_profile_type.png";
import onboardingScreen from "@/assets/proposal-screens/lead_onboarding_flow.png";
import propertyDetailScreen from "@/assets/proposal-screens/property_detail_page.png";
import propertyMapScreen from "@/assets/proposal-screens/property_discovery_map_view.png";
import propertyManageScreen from "@/assets/proposal-screens/property_listings_management.png";
import marketTrendsScreen from "@/assets/proposal-screens/market_trends_explorer.png";
import loanStep1Screen from "@/assets/proposal-screens/loan_origination-_property_details.png";
import loanStep2Screen from "@/assets/proposal-screens/loan_origination-_loan_term_&_rate.png";
import loanStep3Screen from "@/assets/proposal-screens/loan_origination-_identity_&_financials.png";
import loanStep4Screen from "@/assets/proposal-screens/loan_origination-_upload_documents.png";
import loanStep5Screen from "@/assets/proposal-screens/loan_origination-_summary_&_submit.png";
import loanReviewScreen from "@/assets/proposal-screens/loan_application_review.png";
import bookCallScreen from "@/assets/proposal-screens/book_a_call_flow.png";
import creditScreen from "@/assets/proposal-screens/credit_impact_summary.png";
import aiAssistantScreen from "@/assets/proposal-screens/ai_assistant_interface.png";
import aiLogsScreen from "@/assets/proposal-screens/ai_interaction_logs.png";
import leadsScreen from "@/assets/proposal-screens/lead_management_view.png";
import reportsScreen from "@/assets/proposal-screens/funnel_performance_reports.png";
import verifyScreen from "@/assets/proposal-screens/verify_identity_-_region_selector.png";
import myProfileScreen from "@/assets/proposal-screens/my_profile.png";

const screens = [
  {
    category: "Landing & Onboarding",
    items: [
      { href: "/proposal/welcome", label: "Welcome Page", image: welcomeScreen },
      { href: "/proposal/funnel", label: "Funnel Landing", image: funnelScreen },
      { href: "/proposal/auth", label: "Login / Sign Up", image: authScreen },
      { href: "/proposal/profile-select", label: "Investor Profile Selection", image: profileSelectScreen },
      { href: "/proposal/onboarding", label: "Lead Onboarding Flow", image: onboardingScreen },
    ],
  },
  {
    category: "Dashboard & Profile",
    items: [
      { href: "/proposal/dashboard", label: "User Dashboard", image: dashboardScreen },
      { href: "/proposal/admin", label: "Admin Dashboard", image: adminScreen },
      { href: "/proposal/my-profile", label: "My Profile", image: myProfileScreen },
    ],
  },
  {
    category: "Property",
    items: [
      { href: "/proposal/property/123", label: "Property Detail", image: propertyDetailScreen },
      { href: "/proposal/property-map", label: "Property Discovery Map", image: propertyMapScreen },
      { href: "/proposal/property-manage", label: "Property Management", image: propertyManageScreen },
      { href: "/proposal/market-trends", label: "Market Trends Explorer", image: marketTrendsScreen },
    ],
  },
  {
    category: "Loan Origination Flow",
    items: [
      { href: "/proposal/loan/step-1", label: "Step 1: Property Details", image: loanStep1Screen },
      { href: "/proposal/loan/step-2", label: "Step 2: Loan Terms", image: loanStep2Screen },
      { href: "/proposal/loan/step-3", label: "Step 3: Borrower Info", image: loanStep3Screen },
      { href: "/proposal/loan/step-4", label: "Step 4: Documents", image: loanStep4Screen },
      { href: "/proposal/loan/step-5", label: "Step 5: Review & Submit", image: loanStep5Screen },
      { href: "/proposal/loan-status", label: "Application Review", image: loanReviewScreen },
    ],
  },
  {
    category: "Other Features",
    items: [
      { href: "/proposal/book-call", label: "Book a Call", image: bookCallScreen },
      { href: "/proposal/credit", label: "Credit Impact Summary", image: creditScreen },
      { href: "/proposal/ai-assistant", label: "AI Assistant", image: aiAssistantScreen },
      { href: "/proposal/ai-logs", label: "AI Interaction Logs", image: aiLogsScreen },
      { href: "/proposal/leads", label: "Lead Management", image: leadsScreen },
      { href: "/proposal/reports", label: "Funnel Reports", image: reportsScreen },
      { href: "/proposal/verify", label: "Identity Verification", image: verifyScreen },
    ],
  },
];

export default function ProposalIndex() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f6f6f8] font-['Inter',sans-serif] overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-4 md:px-10 lg:px-20 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-6xl flex-1 w-full">
            {/* Header */}
            <header className="flex items-center justify-between whitespace-nowrap px-4 sm:px-10 py-4 border-b border-gray-200">
              <Link href="/" className="flex items-center gap-3 text-[#1A2A4D]">
                <InvesteeLogo size={28} />
                <h2 className="text-xl font-bold tracking-[-0.015em]">Investee</h2>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-2 text-[#0f49bd] text-sm font-medium hover:underline"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
                Back to Main Site
              </Link>
            </header>

            {/* Hero */}
            <div className="flex flex-col items-center text-center px-4 py-12 sm:py-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f49bd]/10 text-[#0f49bd] rounded-full text-sm font-medium mb-6">
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                Proposal Designs
              </div>
              <h1 className="text-[#1A2A4D] text-4xl md:text-5xl font-black leading-tight tracking-tighter max-w-3xl">
                Investee Platform Proposal
              </h1>
              <p className="text-[#6B7A8F] text-base md:text-lg font-normal leading-relaxed max-w-2xl mt-4">
                Explore our AI-generated design concepts for the Investee real estate investment platform.
                Click on any screen to view the full interactive design.
              </p>
              <div className="flex items-center gap-4 mt-8">
                <Link
                  href="/proposal/welcome"
                  className="flex items-center gap-2 px-6 py-3 bg-[#0f49bd] text-white rounded-full text-sm font-bold hover:bg-[#0d3da0] transition-colors"
                >
                  <span>Start Tour</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
                <Link
                  href="/proposal/dashboard"
                  className="flex items-center gap-2 px-6 py-3 bg-white text-[#1A2A4D] rounded-full text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <span>View Dashboard</span>
                </Link>
              </div>
            </div>

            {/* Screen Categories */}
            {screens.map((category) => (
              <div key={category.category} className="mb-12">
                <h2 className="text-[#1A2A4D] text-xl font-bold px-4 mb-6">{category.category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
                  {category.items.map((screen) => (
                    <Link
                      key={screen.href}
                      href={screen.href}
                      className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#0f49bd]/30 transition-all"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                        <img
                          src={screen.image}
                          alt={screen.label}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center justify-between p-4">
                        <span className="text-[#1A2A4D] text-sm font-medium">{screen.label}</span>
                        <span className="material-symbols-outlined text-[#0f49bd] text-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          arrow_forward
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Footer */}
            <footer className="flex items-center justify-between px-4 py-8 border-t border-gray-200 mt-8">
              <div className="flex items-center gap-2 text-[#6B7A8F] text-sm">
                <InvesteeLogo size={20} />
                <span>Investee Proposal Designs</span>
              </div>
              <Link
                href="/"
                className="text-[#0f49bd] text-sm font-medium hover:underline"
              >
                Return to Main Site
              </Link>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

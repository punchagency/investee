import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Layout } from "@/components/layout";
import Landing from "@/pages/landing";
import SearchPage from "@/pages/search";
import PropertySearchPage from "@/pages/property-search";
import AnalysisPage from "@/pages/analysis";
import DashboardPage from "@/pages/dashboard";
import CalculatorPage from "@/pages/calculator";
import LearningPage from "@/pages/learning";
import LegalPage from "@/pages/legal";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin-dashboard";
import LoanDetailPage from "@/pages/loan-detail";
import PropertyProfilePage from "@/pages/property-profile";
import PropertyComparePage from "@/pages/property-compare";
import MarketplacePage from "@/pages/marketplace";
import AlertsPage from "@/pages/alerts";
import LogoPreview from "@/pages/logo-preview";
import PropertyDetails from "@/pages/property-details";

// Proposal pages
import ProposalIndex from "@/pages/proposal/index";
import ProposalWelcome from "@/pages/proposal/welcome";
import ProposalFunnel from "@/pages/proposal/funnel-landing";
import ProposalAuth from "@/pages/proposal/auth";
import ProposalProfileSelect from "@/pages/proposal/investor-profile";
import ProposalOnboarding from "@/pages/proposal/onboarding";
import ProposalDashboard from "@/pages/proposal/dashboard";
import ProposalAdmin from "@/pages/proposal/admin-dashboard";
import ProposalMyProfile from "@/pages/proposal/profile";
import ProposalPropertyDetail from "@/pages/proposal/property-detail";
import ProposalPropertyMap from "@/pages/proposal/property-map";
import ProposalPropertyManage from "@/pages/proposal/property-management";
import ProposalMarketTrends from "@/pages/proposal/market-trends";
import ProposalLoanStep1 from "@/pages/proposal/loan/property-details";
import ProposalLoanStep2 from "@/pages/proposal/loan/loan-terms";
import ProposalLoanStep3 from "@/pages/proposal/loan/borrower-info";
import ProposalLoanStep4 from "@/pages/proposal/loan/documents";
import ProposalLoanStep5 from "@/pages/proposal/loan/review";
import ProposalLoanStatus from "@/pages/proposal/loan-review";
import ProposalBookCall from "@/pages/proposal/book-call";
import ProposalCredit from "@/pages/proposal/credit-summary";
import ProposalAiAssistant from "@/pages/proposal/ai-assistant";
import ProposalAiLogs from "@/pages/proposal/ai-logs";
import ProposalLeads from "@/pages/proposal/leads";
import ProposalReports from "@/pages/proposal/reports";
import ProposalVerify from "@/pages/proposal/verify-identity";

// V2 pages - Functional version using the Stitch template
import V2Landing from "@/pages/v2/index";
import V2Dashboard from "@/pages/v2/dashboard";
import V2PropertySearch from "@/pages/v2/property-search";
import V2Applications from "@/pages/v2/applications";
import V2ApplicationDetail from "@/pages/v2/application-detail";
import V2AiAssistant from "@/pages/v2/ai-assistant";
import V2LoanStep1 from "@/pages/v2/loan/step-1";
import V2LoanStep2 from "@/pages/v2/loan/step-2";
import V2LoanStep3 from "@/pages/v2/loan/step-3";
import V2LoanStep4 from "@/pages/v2/loan/step-4";
import V2Properties from "@/pages/v2/properties";
import V2PropertyDetail from "@/pages/v2/property-detail";
import V2MyProperties from "@/pages/v2/my-properties";
import V2Vendors from "@/pages/v2/vendors";
import V2VendorDetail from "@/pages/v2/vendor-detail";
import V2DSCRCalculator from "@/pages/v2/dscr-calculator";

function Router() {
  return (
    <Switch>
      {/* Proposal routes - no Layout wrapper */}
      <Route path="/proposal" component={ProposalIndex} />
      <Route path="/proposal/welcome" component={ProposalWelcome} />
      <Route path="/proposal/funnel" component={ProposalFunnel} />
      <Route path="/proposal/auth" component={ProposalAuth} />
      <Route
        path="/proposal/profile-select"
        component={ProposalProfileSelect}
      />
      <Route path="/proposal/onboarding" component={ProposalOnboarding} />
      <Route path="/proposal/dashboard" component={ProposalDashboard} />
      <Route path="/proposal/admin" component={ProposalAdmin} />
      <Route path="/proposal/my-profile" component={ProposalMyProfile} />
      <Route path="/proposal/property/:id" component={ProposalPropertyDetail} />
      <Route path="/proposal/property-map" component={ProposalPropertyMap} />
      <Route
        path="/proposal/property-manage"
        component={ProposalPropertyManage}
      />
      <Route path="/proposal/market-trends" component={ProposalMarketTrends} />
      <Route path="/proposal/loan/step-1" component={ProposalLoanStep1} />
      <Route path="/proposal/loan/step-2" component={ProposalLoanStep2} />
      <Route path="/proposal/loan/step-3" component={ProposalLoanStep3} />
      <Route path="/proposal/loan/step-4" component={ProposalLoanStep4} />
      <Route path="/proposal/loan/step-5" component={ProposalLoanStep5} />
      <Route path="/proposal/loan-status" component={ProposalLoanStatus} />
      <Route path="/proposal/book-call" component={ProposalBookCall} />
      <Route path="/proposal/credit" component={ProposalCredit} />
      <Route path="/proposal/ai-assistant" component={ProposalAiAssistant} />
      <Route path="/proposal/ai-logs" component={ProposalAiLogs} />
      <Route path="/proposal/leads" component={ProposalLeads} />
      <Route path="/proposal/reports" component={ProposalReports} />
      <Route path="/proposal/verify" component={ProposalVerify} />

      {/* V2 routes - Functional version with Stitch template */}
      <Route path="/v2" component={V2Landing} />
      <Route path="/v2/dashboard" component={V2Dashboard} />
      <Route path="/v2/property-search" component={V2PropertySearch} />
      <Route path="/v2/applications" component={V2Applications} />
      <Route path="/v2/application/:id" component={V2ApplicationDetail} />
      <Route path="/v2/ai-assistant" component={V2AiAssistant} />
      <Route path="/v2/loan/step-1" component={V2LoanStep1} />
      <Route path="/v2/loan/step-2" component={V2LoanStep2} />
      <Route path="/v2/loan/step-3" component={V2LoanStep3} />
      <Route path="/v2/loan/step-4" component={V2LoanStep4} />
      <Route path="/v2/properties" component={V2Properties} />
      <Route path="/v2/property/:id" component={V2PropertyDetail} />
      <Route path="/v2/my-properties" component={V2MyProperties} />
      <Route path="/v2/vendors" component={V2Vendors} />
      <Route path="/v2/vendor/:id" component={V2VendorDetail} />
      <Route path="/v2/dscr-calculator" component={V2DSCRCalculator} />

      {/* Main site routes - with Layout wrapper */}
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/search" component={SearchPage} />
            <Route path="/property-search" component={PropertySearchPage} />
            <Route path="/property/:id" component={PropertyDetails} />
            <Route
              path="/property-profile/:id"
              component={PropertyProfilePage}
            />
            <Route path="/compare" component={PropertyComparePage} />
            <Route path="/marketplace" component={MarketplacePage} />
            <Route path="/alerts" component={AlertsPage} />
            <Route path="/analysis/:id" component={AnalysisPage} />
            <Route path="/calculator" component={CalculatorPage} />
            <Route path="/learning" component={LearningPage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/admin" component={AdminDashboard} />
            <Route path="/loan/:id" component={LoanDetailPage} />
            <Route path="/logo-preview" component={LogoPreview} />
            <Route path="/terms" component={LegalPage} />
            <Route path="/privacy" component={LegalPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

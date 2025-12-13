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

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/search" component={SearchPage} />
        <Route path="/property-search" component={PropertySearchPage} />
        <Route path="/analysis/:id" component={AnalysisPage} />
        <Route path="/calculator" component={CalculatorPage} />
        <Route path="/learning" component={LearningPage} />
        <Route path="/dashboard" component={DashboardPage} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/loan/:id" component={LoanDetailPage} />
        <Route path="/terms" component={LegalPage} />
        <Route path="/privacy" component={LegalPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
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

import { useState, useEffect } from "react";
import { getAllApplications } from "@/services/ApplicationServices";
import type { LoanApplication } from "@/lib/schema";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Building2,
  Bell,
  AlertCircle,
  TrendingUp,
  Home,
  Wallet,
  BarChart3,
  Plus,
  FileText,
  MoreVertical,
  AlertTriangle,
  Clock,
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  Users,
  DollarSign,
  Settings,
  MapPin,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { InvesteeLogo } from "@/components/InvesteeLogo";

// Sample inventory data for demo
const sampleInventory = [
  {
    id: 1,
    address: "123 Maple Ave",
    acquired: "Oct 12",
    valuation: 250000,
    projected: 50000,
    stage: "Renovation",
    progress: 60,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100&q=80",
  },
  {
    id: 2,
    address: "880 Oak St",
    acquired: "Sep 05",
    valuation: 390000,
    projected: 80000,
    stage: "Listed",
    progress: 90,
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=100&q=80",
  },
  {
    id: 3,
    address: "45 Pine Ln",
    acquired: "Nov 20",
    valuation: 180000,
    projected: 30000,
    stage: "Demo",
    progress: 15,
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=100&q=80",
  },
];

// ... [keep imports]

export default function DashboardPage() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();

  useEffect(() => {
    async function fetchApplications() {
      try {
        const response = await getAllApplications();
        if (response.status === 200) {
          setApplications(response.data);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "underwriting":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "funded":
        return "bg-purple-100 text-purple-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "active":
        return "bg-emerald-100 text-emerald-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage.toLowerCase()) {
      case "renovation":
        return "bg-primary";
      case "listed":
        return "bg-blue-500";
      case "demo":
        return "bg-orange-500";
      default:
        return "bg-gray-400";
    }
  };

  // Calculate stats from applications
  const totalVolume = applications.reduce(
    (sum, app) => sum + (app.loanAmount || 0),
    0
  );
  const approvedCount = applications.filter(
    (a) => a.status === "approved"
  ).length;
  const activeCount = applications.length;

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    { href: "/property-search", label: "Inventory", icon: Home },
    { href: "/calculator", label: "Projects", icon: FolderKanban },
    { href: "/learning", label: "Network", icon: Users },
    { href: "/dashboard", label: "Finances", icon: DollarSign },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-slate-50">
      {/* Sidebar - Hidden on mobile */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white flex-shrink-0 h-full">
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-2 mb-8 mt-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <InvesteeLogo size={28} />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-slate-800">
                Investee
              </h1>
              <p className="text-xs text-slate-500">Investor Pro</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Settings & User */}
          <div className="mt-auto border-t border-slate-200 pt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            <div className="flex items-center gap-3 mt-4 px-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-green-400"></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Alex Morgan</p>
                <p className="text-xs text-slate-500 truncate">
                  alex@investee.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1400px] mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-800">
                  Dashboard
                </h2>
                <p className="text-slate-500 text-base">
                  Good Morning, Alex. Here is your portfolio update.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link href="/property-search">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 shadow-sm"
                  >
                    <Home className="h-4 w-4 text-primary" />
                    Add Property
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 shadow-sm"
                >
                  <FileText className="h-4 w-4 text-primary" />
                  Request Draw
                </Button>
                <Link href="/calculator">
                  <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4" />
                    New Project
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-slate-500 text-sm font-medium">
                    Est. Net Profit
                  </p>
                  <span className="p-1 rounded bg-emerald-50 text-emerald-600">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">
                    $
                    {totalVolume > 0
                      ? Math.round(totalVolume * 0.15).toLocaleString()
                      : "145,000"}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-500">
                    +12%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-slate-500 text-sm font-medium">
                    Active Flips
                  </p>
                  <span className="p-1 rounded bg-blue-50 text-blue-600">
                    <Home className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">
                    {activeCount || 4}
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    On Track
                  </span>
                </div>
                <div className="flex -space-x-2 mt-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 border-2 border-white"></div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
                </div>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-slate-500 text-sm font-medium">
                    Cash on Hand
                  </p>
                  <span className="p-1 rounded bg-amber-50 text-amber-600">
                    <Wallet className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">$52,000</h3>
                  <span className="text-xs font-semibold text-red-500">
                    -5%
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Enough for 2 months burn
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-slate-500 text-sm font-medium">
                    Total ROI
                  </p>
                  <span className="p-1 rounded bg-purple-50 text-purple-600">
                    <BarChart3 className="h-4 w-4" />
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-slate-800">18%</h3>
                  <span className="text-xs font-semibold text-emerald-500">
                    +2%
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: "65%" }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Inventory & Map */}
              <div className="xl:col-span-2 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">
                    Active Inventory
                  </h3>
                  <Link
                    href="/property-search"
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {/* Inventory Table */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-medium">
                          <th className="px-6 py-4">Property</th>
                          <th className="px-6 py-4">Valuation</th>
                          <th className="px-6 py-4">Stage</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm">
                        {sampleInventory.map((property) => (
                          <tr
                            key={property.id}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className="h-10 w-10 rounded bg-cover bg-center"
                                  style={{
                                    backgroundImage: `url('${property.image}')`,
                                  }}
                                ></div>
                                <div>
                                  <p className="font-medium text-slate-900">
                                    {property.address}
                                  </p>
                                  <p className="text-xs text-slate-500">
                                    Acquired: {property.acquired}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-slate-900 font-medium">
                                ${property.valuation.toLocaleString()}
                              </p>
                              <p className="text-xs text-emerald-600">
                                +${property.projected.toLocaleString()} proj.
                              </p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-slate-900 text-xs font-medium">
                                  {property.stage}
                                </span>
                                <div className="w-24 h-1.5 bg-slate-200 rounded-full">
                                  <div
                                    className={`h-1.5 rounded-full ${getStageColor(
                                      property.stage
                                    )}`}
                                    style={{ width: `${property.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <Badge
                                className={getStatusColor(property.status)}
                                variant="secondary"
                              >
                                {property.status}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                <MoreVertical className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Portfolio Map */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-64 relative">
                  <div className="absolute top-4 left-4 z-10 bg-white/90 px-3 py-1 rounded-md shadow backdrop-blur-sm">
                    <span className="text-xs font-bold text-slate-800">
                      Portfolio Map
                    </span>
                  </div>
                  <div
                    className="h-full w-full bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-97.7431,30.2672,10,0/800x400?access_token=pk.eyJ1IjoiZXhhbXBsZXMiLCJhIjoiY2p0MG01MXRqMW45cjQzb2R6b2ptc3J4MSJ9.zA2W0IkI0c6KaAhJfk9bWg')`,
                      filter: "grayscale(10%) contrast(105%)",
                    }}
                  >
                    <div className="absolute top-1/2 left-1/3 h-4 w-4 bg-primary rounded-full ring-4 ring-primary/30 animate-pulse"></div>
                    <div className="absolute top-1/3 left-2/3 h-4 w-4 bg-blue-500 rounded-full ring-4 ring-blue-500/30"></div>
                    <div className="absolute bottom-1/4 left-1/2 h-4 w-4 bg-orange-500 rounded-full ring-4 ring-orange-500/30"></div>
                  </div>
                </div>
              </div>

              {/* Right Column - Alerts & Activity */}
              <div className="flex flex-col gap-6">
                {/* Priority Alerts */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">
                      Priority Alerts
                    </h3>
                    <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      3
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3 p-3 rounded-lg bg-red-50 border border-red-100">
                      <div className="text-red-500 mt-0.5">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Funding Approval Needed
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Draw request #204 for 123 Maple Ave requires your
                          signature.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                      <div className="text-amber-500 mt-0.5">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          Contractor Delay
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Roofing team rescheduled for Thursday at 45 Pine Ln.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                      <div className="text-blue-500 mt-0.5">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          New Listing Match
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          3BR/2BA in your target zipcode just hit the market.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800">
                      Recent Activity
                    </h3>
                  </div>
                  <div className="relative pl-4 border-l border-slate-200 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[21px] bg-white p-1 rounded-full border border-slate-200">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <p className="text-sm text-slate-600">
                        Lender approved draw request for{" "}
                        <span className="font-bold text-slate-800">
                          $15,000
                        </span>
                        .
                      </p>
                      <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] bg-white p-1 rounded-full border border-slate-200">
                        <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                      </div>
                      <p className="text-sm text-slate-600">
                        Contractor uploaded 5 new photos for{" "}
                        <span className="font-medium text-slate-800">
                          Maple Ave
                        </span>
                        .
                      </p>
                      <p className="text-xs text-slate-400 mt-1">4 hours ago</p>
                    </div>
                    <div className="relative">
                      <div className="absolute -left-[21px] bg-white p-1 rounded-full border border-slate-200">
                        <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                      </div>
                      <p className="text-sm text-slate-600">
                        New valuation report available for{" "}
                        <span className="font-medium text-slate-800">
                          Oak St
                        </span>
                        .
                      </p>
                      <p className="text-xs text-slate-400 mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loan Applications Section - Keeping original functionality */}
            {applications.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-800">
                    My Loan Applications
                  </h3>
                  <Link href="/calculator">
                    <Button size="sm">Start New Application</Button>
                  </Link>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  {applications.map((app) => (
                    <div
                      key={app.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b last:border-0 hover:bg-slate-50 transition-colors gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg text-primary hidden sm:block">
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">
                              {app.loanType} Loan
                            </h3>
                            <Badge
                              className={getStatusColor(app.status)}
                              variant="secondary"
                            >
                              {app.status.toUpperCase().replace("_", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500">
                            {app.propertyType} • Requested: $
                            {app.loanAmount?.toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-400 mt-1">
                            Submitted on{" "}
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link href={`/loan/${app.id}`}>
                        <Button
                          variant="outline"
                          className="w-full md:w-auto group"
                        >
                          View Status
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

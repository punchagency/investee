import { useState } from "react";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ChevronRight,
  Home,
  Edit3,
  Share2,
  Download,
  Check,
  Wrench,
  PaintBucket,
  Plus,
  MessageCircle,
  Phone,
  FileText,
  Table,
  Send,
  Image,
  MapPin,
  Clock,
  Upload,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

// Sample property data (in real app would come from API)
const sampleProperty = {
  id: "1",
  address: "123 Maple Avenue",
  city: "Springfield",
  state: "IL",
  type: "Single Family Residence",
  sqft: 2400,
  beds: 4,
  baths: 3,
  status: "Under Renovation",
  purchasePrice: 250000,
  purchaseDate: "Oct 12",
  renoBudget: 60000,
  renoUtilized: 27000,
  renoPercent: 45,
  projectedArv: 420000,
  grossLift: 68,
  projectedRoi: 35.4,
  netProfit: 110000,
  photos: [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80",
  ],
  timeline: [
    {
      id: 1,
      title: "Demolition & Cleanout",
      date: "Completed on Oct 20",
      status: "done",
      progress: 100,
      contractors: [],
    },
    {
      id: 2,
      title: "Rough-in (Plumbing/Electric)",
      date: "Expected: Nov 15",
      status: "in_progress",
      progress: 60,
      contractors: ["Mike's Plumbing", "Elite Electric"],
    },
    {
      id: 3,
      title: "Drywall & Paint",
      date: "Scheduled: Nov 20",
      status: "pending",
      progress: 0,
      contractors: [],
    },
  ],
  contractors: [
    {
      id: 1,
      name: "Mike's Plumbing",
      initials: "MP",
      type: "Plumbing",
      status: "Active",
      color: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      id: 2,
      name: "Elite Electric",
      initials: "EE",
      type: "Electrical",
      status: "Scheduled",
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ],
  documents: [
    { id: 1, name: "Appraisal_v1.pdf", size: "2.4 MB", date: "Oct 10", type: "pdf", color: "bg-rose-50 text-rose-500 border-rose-100" },
    { id: 2, name: "Contract_Signed.docx", size: "1.1 MB", date: "Oct 12", type: "doc", color: "bg-blue-50 text-blue-500 border-blue-100" },
    { id: 3, name: "Budget_Estimate.xlsx", size: "500 KB", date: "Oct 15", type: "excel", color: "bg-emerald-50 text-emerald-500 border-emerald-100" },
  ],
  activity: [
    {
      id: 1,
      type: "message",
      from: "Mike (Plumber)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
      message: "Hey, just finished the rough-in for the master bath. Inspection is scheduled for tomorrow.",
      time: "2 hours ago",
      isMe: false,
    },
    {
      id: 2,
      type: "action",
      message: "You uploaded Appraisal_v1.pdf",
      time: "3 hours ago",
    },
    {
      id: 3,
      type: "message",
      from: "You",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
      message: "Great! Let me know as soon as the inspector signs off.",
      time: "1 hour ago",
      isMe: true,
    },
  ],
};

export default function PropertyDetails() {
  const params = useParams();
  const [newMessage, setNewMessage] = useState("");
  const property = sampleProperty; // In real app, fetch based on params.id

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <Check className="h-4 w-4" />;
      case "in_progress":
        return <Wrench className="h-4 w-4" />;
      case "pending":
        return <PaintBucket className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "done":
        return {
          circle: "bg-emerald-100 text-emerald-600 ring-white",
          line: "bg-emerald-200/50",
          badge: "bg-emerald-50 text-emerald-600",
        };
      case "in_progress":
        return {
          circle: "bg-primary text-white ring-primary/20 shadow-lg shadow-primary/20",
          line: "bg-slate-100",
          badge: "bg-primary/10 text-primary",
        };
      case "pending":
        return {
          circle: "bg-slate-100 text-slate-400 ring-white",
          line: "bg-slate-100",
          badge: "bg-slate-50 text-slate-400",
        };
      default:
        return {
          circle: "bg-slate-100 text-slate-400 ring-white",
          line: "bg-slate-100",
          badge: "bg-slate-50 text-slate-400",
        };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-[1440px] mx-auto p-4 md:p-8 flex flex-col gap-8">
        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <Link href="/dashboard" className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <Link href="/property-search" className="text-slate-500 hover:text-primary transition-colors">
            Inventory
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-300" />
          <span className="text-slate-800 font-medium">{property.address}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-end pb-8 border-b border-slate-200">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight">
                {property.address}, {property.city}
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-bold uppercase text-xs tracking-wide">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                {property.status}
              </Badge>
            </div>
            <p className="text-slate-500 text-base font-medium flex items-center gap-3">
              <Home className="h-4 w-4 text-slate-400" />
              {property.type}
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              {property.sqft.toLocaleString()} sqft
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              {property.beds} Bed / {property.baths} Bath
            </p>
          </div>
          <div className="flex gap-3 w-full lg:w-auto">
            <Button variant="outline" className="flex-1 lg:flex-none">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Property
            </Button>
            <Button variant="outline" className="flex-1 lg:flex-none">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button className="flex-1 lg:flex-none bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2/3) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1 group"
              >
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider group-hover:text-primary transition-colors">
                  Purchase Price
                </span>
                <div className="text-2xl font-bold text-slate-800">
                  ${property.purchasePrice.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400 mt-1">Acquired on {property.purchaseDate}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1 relative overflow-hidden"
              >
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Reno Budget</span>
                <div className="text-2xl font-bold text-slate-800">
                  ${property.renoBudget.toLocaleString()}
                </div>
                <div className="w-full bg-orange-50 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-orange-400 h-full rounded-full transition-all" style={{ width: `${property.renoPercent}%` }}></div>
                </div>
                <div className="text-xs text-orange-500 mt-1 font-medium">
                  {property.renoPercent}% utilized (${(property.renoUtilized / 1000).toFixed(0)}k)
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1"
              >
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Projected ARV</span>
                <div className="text-2xl font-bold text-slate-800">
                  ${property.projectedArv.toLocaleString()}
                </div>
                <div className="text-xs text-emerald-600 mt-1 flex items-center font-medium">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{property.grossLift}% Gross lift
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-primary to-primary/80 p-5 rounded-xl shadow-lg shadow-primary/20 flex flex-col gap-1 text-white relative overflow-hidden group"
              >
                <div className="absolute -right-4 -top-4 bg-white/10 rounded-full w-24 h-24 blur-xl group-hover:scale-150 transition-transform duration-700"></div>
                <span className="text-primary-foreground/70 text-xs font-bold uppercase tracking-wider z-10">
                  Projected ROI
                </span>
                <div className="text-3xl font-black z-10">{property.projectedRoi}%</div>
                <div className="text-xs text-primary-foreground/70 mt-1 z-10">
                  Net Profit: ~${(property.netProfit / 1000).toFixed(0)}k
                </div>
              </motion.div>
            </div>

            {/* Renovation Timeline */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Renovation Timeline</h3>
                <button className="text-primary text-sm font-semibold hover:text-primary/80 hover:underline">
                  View Full Schedule
                </button>
              </div>
              <div className="p-6">
                <div className="flex flex-col gap-8">
                  {property.timeline.map((item, index) => {
                    const styles = getStatusStyles(item.status);
                    const isLast = index === property.timeline.length - 1;

                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ring-4 ${styles.circle}`}
                          >
                            {getStatusIcon(item.status)}
                          </div>
                          {!isLast && <div className={`w-0.5 flex-1 ${styles.line} my-1`}></div>}
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className={`font-semibold text-sm ${item.status === "pending" ? "text-slate-400" : "text-slate-800"}`}>
                                {item.title}
                              </h4>
                              <p className="text-slate-400 text-xs mt-0.5">{item.date}</p>
                            </div>
                            <Badge className={`${styles.badge} text-[10px] font-bold uppercase tracking-wide`}>
                              {item.status === "done" ? "Done" : item.status === "in_progress" ? "In Progress" : "Pending"}
                            </Badge>
                          </div>
                          {item.status === "in_progress" && (
                            <>
                              <div className="w-full bg-slate-100 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                              <div className="flex justify-between mt-2">
                                <span className="text-xs text-slate-500 font-medium">
                                  {item.contractors.join(", ")}
                                </span>
                                <span className="text-xs font-bold text-primary">{item.progress}%</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Photos and Map Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Property Photos */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <Image className="h-4 w-4 text-slate-400" />
                    Property Photos
                  </h3>
                  <button className="text-primary text-xs font-bold hover:underline uppercase tracking-wide">
                    Add New
                  </button>
                </div>
                <div className="p-5 grid grid-cols-2 gap-3">
                  <div
                    className="aspect-square rounded-lg bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity ring-1 ring-slate-100 shadow-sm"
                    style={{ backgroundImage: `url('${property.photos[0]}')` }}
                  ></div>
                  <div className="grid grid-rows-2 gap-3">
                    <div
                      className="rounded-lg bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity ring-1 ring-slate-100 shadow-sm"
                      style={{ backgroundImage: `url('${property.photos[1]}')` }}
                    ></div>
                    <div
                      className="rounded-lg bg-cover bg-center cursor-pointer hover:opacity-90 transition-opacity relative ring-1 ring-slate-100 shadow-sm"
                      style={{ backgroundImage: `url('${property.photos[2]}')` }}
                    >
                      <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center rounded-lg backdrop-blur-[1px]">
                        <span className="text-white font-bold text-sm">+12</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Map */}
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-5 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    Location
                  </h3>
                </div>
                <div
                  className="flex-1 bg-cover bg-center min-h-[200px]"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80')",
                  }}
                >
                  <div className="w-full h-full bg-slate-500/10 flex items-center justify-center backdrop-blur-[1px]">
                    <div className="bg-white p-2.5 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
                      <MapPin className="h-4 w-4 text-rose-500" />
                      <span className="text-xs font-bold text-slate-800">{property.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (1/3) - Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Contractors */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-800">Contractors</h3>
                <button className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-slate-200 text-primary transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="divide-y divide-slate-50">
                {property.contractors.map((contractor) => (
                  <div
                    key={contractor.id}
                    className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm border ${contractor.color}`}
                    >
                      {contractor.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{contractor.name}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {contractor.type} • {contractor.status}
                      </p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-8 w-8 rounded-full bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-400 flex items-center justify-center transition-all shadow-sm">
                        <MessageCircle className="h-4 w-4" />
                      </button>
                      <button className="h-8 w-8 rounded-full bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-400 flex items-center justify-center transition-all shadow-sm">
                        <Phone className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-50">
                <button className="text-xs font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-wide">
                  View All Contractors
                </button>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-800">Documents</h3>
                <button className="text-primary hover:bg-primary/10 rounded-md px-2 py-1 text-xs font-bold uppercase transition-colors tracking-wide">
                  Upload
                </button>
              </div>
              <div className="p-2 space-y-1">
                {property.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors"
                  >
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border ${doc.color}`}
                    >
                      {doc.type === "pdf" ? (
                        <FileText className="h-5 w-5" />
                      ) : doc.type === "doc" ? (
                        <FileText className="h-5 w-5" />
                      ) : (
                        <Table className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                      <p className="text-xs text-slate-400">
                        {doc.size} • {doc.date}
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="flex-1 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[300px]">
              <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base font-bold text-slate-800">Activity</h3>
                <Clock className="h-4 w-4 text-slate-400" />
              </div>
              <div className="flex-1 p-4 overflow-y-auto space-y-4 max-h-[400px] bg-white">
                {property.activity.map((item) =>
                  item.type === "action" ? (
                    <div key={item.id} className="flex gap-3 justify-center py-2">
                      <div className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1 text-[10px] text-slate-500 font-medium flex items-center gap-1 shadow-sm">
                        <Upload className="h-3 w-3" />
                        {item.message}
                      </div>
                    </div>
                  ) : (
                    <div key={item.id} className={`flex gap-3 ${item.isMe ? "flex-row-reverse" : ""}`}>
                      <div className="mt-1">
                        <div
                          className="bg-center bg-no-repeat bg-cover rounded-full h-8 w-8 ring-2 ring-slate-100"
                          style={{ backgroundImage: `url('${item.avatar}')` }}
                        ></div>
                      </div>
                      <div className={`flex flex-col gap-1 ${item.isMe ? "items-end" : ""}`}>
                        <div
                          className={`${
                            item.isMe
                              ? "bg-primary/10 rounded-l-2xl rounded-br-2xl border-primary/10"
                              : "bg-slate-50 rounded-r-2xl rounded-bl-2xl border-slate-100"
                          } p-3 text-sm text-slate-600 border`}
                        >
                          <span
                            className={`font-bold block text-xs mb-1 ${
                              item.isMe ? "text-primary text-right" : "text-slate-800"
                            }`}
                          >
                            {item.from}
                          </span>
                          {item.message}
                        </div>
                        <span className={`text-[10px] text-slate-400 ${item.isMe ? "mr-1" : "ml-1"}`}>
                          {item.time}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                <div className="flex gap-2">
                  <Input
                    className="flex-1 bg-white shadow-sm"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button className="bg-primary hover:bg-primary/90 shadow-sm shadow-primary/20">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

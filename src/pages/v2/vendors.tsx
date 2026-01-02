import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { V2Sidebar } from "./V2Layout";
import { useState } from "react";
import type { Vendor } from "@/lib/schema";
import { getAllVendors, createVendor } from "@/services/VendorServices";

const categoryLabels: Record<string, string> = {
  contractor: "General Contractor",
  inspector: "Home Inspector",
  appraiser: "Appraiser",
  attorney: "Real Estate Attorney",
  title: "Title Company",
  insurance: "Insurance Agent",
  property_manager: "Property Manager",
  landscaping: "Landscaping",
  cleaning: "Cleaning Service",
  handyman: "Handyman",
  plumber: "Plumber",
  electrician: "Electrician",
  hvac: "HVAC",
  roofing: "Roofing",
  other: "Other",
};

const categoryIcons: Record<string, string> = {
  contractor: "construction",
  inspector: "search",
  appraiser: "assessment",
  attorney: "gavel",
  title: "description",
  insurance: "shield",
  property_manager: "apartment",
  landscaping: "grass",
  cleaning: "cleaning_services",
  handyman: "handyman",
  plumber: "plumbing",
  electrician: "electrical_services",
  hvac: "ac_unit",
  roofing: "roofing",
  other: "more_horiz",
};

export default function V2Vendors() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const { data: vendors, isLoading } = useQuery<Vendor[]>({
    queryKey: ["vendors"],
    queryFn: async () => {
      const response = await getAllVendors();
      return response.data;
    },
  });

  const createVendorMutation = useMutation({
    mutationFn: async (vendorData: Partial<Vendor>) => {
      const response = await createVendor(vendorData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      setShowAddModal(false);
    },
  });

  const filteredVendors = vendors?.filter((vendor) => {
    const matchesSearch =
      searchQuery === "" ||
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || vendor.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = Object.keys(categoryLabels);

  const renderStars = (rating: string | null) => {
    if (!rating) return null;
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const hasHalf = numRating % 1 >= 0.5;

    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`material-symbols-outlined text-sm ${
              i < fullStars
                ? "text-yellow-400"
                : i === fullStars && hasHalf
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
          >
            {i < fullStars
              ? "star"
              : i === fullStars && hasHalf
              ? "star_half"
              : "star"}
          </span>
        ))}
        <span className="text-sm text-gray-600 ml-1">
          ({numRating.toFixed(1)})
        </span>
      </div>
    );
  };

  return (
    <V2Sidebar>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Vendor Services
            </h1>
            <p className="text-gray-600">
              Find trusted professionals for your real estate projects
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Add Vendor
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search vendors by name, city, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent bg-white"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabels[category]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Quick Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === "all"
                ? "bg-[#0f49bd] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.slice(0, 8).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-[#0f49bd] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {categoryIcons[category]}
              </span>
              {categoryLabels[category]}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0f49bd]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#0f49bd]">
                  groups
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {vendors?.length || 0}
                </p>
                <p className="text-sm text-gray-500">Total Vendors</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-green-600">
                  verified
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {vendors?.filter((v) => v.verified).length || 0}
                </p>
                <p className="text-sm text-gray-500">Verified</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-orange-600">
                  star
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {vendors && vendors.length > 0
                    ? (
                        vendors.reduce(
                          (acc, v) =>
                            acc + (v.rating ? parseFloat(String(v.rating)) : 0),
                          0
                        ) / vendors.filter((v) => v.rating).length
                      ).toFixed(1)
                    : "0"}
                </p>
                <p className="text-sm text-gray-500">Avg Rating</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-600">
                  category
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(vendors?.map((v) => v.category)).size || 0}
                </p>
                <p className="text-sm text-gray-500">Categories</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vendor Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
              progress_activity
            </span>
          </div>
        ) : filteredVendors && filteredVendors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVendors.map((vendor) => (
              <Link
                key={vendor.id}
                href={`/v2/vendor/${vendor.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-[#0f49bd]/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#0f49bd]/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[#0f49bd] text-2xl">
                      {categoryIcons[vendor.category] || "business"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 truncate group-hover:text-[#0f49bd] transition-colors">
                        {vendor.name}
                      </h3>
                      {vendor.verified && (
                        <span className="material-symbols-outlined text-green-600 text-base">
                          verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#0f49bd] font-medium mb-2">
                      {categoryLabels[vendor.category] || vendor.category}
                    </p>
                    {vendor.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {vendor.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {renderStars(String(vendor.rating))}
                      {vendor.city && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">
                            location_on
                          </span>
                          {vendor.city}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {vendor.licensed && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-50 text-green-700 text-xs">
                      <span className="material-symbols-outlined text-xs">
                        badge
                      </span>
                      Licensed
                    </span>
                  )}
                  {vendor.insured && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                      <span className="material-symbols-outlined text-xs">
                        shield
                      </span>
                      Insured
                    </span>
                  )}
                  {vendor.priceRange && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs">
                      {vendor.priceRange}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-gray-400 text-2xl">
                search_off
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No vendors found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== "all"
                ? "Try adjusting your search or filters"
                : "Be the first to add a vendor to the directory"}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add First Vendor
            </button>
          </div>
        )}
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <AddVendorModal
          onClose={() => setShowAddModal(false)}
          onSubmit={(data) => createVendorMutation.mutate(data)}
          isLoading={createVendorMutation.isPending}
        />
      )}
    </V2Sidebar>
  );
}

function AddVendorModal({
  onClose,
  onSubmit,
  isLoading,
}: {
  onClose: () => void;
  onSubmit: (data: Partial<Vendor>) => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: "",
    category: "contractor",
    description: "",
    phone: "",
    email: "",
    website: "",
    city: "",
    state: "",
    priceRange: "$$",
    licensed: false,
    insured: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Add New Vendor</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent bg-white"
            >
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://"
              className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              value={formData.priceRange}
              onChange={(e) =>
                setFormData({ ...formData, priceRange: e.target.value })
              }
              className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd] focus:border-transparent bg-white"
            >
              <option value="$">$ - Budget</option>
              <option value="$$">$$ - Moderate</option>
              <option value="$$$">$$$ - Premium</option>
              <option value="$$$$">$$$$ - Luxury</option>
            </select>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.licensed}
                onChange={(e) =>
                  setFormData({ ...formData, licensed: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-[#0f49bd] focus:ring-[#0f49bd]"
              />
              <span className="text-sm text-gray-700">Licensed</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.insured}
                onChange={(e) =>
                  setFormData({ ...formData, insured: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-[#0f49bd] focus:ring-[#0f49bd]"
              />
              <span className="text-sm text-gray-700">Insured</span>
            </label>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-full border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 rounded-full bg-[#0f49bd] text-white font-bold hover:bg-[#0d3da0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Adding...
                </>
              ) : (
                "Add Vendor"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

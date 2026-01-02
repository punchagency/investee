import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { V2Sidebar } from "./V2Layout";
import type { LoanApplication, PropertyFavorite, Property } from "@/lib/schema";
import { getFavorites, removeFavorite } from "@/services/FavoriteServices";
import {
  getAllProperties,
  getStreetViewImageUrl,
} from "@/services/PropertyServices";
import { getAllApplications } from "@/services/ApplicationServices";

// Get or create a session ID for favorites
function getSessionId(): string {
  let sessionId = localStorage.getItem("investee_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("investee_session_id", sessionId);
  }
  return sessionId;
}

// Generate Street View URL for a property
const getStreetViewUrl = (address: string | null, city: string | null) => {
  if (!address || !city) return null;
  const fullAddress = `${address}, ${city}, CA`;
  return getStreetViewImageUrl(fullAddress);
};

export default function V2MyProperties() {
  const [activeTab, setActiveTab] = useState<"favorites" | "applications">(
    "favorites"
  );
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  // Fetch favorites
  const { data: favorites, isLoading: loadingFavorites } = useQuery<
    PropertyFavorite[]
  >({
    queryKey: ["favorites", sessionId],
    queryFn: async () => {
      const response = await getFavorites(sessionId);
      return response.data;
    },
  });

  // Fetch all properties to get details for favorites
  const { data: allProperties } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await getAllProperties();
      return response.data;
    },
  });

  // Create a map of property ID to property for quick lookup
  const propertyMap = new Map<string, Property>();
  allProperties?.forEach((p) => propertyMap.set(p.id, p));

  // Fetch applications
  const { data: applications, isLoading: loadingApplications } = useQuery<
    LoanApplication[]
  >({
    queryKey: ["applications"],
    queryFn: async () => {
      const response = await getAllApplications();
      return response.data;
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await removeFavorite(propertyId, sessionId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", sessionId] });
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in_review":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <V2Sidebar>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">
              My Properties
            </h1>
            <p className="text-gray-600 mt-1">
              Track your saved properties and loan applications
            </p>
          </div>
          <Link
            href="/v2/property-search"
            className="flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            Search Properties
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab("favorites")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === "favorites"
                ? "bg-[#0f49bd] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">favorite</span>
            Favorites
            {favorites && favorites.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "favorites"
                    ? "bg-white/20"
                    : "bg-[#0f49bd]/10 text-[#0f49bd]"
                }`}
              >
                {favorites.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("applications")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              activeTab === "applications"
                ? "bg-[#0f49bd] text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              description
            </span>
            Applications
            {applications && applications.length > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "applications"
                    ? "bg-white/20"
                    : "bg-[#0f49bd]/10 text-[#0f49bd]"
                }`}
              >
                {applications.length}
              </span>
            )}
          </button>
        </div>

        {/* Favorites Tab */}
        {activeTab === "favorites" && (
          <>
            {loadingFavorites ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
                  progress_activity
                </span>
                <p className="text-gray-600 mt-4">Loading favorites...</p>
              </div>
            ) : favorites && favorites.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map((fav) => {
                  const property = propertyMap.get(fav.propertyId);
                  const streetViewUrl = property
                    ? getStreetViewUrl(property.address, property.city)
                    : null;

                  return (
                    <div
                      key={fav.id}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Property Image - Clickable to property detail */}
                      <Link
                        href={`/v2/property/${fav.propertyId}`}
                        className="block"
                      >
                        <div className="h-40 bg-gradient-to-br from-[#0f49bd]/20 to-[#0f49bd]/5 relative overflow-hidden">
                          {streetViewUrl ? (
                            <img
                              src={streetViewUrl}
                              alt={property?.address || "Property"}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const fallback =
                                  e.currentTarget.parentElement?.querySelector(
                                    ".fallback-icon"
                                  );
                                if (fallback)
                                  (fallback as HTMLElement).style.display =
                                    "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`fallback-icon absolute inset-0 items-center justify-center ${
                              streetViewUrl ? "hidden" : "flex"
                            }`}
                          >
                            <span className="material-symbols-outlined text-[#0f49bd] text-4xl">
                              home
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeFavoriteMutation.mutate(fav.propertyId);
                            }}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-red-500 hover:text-red-600 transition-colors shadow-sm z-10"
                            title="Remove from favorites"
                          >
                            <span className="material-symbols-outlined text-xl">
                              favorite
                            </span>
                          </button>
                        </div>
                      </Link>
                      <div className="p-4">
                        <Link href={`/v2/property/${fav.propertyId}`}>
                          <h3 className="text-gray-900 font-bold mb-1 truncate hover:text-[#0f49bd] transition-colors">
                            {property?.address ||
                              `Property #${fav.propertyId.slice(0, 8)}`}
                          </h3>
                          {property?.city && (
                            <p className="text-gray-600 text-sm mb-1">
                              {property.city}
                            </p>
                          )}
                        </Link>
                        {property?.estValue && (
                          <p className="text-[#0f49bd] font-bold mb-2">
                            {formatCurrency(property.estValue)}
                          </p>
                        )}
                        <p className="text-gray-400 text-xs mb-4">
                          Saved on {formatDate(fav.createdAt)}
                        </p>
                        <div className="flex gap-2">
                          <Link
                            href={`/v2/loan/step-1?address=${encodeURIComponent(
                              (property?.address || "") +
                                ", " +
                                (property?.city || "")
                            )}&value=${property?.estValue || 0}`}
                            className="flex-1 flex items-center justify-center gap-1 h-9 rounded-lg bg-[#0f49bd] text-white text-sm font-medium hover:bg-[#0d3da0] transition-colors"
                          >
                            <span className="material-symbols-outlined text-base">
                              description
                            </span>
                            Apply
                          </Link>
                          <button
                            onClick={() =>
                              removeFavoriteMutation.mutate(fav.propertyId)
                            }
                            className="h-9 px-3 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">
                    favorite_border
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No Favorites Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Save properties you're interested in to easily find them
                  later.
                </p>
                <Link
                  href="/v2/property-search"
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">
                    search
                  </span>
                  Search Properties
                </Link>
              </div>
            )}
          </>
        )}

        {/* Applications Tab */}
        {activeTab === "applications" && (
          <>
            {loadingApplications ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
                  progress_activity
                </span>
                <p className="text-gray-600 mt-4">Loading applications...</p>
              </div>
            ) : applications && applications.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Loan Type
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#0f49bd]/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[#0f49bd]">
                                  {app.loanType === "DSCR"
                                    ? "account_balance"
                                    : "construction"}
                                </span>
                              </div>
                              <div>
                                <p className="text-gray-900 font-medium truncate max-w-[200px]">
                                  {app.address || "No address"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {app.propertyType}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900">
                              {app.loanType}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-900 font-medium">
                              {formatCurrency(app.loanAmount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                app.status
                              )}`}
                            >
                              {app.status
                                .replace("_", " ")
                                .charAt(0)
                                .toUpperCase() +
                                app.status.slice(1).replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-gray-600">
                              {formatDate(app.submittedAt)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Link
                              href={`/v2/application/${app.id}`}
                              className="text-[#0f49bd] text-sm font-medium hover:underline flex items-center gap-1"
                            >
                              View Details
                              <span className="material-symbols-outlined text-base">
                                chevron_right
                              </span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-2xl">
                    description
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start your first loan application to get financing for your
                  investment property.
                </p>
                <Link
                  href="/v2/loan/step-1"
                  className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">add</span>
                  Start Application
                </Link>
              </div>
            )}

            {/* Stats Summary */}
            {applications && applications.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-gray-600 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {applications.length}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-gray-600 text-sm">Total Loan Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(
                      applications.reduce(
                        (sum, app) => sum + (app.loanAmount || 0),
                        0
                      )
                    )}
                  </p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <p className="text-gray-600 text-sm">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      applications.filter((app) => app.status === "approved")
                        .length
                    }
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </V2Sidebar>
  );
}

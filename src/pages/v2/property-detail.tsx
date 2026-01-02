import { Link, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { V2Sidebar } from "./V2Layout";
import type { Property } from "@/lib/schema";
import {
  calculateQuickDSCR,
  calculateDSCR,
  estimateMonthlyRent,
  estimateMonthlyTaxes,
  estimateMonthlyInsurance,
  formatCurrency as formatDSCRCurrency,
} from "@/lib/dscr";
import { DSCRIndicator, DSCRSummary } from "@/components/dscr-indicator";
import {
  getPropertyById,
  getStreetViewImageUrl,
} from "@/services/PropertyServices";
import {
  checkIsFavorite,
  addFavorite,
  removeFavorite,
} from "@/services/FavoriteServices";

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

// Generate Google Maps embed URL for a property
const getMapEmbedUrl = (address: string | null, city: string | null) => {
  if (!address || !city) return null;
  const fullAddress = `${address}, ${city}, CA`;
  return `https://www.google.com/maps?q=${encodeURIComponent(
    fullAddress
  )}&output=embed`;
};

export default function V2PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [viewMode, setViewMode] = useState<"streetview" | "map">("streetview");
  const [activeTab, setActiveTab] = useState<"overview" | "dscr">("overview");
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  // DSCR Calculator state - will be initialized after property loads
  const [dscrInputs, setDscrInputs] = useState<{
    monthlyRent: number;
    downPaymentPercent: number;
    interestRate: number;
    loanTermYears: number;
    monthlyTaxes: number;
    monthlyInsurance: number;
    monthlyHOA: number;
  } | null>(null);

  const {
    data: property,
    isLoading,
    error,
  } = useQuery<Property>({
    queryKey: [`property`, id],
    queryFn: async () => {
      const response = await getPropertyById(id!);
      return response.data;
    },
    enabled: !!id,
  });

  // Check if current property is favorited
  const { data: isFavorited } = useQuery({
    queryKey: ["favorites", id, sessionId],
    queryFn: async () => {
      if (!id) return false;
      const res = await checkIsFavorite(id, sessionId);
      return res.data.isFavorite;
    },
    enabled: !!id,
  });

  // Add favorite mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await addFavorite(propertyId, sessionId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", id, sessionId] });
      queryClient.invalidateQueries({ queryKey: ["favorites", sessionId] });
    },
  });

  // Remove favorite mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const res = await removeFavorite(propertyId, sessionId);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", id, sessionId] });
      queryClient.invalidateQueries({ queryKey: ["favorites", sessionId] });
    },
  });

  const toggleFavorite = () => {
    if (!id) return;
    if (isFavorited) {
      removeFavoriteMutation.mutate(id);
    } else {
      addFavoriteMutation.mutate(id);
    }
  };

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
    SFR: "Single Family Residence",
    MFR: "Multi-Family Residence",
    CND: "Condominium",
    APT: "Apartment Building",
    COM: "Commercial",
    IND: "Industrial",
    LND: "Land",
    RES: "Residential",
    OTH: "Other",
  };

  // Initialize DSCR inputs when property loads (must be before early returns)
  const initialDscrInputs = useMemo(() => {
    if (!property?.estValue) return null;
    const propertyValue = parseFloat(property.estValue);
    const estRent = property.estRent
      ? parseFloat(property.estRent)
      : estimateMonthlyRent(propertyValue, {
          beds: property.beds ? parseFloat(property.beds) : undefined,
        });
    return {
      monthlyRent: estRent,
      downPaymentPercent: 25,
      interestRate: 7.5,
      loanTermYears: 30,
      monthlyTaxes: estimateMonthlyTaxes(propertyValue),
      monthlyInsurance: estimateMonthlyInsurance(propertyValue),
      monthlyHOA: 0,
    };
  }, [property]);

  // Use either user-modified inputs or initial inputs
  const currentInputs = dscrInputs || initialDscrInputs;

  // Calculate DSCR result (must be before early returns)
  const dscrResult = useMemo(() => {
    if (!currentInputs || !property?.estValue) return null;
    const propertyValue = parseFloat(property.estValue);
    return calculateDSCR({
      monthlyRent: currentInputs.monthlyRent,
      purchasePrice: propertyValue,
      downPaymentPercent: currentInputs.downPaymentPercent,
      interestRate: currentInputs.interestRate,
      loanTermYears: currentInputs.loanTermYears,
      monthlyTaxes: currentInputs.monthlyTaxes,
      monthlyInsurance: currentInputs.monthlyInsurance,
      monthlyHOA: currentInputs.monthlyHOA,
    });
  }, [currentInputs, property]);

  if (isLoading) {
    return (
      <V2Sidebar>
        <div className="flex items-center justify-center py-12">
          <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
            progress_activity
          </span>
        </div>
      </V2Sidebar>
    );
  }

  if (error || !property) {
    return (
      <V2Sidebar>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="material-symbols-outlined text-red-600 text-2xl">
              error
            </span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Property Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/v2/properties"
            className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold"
          >
            Back to Properties
          </Link>
        </div>
      </V2Sidebar>
    );
  }

  const equity = property.estEquity ? parseFloat(property.estEquity) : 0;
  const value = property.estValue ? parseFloat(property.estValue) : 0;
  const equityPercent = value > 0 ? ((equity / value) * 100).toFixed(1) : 0;

  return (
    <V2Sidebar>
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <Link
          href="/v2/properties"
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm mb-4"
        >
          <span className="material-symbols-outlined text-base">
            arrow_back
          </span>
          Back to Properties
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          {/* Street View / Map Toggle */}
          <div className="relative">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setViewMode("streetview")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  viewMode === "streetview"
                    ? "text-[#0f49bd] border-b-2 border-[#0f49bd] -mb-[1px]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  streetview
                </span>
                Street View
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  viewMode === "map"
                    ? "text-[#0f49bd] border-b-2 border-[#0f49bd] -mb-[1px]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span className="material-symbols-outlined text-lg">map</span>
                Map View
              </button>
            </div>

            <div className="h-64 relative">
              {viewMode === "streetview" ? (
                <div className="w-full h-full bg-gray-100 relative">
                  {getStreetViewUrl(property.address, property.city) ? (
                    <img
                      src={getStreetViewUrl(property.address, property.city)!}
                      alt={`Street view of ${property.address}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        const fallback =
                          e.currentTarget.parentElement?.querySelector(
                            ".fallback-message"
                          );
                        if (fallback) fallback.classList.remove("hidden");
                      }}
                    />
                  ) : null}
                  <div
                    className={`fallback-message absolute inset-0 flex items-center justify-center bg-gray-100 ${
                      getStreetViewUrl(property.address, property.city)
                        ? "hidden"
                        : ""
                    }`}
                  >
                    <div className="text-center">
                      <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
                        location_off
                      </span>
                      <p className="text-gray-500 text-sm">
                        Street View not available
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-100 relative">
                  {getMapEmbedUrl(property.address, property.city) ? (
                    <iframe
                      src={getMapEmbedUrl(property.address, property.city)!}
                      title={`Map of ${property.address}`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-gray-400 text-4xl mb-2">
                          map
                        </span>
                        <p className="text-gray-500 text-sm">
                          Map not available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {property.foreclosure && (
                <span className="absolute top-4 right-4 px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg flex items-center gap-2 z-10">
                  <span className="material-symbols-outlined text-base">
                    gavel
                  </span>
                  Foreclosure
                </span>
              )}
            </div>
          </div>

          {/* Property Info */}
          <div className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-[#0f49bd]/10 text-[#0f49bd] text-sm font-medium rounded-full mb-3">
                  {propertyTypeLabels[property.propertyType || ""] ||
                    property.propertyType}
                </span>
                <h1 className="text-2xl font-bold text-gray-900">
                  {property.address}
                </h1>
                <p className="text-gray-600">{property.city}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Estimated Value</p>
                <p className="text-3xl font-bold text-[#0f49bd]">
                  {formatCurrency(property.estValue)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                activeTab === "overview"
                  ? "text-[#0f49bd] border-b-2 border-[#0f49bd] -mb-[1px]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="material-symbols-outlined text-lg">info</span>
              Overview
            </button>
            <button
              onClick={() => setActiveTab("dscr")}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                activeTab === "dscr"
                  ? "text-[#0f49bd] border-b-2 border-[#0f49bd] -mb-[1px]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                calculate
              </span>
              DSCR Calculator
              {dscrResult && (
                <span
                  className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                    dscrResult.statusColor === "green"
                      ? "bg-green-100 text-green-700"
                      : dscrResult.statusColor === "yellow"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {dscrResult.dscr}
                </span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Property Details
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {property.beds && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0f49bd]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0f49bd]">
                          bed
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Bedrooms</p>
                        <p className="text-gray-900 font-bold">
                          {property.beds}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.baths && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0f49bd]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0f49bd]">
                          bathtub
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Bathrooms</p>
                        <p className="text-gray-900 font-bold">
                          {property.baths}
                        </p>
                      </div>
                    </div>
                  )}
                  {property.sqFt && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0f49bd]/10 flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0f49bd]">
                          square_foot
                        </span>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Sq Ft</p>
                        <p className="text-gray-900 font-bold">
                          {parseInt(property.sqFt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0f49bd]/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[#0f49bd]">
                        {property.ownerOccupied
                          ? "person"
                          : "real_estate_agent"}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Occupancy</p>
                      <p className="text-gray-900 font-bold">
                        {property.ownerOccupied ? "Owner" : "Tenant/Vacant"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Financial Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Estimated Value</span>
                    <span className="text-gray-900 font-bold">
                      {formatCurrency(property.estValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Estimated Equity</span>
                    <span
                      className={`font-bold ${
                        equity >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(property.estEquity)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-gray-600">Equity Percentage</span>
                    <span
                      className={`font-bold ${
                        equity >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {equityPercent}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600">Listed for Sale</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        property.listedForSale
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {property.listedForSale ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Owner Information
                </h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-gray-500">
                      person
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">
                      {property.owner || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {property.ownerOccupied
                        ? "Owner Occupied"
                        : "Non-Owner Occupied"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">
                  Investment Potential
                </h3>
                <div className="space-y-4">
                  {/* DSCR Indicator */}
                  {property.estValue &&
                    (() => {
                      const propertyValue = parseFloat(property.estValue);
                      const estRent = property.estRent
                        ? parseFloat(property.estRent)
                        : undefined;
                      const dscrResult = calculateQuickDSCR(propertyValue, {
                        estimatedRent: estRent,
                        beds: property.beds
                          ? parseFloat(property.beds)
                          : undefined,
                        sqft: property.sqFt
                          ? parseFloat(property.sqFt)
                          : undefined,
                        propertyType: property.propertyType || undefined,
                      });
                      return (
                        <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">
                                DSCR Rating
                              </p>
                              <p className="text-xs text-gray-500">
                                Debt Service Coverage Ratio
                              </p>
                            </div>
                            <DSCRIndicator
                              dscr={dscrResult.dscr}
                              status={dscrResult.status}
                              statusColor={dscrResult.statusColor}
                              size="md"
                            />
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Est. Monthly Rent</span>
                              <span className="font-medium text-gray-700">
                                ${dscrResult.estimatedRent.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Est. Debt Service</span>
                              <span className="font-medium text-gray-700">
                                $
                                {dscrResult.monthlyDebtService.toLocaleString()}
                                /mo
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  <div className="p-4 rounded-lg bg-[#0f49bd]/5">
                    <p className="text-sm text-gray-600 mb-1">
                      Estimated Equity
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        equity >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(property.estEquity)}
                    </p>
                  </div>
                  {property.foreclosure && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-red-600">
                          gavel
                        </span>
                        <span className="font-bold text-red-800">
                          Foreclosure Property
                        </span>
                      </div>
                      <p className="text-sm text-red-700">
                        This property is in foreclosure, which may present a
                        buying opportunity at below market value.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Take Action</h3>
                <div className="space-y-3">
                  <Link
                    href={`/v2/loan/step-1?address=${encodeURIComponent(
                      property.address + ", " + property.city
                    )}&value=${property.estValue || 0}`}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-[#0f49bd] text-white font-bold hover:bg-[#0d3da0] transition-colors"
                  >
                    <span className="material-symbols-outlined">
                      description
                    </span>
                    Apply for Loan
                  </Link>
                  <button
                    onClick={() => setActiveTab("dscr")}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold hover:from-green-600 hover:to-emerald-700 transition-all"
                  >
                    <span className="material-symbols-outlined">calculate</span>
                    Calculate DSCR
                  </button>
                  <Link
                    href="/v2/ai-assistant"
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                  >
                    <span className="material-symbols-outlined">smart_toy</span>
                    Ask AI About This Property
                  </Link>
                  <button
                    onClick={toggleFavorite}
                    disabled={
                      addFavoriteMutation.isPending ||
                      removeFavoriteMutation.isPending
                    }
                    className={`flex items-center justify-center gap-2 w-full h-12 rounded-full font-medium transition-colors ${
                      isFavorited
                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100"
                        : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="material-symbols-outlined">
                      {isFavorited ? "favorite" : "favorite_border"}
                    </span>
                    {isFavorited ? "Saved" : "Save Property"}
                  </button>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our team can help you analyze this property and find the right
                  financing options.
                </p>
                <button className="flex items-center justify-center gap-2 w-full h-10 rounded-full border border-[#0f49bd] text-[#0f49bd] font-medium hover:bg-[#0f49bd]/5 transition-colors">
                  <span className="material-symbols-outlined">call</span>
                  Schedule a Call
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* DSCR Calculator Tab */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calculator Inputs */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">
                DSCR Calculator
              </h2>

              {currentInputs && (
                <div className="space-y-6">
                  {/* Income Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-green-600 text-lg">
                        payments
                      </span>
                      Rental Income
                    </h3>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">
                        Monthly Rent
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          $
                        </span>
                        <input
                          type="number"
                          value={currentInputs.monthlyRent}
                          onChange={(e) =>
                            setDscrInputs({
                              ...currentInputs,
                              monthlyRent: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full h-10 pl-7 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Loan Terms Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-blue-600 text-lg">
                        account_balance
                      </span>
                      Loan Terms
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Down Payment %
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={currentInputs.downPaymentPercent}
                            onChange={(e) =>
                              setDscrInputs({
                                ...currentInputs,
                                downPaymentPercent:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            %
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Interest Rate
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            value={currentInputs.interestRate}
                            onChange={(e) =>
                              setDscrInputs({
                                ...currentInputs,
                                interestRate: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full h-10 px-3 pr-8 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                            %
                          </span>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">
                          Loan Term
                        </label>
                        <select
                          value={currentInputs.loanTermYears}
                          onChange={(e) =>
                            setDscrInputs({
                              ...currentInputs,
                              loanTermYears: parseInt(e.target.value) || 30,
                            })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                        >
                          <option value={15}>15 Years</option>
                          <option value={20}>20 Years</option>
                          <option value={30}>30 Years</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Expenses Section */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-600 text-lg">
                        receipt_long
                      </span>
                      Monthly Expenses
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Property Taxes
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={currentInputs.monthlyTaxes}
                            onChange={(e) =>
                              setDscrInputs({
                                ...currentInputs,
                                monthlyTaxes: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full h-10 pl-7 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Insurance
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={currentInputs.monthlyInsurance}
                            onChange={(e) =>
                              setDscrInputs({
                                ...currentInputs,
                                monthlyInsurance:
                                  parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full h-10 pl-7 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                          />
                        </div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm text-gray-600 mb-1">
                          HOA Fees (optional)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            $
                          </span>
                          <input
                            type="number"
                            value={currentInputs.monthlyHOA}
                            onChange={(e) =>
                              setDscrInputs({
                                ...currentInputs,
                                monthlyHOA: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full h-10 pl-7 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reset Button */}
                  <button
                    onClick={() => setDscrInputs(null)}
                    className="text-sm text-[#0f49bd] hover:underline"
                  >
                    Reset to defaults
                  </button>
                </div>
              )}
            </div>

            {/* Results */}
            <div className="space-y-6">
              {dscrResult && currentInputs && (
                <>
                  {/* DSCR Summary */}
                  <DSCRSummary
                    dscr={dscrResult.dscr}
                    status={dscrResult.status}
                    statusColor={dscrResult.statusColor}
                    message={dscrResult.message}
                    qualifies={dscrResult.qualifies}
                    monthlyRent={currentInputs.monthlyRent}
                    monthlyMortgage={dscrResult.monthlyMortgage}
                    monthlyTaxes={currentInputs.monthlyTaxes}
                    monthlyInsurance={currentInputs.monthlyInsurance}
                    monthlyHOA={currentInputs.monthlyHOA}
                    totalDebtService={dscrResult.totalDebtService}
                    monthlyNetCashFlow={dscrResult.monthlyNetCashFlow}
                  />

                  {/* Detailed Breakdown */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">
                      Monthly Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Purchase Price</span>
                        <span className="font-bold text-gray-900">
                          {formatCurrency(property.estValue)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Loan Amount</span>
                        <span className="font-bold text-gray-900">
                          {formatDSCRCurrency(dscrResult.loanAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Monthly Mortgage (P&I)
                        </span>
                        <span className="font-bold text-gray-900">
                          {formatDSCRCurrency(dscrResult.monthlyMortgage)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">
                          Total Debt Service
                        </span>
                        <span className="font-bold text-gray-900">
                          {formatDSCRCurrency(dscrResult.totalDebtService)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600">Monthly Rent</span>
                        <span className="font-bold text-green-600">
                          {formatDSCRCurrency(currentInputs?.monthlyRent || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-semibold">
                          Monthly Cash Flow
                        </span>
                        <span
                          className={`font-bold text-lg ${
                            dscrResult.monthlyNetCashFlow >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {dscrResult.monthlyNetCashFlow >= 0 ? "+" : ""}
                          {formatDSCRCurrency(dscrResult.monthlyNetCashFlow)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Apply for Loan CTA */}
                  <div className="bg-gradient-to-r from-[#0f49bd] to-[#1A2A4D] rounded-xl p-6 text-white">
                    <h3 className="font-bold text-lg mb-2">Ready to Invest?</h3>
                    <p className="text-blue-100 text-sm mb-4">
                      {dscrResult.qualifies
                        ? "This property qualifies for DSCR financing. Apply now to get pre-approved."
                        : "Consider adjusting your terms or down payment to improve the DSCR ratio."}
                    </p>
                    <Link
                      href={`/v2/loan/step-1?address=${encodeURIComponent(
                        property.address + ", " + property.city
                      )}&value=${property.estValue || 0}`}
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-full bg-white text-[#0f49bd] font-bold hover:bg-gray-100 transition-colors"
                    >
                      <span className="material-symbols-outlined">
                        description
                      </span>
                      Apply for DSCR Loan
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </V2Sidebar>
  );
}

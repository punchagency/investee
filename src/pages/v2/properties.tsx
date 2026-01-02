import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { V2Sidebar } from "./V2Layout";
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

// Helper to calculate DSCR for a property
const getPropertyDSCR = (property: Property): number | null => {
  if (!property.estValue) return null;
  const propertyValue = parseFloat(property.estValue);
  const estRent = property.estRent ? parseFloat(property.estRent) : undefined;
  const dscrResult = calculateQuickDSCR(propertyValue, {
    estimatedRent: estRent,
    beds: property.beds ? parseFloat(property.beds) : undefined,
    sqft: property.sqFt ? parseFloat(property.sqFt) : undefined,
    propertyType: property.propertyType || undefined,
  });
  return dscrResult.dscr;
};

export default function V2Properties() {
  const [filters, setFilters] = useState({
    propertyType: "all",
    minValue: "",
    maxValue: "",
    minBeds: "",
    foreclosureOnly: false,
    dscrRange: "all", // all, excellent (>=1.25), good (1.10-1.24), poor (<1.10)
  });
  const [searchQuery, setSearchQuery] = useState("");

  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await getAllProperties();
      return response.data;
    },
  });

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
    RES: "Residential",
    OTH: "Other",
  };

  // Filter properties
  const filteredProperties = properties?.filter((property) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        property.address?.toLowerCase().includes(query) ||
        property.city?.toLowerCase().includes(query) ||
        property.owner?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Property type filter
    if (
      filters.propertyType !== "all" &&
      property.propertyType !== filters.propertyType
    ) {
      return false;
    }

    // Value filters
    const value = property.estValue ? parseFloat(property.estValue) : 0;
    if (filters.minValue && value < parseFloat(filters.minValue)) return false;
    if (filters.maxValue && value > parseFloat(filters.maxValue)) return false;

    // Beds filter
    if (filters.minBeds && property.beds) {
      if (parseFloat(property.beds) < parseFloat(filters.minBeds)) return false;
    }

    // Foreclosure filter
    if (filters.foreclosureOnly && !property.foreclosure) return false;

    // DSCR range filter
    if (filters.dscrRange !== "all") {
      const dscr = getPropertyDSCR(property);
      if (dscr === null) return false;

      switch (filters.dscrRange) {
        case "excellent":
          if (dscr < 1.25) return false;
          break;
        case "good":
          if (dscr < 1.1 || dscr >= 1.25) return false;
          break;
        case "poor":
          if (dscr >= 1.1) return false;
          break;
      }
    }

    return true;
  });

  // Get unique property types for filter
  const propertyTypes = Array.from(
    new Set(properties?.map((p) => p.propertyType).filter(Boolean))
  );

  return (
    <V2Sidebar>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
          <div>
            <h1 className="text-gray-900 text-3xl font-black leading-tight tracking-[-0.033em]">
              Property Discovery
            </h1>
            <p className="text-gray-600 mt-1">
              Browse {properties?.length || 0} investment properties
            </p>
          </div>
          <Link
            href="/v2/property-search"
            className="flex items-center justify-center gap-2 h-10 px-5 rounded-full bg-[#0f49bd] text-white text-sm font-bold hover:bg-[#0d3da0] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">search</span>
            Search by Address
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by address, city, or owner..."
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 focus:border-[#0f49bd] text-gray-900 text-sm"
              />
            </div>

            {/* Property Type Filter */}
            <select
              value={filters.propertyType}
              onChange={(e) =>
                setFilters({ ...filters, propertyType: e.target.value })
              }
              className="h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 text-gray-900 text-sm"
            >
              <option value="all">All Types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type!}>
                  {propertyTypeLabels[type!] || type}
                </option>
              ))}
            </select>

            {/* Min Value */}
            <select
              value={filters.minValue}
              onChange={(e) =>
                setFilters({ ...filters, minValue: e.target.value })
              }
              className="h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 text-gray-900 text-sm"
            >
              <option value="">Min Value</option>
              <option value="100000">$100K+</option>
              <option value="500000">$500K+</option>
              <option value="1000000">$1M+</option>
              <option value="2000000">$2M+</option>
              <option value="5000000">$5M+</option>
            </select>

            {/* Max Value */}
            <select
              value={filters.maxValue}
              onChange={(e) =>
                setFilters({ ...filters, maxValue: e.target.value })
              }
              className="h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 text-gray-900 text-sm"
            >
              <option value="">Max Value</option>
              <option value="500000">Up to $500K</option>
              <option value="1000000">Up to $1M</option>
              <option value="2000000">Up to $2M</option>
              <option value="5000000">Up to $5M</option>
              <option value="10000000">Up to $10M</option>
            </select>

            {/* DSCR Range Filter */}
            <select
              value={filters.dscrRange}
              onChange={(e) =>
                setFilters({ ...filters, dscrRange: e.target.value })
              }
              className="h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0f49bd]/50 text-gray-900 text-sm"
            >
              <option value="all">All DSCR</option>
              <option value="excellent">Excellent (≥1.25)</option>
              <option value="good">Good (1.10-1.24)</option>
              <option value="poor">Poor (&lt;1.10)</option>
            </select>

            {/* Foreclosure Toggle */}
            <label className="flex items-center gap-2 px-3 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.foreclosureOnly}
                onChange={(e) =>
                  setFilters({ ...filters, foreclosureOnly: e.target.checked })
                }
                className="w-4 h-4 rounded border-gray-300 text-[#0f49bd] focus:ring-[#0f49bd]"
              />
              <span className="text-sm text-gray-700 whitespace-nowrap">
                Foreclosures
              </span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProperties?.length || 0} of{" "}
            {properties?.length || 0} properties
          </p>
          {(filters.propertyType !== "all" ||
            filters.minValue ||
            filters.maxValue ||
            filters.dscrRange !== "all" ||
            filters.foreclosureOnly ||
            searchQuery) && (
            <button
              onClick={() => {
                setFilters({
                  propertyType: "all",
                  minValue: "",
                  maxValue: "",
                  minBeds: "",
                  foreclosureOnly: false,
                  dscrRange: "all",
                });
                setSearchQuery("");
              }}
              className="text-sm text-[#0f49bd] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Property Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <span className="material-symbols-outlined animate-spin text-[#0f49bd] text-3xl">
              progress_activity
            </span>
          </div>
        ) : filteredProperties && filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Link
                key={property.id}
                href={`/v2/property/${property.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-[#0f49bd]/30 transition-all group"
              >
                {/* Property Image */}
                <div className="h-40 bg-gradient-to-br from-[#0f49bd]/10 to-[#0f49bd]/5 relative overflow-hidden">
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
                    <span className="material-symbols-outlined text-[#0f49bd]/30 text-5xl">
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

                {/* Property Details */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 truncate group-hover:text-[#0f49bd] transition-colors flex-1">
                      {property.address}
                    </h3>
                    {/* DSCR Badge */}
                    {property.estValue &&
                      (() => {
                        const propertyValue = parseFloat(property.estValue);
                        // Use actual estRent if available, otherwise estimate based on property characteristics
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
                          <DSCRBadge
                            dscr={dscrResult.dscr}
                            statusColor={dscrResult.statusColor}
                          />
                        );
                      })()}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{property.city}</p>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    {property.beds && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          bed
                        </span>
                        {property.beds} beds
                      </span>
                    )}
                    {property.baths && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          bathtub
                        </span>
                        {property.baths} baths
                      </span>
                    )}
                    {property.sqFt && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">
                          square_foot
                        </span>
                        {parseInt(property.sqFt).toLocaleString()} sqft
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Est. Value</p>
                      <p className="text-lg font-bold text-[#0f49bd]">
                        {formatCurrency(property.estValue)}
                      </p>
                    </div>
                    {property.estEquity &&
                      parseFloat(property.estEquity) > 0 && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Est. Equity</p>
                          <p className="text-sm font-medium text-green-600">
                            {formatCurrency(property.estEquity)}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-gray-400 text-2xl">
                home
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query.
            </p>
            <button
              onClick={() => {
                setFilters({
                  propertyType: "all",
                  minValue: "",
                  maxValue: "",
                  minBeds: "",
                  foreclosureOnly: false,
                  dscrRange: "all",
                });
                setSearchQuery("");
              }}
              className="text-[#0f49bd] font-medium hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </V2Sidebar>
  );
}

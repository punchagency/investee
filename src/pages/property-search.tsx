import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  Loader2,
  MapPin,
  DollarSign,
  Bed,
  Bath,
  Plus,
  TrendingUp,
  Filter,
  Grid3X3,
  List,
  Bookmark,
  Heart,
  ChevronDown,
  Home,
  X,
  Building2,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchProperty, type AttomPropertyData } from "@/services/attom";
import { Link } from "wouter";
import type { Property } from "@/lib/schema";

import {
  getAllProperties,
  getStreetViewImageUrl,
} from "@/services/PropertyServices";

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

const getStatusBadge = (property: Property) => {
  if (property.foreclosure) {
    return {
      label: "Foreclosure",
      color: "bg-red-100 text-red-700 border-red-200",
    };
  }
  if (property.listedForSale) {
    return {
      label: "For Sale",
      color: "bg-blue-100 text-blue-700 border-blue-200",
    };
  }
  if (property.ownerOccupied) {
    return {
      label: "Owner Occupied",
      color: "bg-purple-100 text-purple-700 border-purple-200",
    };
  }
  return {
    label: "Investment",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
  };
};

// Generate Street View URL for a property
const getStreetViewUrl = (address: string | null, city: string | null) => {
  if (!address || !city) return null;
  const fullAddress = `${address}, ${city}, CA`;
  return getStreetViewImageUrl(fullAddress);
};

export default function PropertySearch() {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [property, setProperty] = useState<AttomPropertyData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch properties from database
  const { data: properties = [], isLoading: isLoadingProperties } = useQuery<
    Property[]
  >({
    queryKey: ["properties"],
    queryFn: async () => {
      const response = await getAllProperties();
      return response.data;
    },
  });

  // Filters - price range in thousands (max $25M)
  const [priceRange, setPriceRange] = useState([0, 25000]);
  const [filters, setFilters] = useState({
    foreclosure: false,
    ownerOccupied: false,
    listedForSale: false,
  });

  // Filter properties based on selected filters and price range
  const filteredProperties = properties.filter((prop) => {
    const estValue = Number(prop.estValue) || 0;
    const minPrice = priceRange[0] * 1000;
    const maxPrice = priceRange[1] * 1000;

    if (estValue < minPrice || estValue > maxPrice) return false;

    // If any filter is checked, only show matching properties
    const hasActiveFilter =
      filters.foreclosure || filters.ownerOccupied || filters.listedForSale;
    if (hasActiveFilter) {
      if (filters.foreclosure && !prop.foreclosure) return false;
      if (filters.ownerOccupied && !prop.ownerOccupied) return false;
      if (filters.listedForSale && !prop.listedForSale) return false;
    }

    // Filter by address search
    if (address.trim()) {
      const searchLower = address.toLowerCase();
      const addressMatch = prop.address?.toLowerCase().includes(searchLower);
      const cityMatch = prop.city?.toLowerCase().includes(searchLower);
      if (!addressMatch && !cityMatch) return false;
    }

    return true;
  });

  const handleSearch = async () => {
    if (!address.trim()) {
      toast.error("Please enter a property address");
      return;
    }

    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const result = await searchProperty(address);
      if (result) {
        setProperty(result);
        toast.success("Property found!", {
          description: `${result.address.line1}, ${result.address.locality}`,
        });
      } else {
        setProperty(null);
        setSearchError("Property not found. Try a different address.");
      }
    } catch (error: any) {
      setProperty(null);
      if (error.message?.includes("not configured")) {
        setSearchError(
          "ATTOM API key is not configured. Please add your API key to continue."
        );
      } else {
        setSearchError("Failed to search property. Please try again.");
      }
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  // Stats
  const totalValue = filteredProperties.reduce(
    (acc, p) => acc + (Number(p.estValue) || 0),
    0
  );
  const totalEquity = filteredProperties.reduce(
    (acc, p) => acc + (Number(p.estEquity) || 0),
    0
  );

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      {/* Filters Sidebar */}
      <aside
        className={`${
          showFilters ? "w-72" : "w-0"
        } transition-all duration-300 overflow-hidden bg-white border-r border-slate-200 flex-shrink-0`}
      >
        <div className="p-6 space-y-6 w-72">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-900">Filters</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFilters(false)}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Address Search */}
          <div>
            <Label className="text-slate-600 text-sm font-medium mb-2 block">
              Address, ZIP, or City
            </Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                data-testid="input-property-address"
                placeholder="Search address..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>
            {address && (
              <Button
                size="sm"
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full mt-2 bg-primary hover:bg-primary/90"
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search ATTOM
              </Button>
            )}
          </div>

          {/* Price Range */}
          <div>
            <Label className="text-slate-600 text-sm font-medium mb-3 block">
              Est. Value
            </Label>
            <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
              <span>${(priceRange[0] / 1000).toFixed(1)}M</span>
              <span>${(priceRange[1] / 1000).toFixed(1)}M</span>
            </div>
            <Slider
              defaultValue={[0, 25000]}
              max={25000}
              min={0}
              step={100}
              value={priceRange}
              onValueChange={setPriceRange}
              className="mt-2"
            />
          </div>

          {/* Rehab Budget */}
          <div>
            <Label className="text-slate-600 text-sm font-medium mb-2 block">
              Rehab Budget
            </Label>
            <div className="flex gap-2">
              <Input placeholder="Min" className="text-sm" />
              <Input placeholder="Max" className="text-sm" />
            </div>
          </div>

          {/* Property Status */}
          <div>
            <Label className="text-slate-600 text-sm font-medium mb-3 block">
              Property Status
            </Label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="foreclosure"
                  checked={filters.foreclosure}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, foreclosure: !!checked })
                  }
                />
                <label
                  htmlFor="foreclosure"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Foreclosure
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="ownerOccupied"
                  checked={filters.ownerOccupied}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, ownerOccupied: !!checked })
                  }
                />
                <label
                  htmlFor="ownerOccupied"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Owner Occupied
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="listed"
                  checked={filters.listedForSale}
                  onCheckedChange={(checked) =>
                    setFilters({ ...filters, listedForSale: !!checked })
                  }
                />
                <label
                  htmlFor="listed"
                  className="text-sm text-slate-700 cursor-pointer"
                >
                  Listed for Sale
                </label>
              </div>
            </div>
          </div>

          {/* Saved Searches */}
          <div className="pt-4 border-t border-slate-200">
            <button className="flex items-center gap-2 text-sm text-primary font-medium hover:text-primary/80">
              <Bookmark className="h-4 w-4" />
              Saved Searches
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Property Inventory
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span>
                  <span className="font-semibold text-slate-900">
                    {filteredProperties.length}
                  </span>{" "}
                  Properties
                </span>
                <span>
                  Total Value:{" "}
                  <span className="font-semibold text-primary">
                    ${(totalValue / 1000000).toFixed(1)}M
                  </span>
                </span>
                <span>
                  Total Equity:{" "}
                  <span className="font-semibold text-emerald-600">
                    ${(totalEquity / 1000000).toFixed(1)}M
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!showFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(true)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              )}
              <div className="flex items-center border border-slate-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Link href="/calculator">
                <Button className="bg-primary hover:bg-primary/90 shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Property Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ATTOM Search Result */}
          <AnimatePresence>
            {property && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Badge className="bg-primary text-white mb-2">
                        ATTOM Verified
                      </Badge>
                      <h2
                        className="text-xl font-bold text-slate-900"
                        data-testid="text-property-address"
                      >
                        {property.address.line1}
                      </h2>
                      <p className="text-slate-600">
                        {property.address.locality},{" "}
                        {property.address.countrySubd}{" "}
                        {property.address.postal1}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setProperty(null)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Market Value</p>
                      <p
                        className="text-xl font-bold text-primary"
                        data-testid="text-market-value"
                      >
                        $
                        {property.assessment.market.mktTotalValue?.toLocaleString() ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Beds / Baths</p>
                      <p
                        className="text-xl font-bold text-slate-900"
                        data-testid="text-bedrooms"
                      >
                        {property.building.rooms.beds || "N/A"} /{" "}
                        {property.building.rooms.bathsTotal || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Year Built</p>
                      <p
                        className="text-xl font-bold text-slate-900"
                        data-testid="text-year-built"
                      >
                        {property.summary.yearBuilt || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Building Size</p>
                      <p
                        className="text-xl font-bold text-slate-900"
                        data-testid="text-building-size"
                      >
                        {property.building.size.bldgSize
                          ? `${property.building.size.bldgSize.toLocaleString()} sqft`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-primary/20 flex gap-3">
                    <Link href="/calculator" className="flex-1">
                      <Button
                        className="w-full bg-primary hover:bg-primary/90"
                        data-testid="button-analyze-deal"
                      >
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Analyze This Deal
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      onClick={() => setProperty(null)}
                      data-testid="button-new-search"
                    >
                      New Search
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {searchError && !property && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-center"
              >
                <p className="text-red-700" data-testid="text-search-error">
                  {searchError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading State */}
          {isLoadingProperties && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-slate-600">Loading properties...</span>
            </div>
          )}

          {/* Empty State */}
          {!isLoadingProperties && filteredProperties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                No properties found
              </h3>
              <p className="text-slate-500 max-w-md">
                Try adjusting your filters or search criteria to find more
                properties.
              </p>
            </div>
          )}

          {/* Listings Grid */}
          {!isLoadingProperties && filteredProperties.length > 0 && (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }
            >
              {filteredProperties.map((prop) => {
                const status = getStatusBadge(prop);
                const estValue = Number(prop.estValue) || 0;
                const estEquity = Number(prop.estEquity) || 0;
                const sqFt = Number(prop.sqFt) || 0;
                const beds = Number(prop.beds) || 0;
                const baths = Number(prop.baths) || 0;
                const streetViewUrl = getStreetViewUrl(prop.address, prop.city);

                return (
                  <motion.div
                    key={prop.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group ${
                      viewMode === "list" ? "flex" : ""
                    }`}
                  >
                    {/* Property Image */}
                    <div
                      className={`relative ${
                        viewMode === "list" ? "w-64 flex-shrink-0" : ""
                      }`}
                    >
                      {streetViewUrl ? (
                        <div
                          className={`${
                            viewMode === "list" ? "h-full" : "aspect-[4/3]"
                          } overflow-hidden`}
                        >
                          <img
                            src={streetViewUrl}
                            alt={`Street view of ${prop.address}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              // Fallback to placeholder on error
                              e.currentTarget.style.display = "none";
                              e.currentTarget.nextElementSibling?.classList.remove(
                                "hidden"
                              );
                            }}
                          />
                          <div
                            className={`hidden bg-gradient-to-br from-slate-100 to-slate-200 ${
                              viewMode === "list" ? "h-full" : "aspect-[4/3]"
                            } flex items-center justify-center absolute inset-0`}
                          >
                            <Building2 className="h-16 w-16 text-slate-300" />
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`bg-gradient-to-br from-slate-100 to-slate-200 ${
                            viewMode === "list" ? "h-full" : "aspect-[4/3]"
                          } flex items-center justify-center`}
                        >
                          <Building2 className="h-16 w-16 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge
                          className={`${status.color} border font-semibold`}
                        >
                          {status.label}
                        </Badge>
                        {prop.foreclosure && (
                          <Badge className="bg-red-100 text-red-700 border-red-200 border font-semibold">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Foreclosure
                          </Badge>
                        )}
                      </div>
                      <button
                        onClick={() => toggleFavorite(prop.id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites.includes(prop.id)
                              ? "fill-red-500 text-red-500"
                              : "text-slate-400"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div
                      className={`p-5 ${viewMode === "list" ? "flex-1" : ""}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 mb-1">
                            {prop.address}
                          </h3>
                          <p className="text-slate-500 text-sm flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {prop.city}, CA •{" "}
                            {propertyTypeLabels[prop.propertyType || ""] ||
                              prop.propertyType}
                          </p>
                        </div>
                      </div>

                      {/* Owner */}
                      <p className="text-xs text-slate-400 mt-1 truncate">
                        Owner: {prop.owner}
                      </p>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
                        <div>
                          <p className="text-xs text-slate-500 uppercase">
                            Est. Value
                          </p>
                          <p className="font-bold text-slate-900">
                            ${(estValue / 1000).toFixed(0)}k
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase">
                            Est. Equity
                          </p>
                          <p
                            className={`font-bold ${
                              estEquity >= 0
                                ? "text-emerald-600"
                                : "text-red-600"
                            }`}
                          >
                            ${(estEquity / 1000).toFixed(0)}k
                          </p>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                        {beds > 0 && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-4 w-4" /> {beds}
                          </span>
                        )}
                        {baths > 0 && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-4 w-4" /> {baths}
                          </span>
                        )}
                        {sqFt > 0 && <span>{sqFt.toLocaleString()} sqft</span>}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {prop.propertyType}
                          </Badge>
                        </div>
                        <Link href={`/property/${prop.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary/80 font-semibold"
                          >
                            View Details →
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

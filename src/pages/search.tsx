import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, SlidersHorizontal, Search, MapPin, Bed, Bath, DollarSign, Building2, Home, X, ExternalLink, Ruler } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "wouter";
import { searchProperty, type AttomPropertyData } from "@/services/attom";

export default function SearchPage() {
  const [filters, setFilters] = useState({
    investmentType: "All",
    state: "All",
    rehabType: "All"
  });

  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [attomProperty, setAttomProperty] = useState<AttomPropertyData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const { data: allProperties = [], isLoading } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: async () => {
      const res = await fetch("/api/properties");
      if (!res.ok) throw new Error("Failed to fetch properties");
      return res.json();
    },
  });

  const properties = useMemo(() => {
    let filtered = [...allProperties];
    
    if (filters.investmentType !== "All") {
      filtered = filtered.filter((p: any) => p.investmentType === filters.investmentType);
    }
    
    if (filters.state !== "All") {
      filtered = filtered.filter((p: any) => p.state === filters.state);
    }
    
    return filtered;
  }, [allProperties, filters]);

  const handleAttomSearch = async () => {
    if (!address.trim()) {
      toast.error("Please enter a property address");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const result = await searchProperty(address);
      if (result) {
        setAttomProperty(result);
        toast.success("Property found!", {
          description: `${result.address.line1}, ${result.address.locality}`,
        });
      } else {
        setAttomProperty(null);
        setSearchError("Property not found. Try a different address.");
      }
    } catch (error: any) {
      setAttomProperty(null);
      if (error.message?.includes("not configured")) {
        setSearchError("ATTOM API key is not configured.");
      } else {
        setSearchError("Failed to search property. Please try again.");
      }
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAttomSearch();
    }
  };

  const clearAttomResult = () => {
    setAttomProperty(null);
    setAddress("");
    setSearchError(null);
  };

  return (
    <div className="container px-4 md:px-8 py-8 max-w-screen-2xl min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Find Properties</h1>
        <p className="text-muted-foreground">Search by address using ATTOM or browse investment opportunities</p>
      </div>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Search by Address</h2>
            <Badge variant="secondary" className="text-xs">ATTOM API</Badge>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                data-testid="input-attom-address"
                placeholder="e.g. 4529 Winona Court, Denver, CO"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-11"
              />
            </div>
            <Button 
              data-testid="button-attom-search"
              onClick={handleAttomSearch} 
              disabled={isSearching}
              className="h-11 px-6"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Powered by ATTOM Data Solutions - Real estate data for 150M+ U.S. properties
          </p>
        </CardContent>
      </Card>

      <AnimatePresence mode="wait">
        {searchError && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4 flex items-center justify-between">
                <p className="text-red-700 text-sm">{searchError}</p>
                <Button variant="ghost" size="sm" onClick={() => setSearchError(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {attomProperty && (
          <motion.div
            key="attom-result"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-primary/20 overflow-hidden">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className="bg-primary text-white">ATTOM Result</Badge>
                  </div>
                  <h2 className="text-xl font-bold" data-testid="text-attom-address">
                    {attomProperty.address.line1}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {attomProperty.address.locality}, {attomProperty.address.countrySubd} {attomProperty.address.postal1}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={clearAttomResult}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <DollarSign className="w-3 h-3" />
                      Market Value
                    </div>
                    <p className="text-lg font-bold text-primary">
                      ${attomProperty.assessment.market.mktTotalValue?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <DollarSign className="w-3 h-3" />
                      Assessed
                    </div>
                    <p className="text-lg font-bold">
                      ${attomProperty.assessment.assessed.assdTotalValue?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Bed className="w-3 h-3" />
                      Beds
                    </div>
                    <p className="text-lg font-bold">{attomProperty.building.rooms.beds || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Bath className="w-3 h-3" />
                      Baths
                    </div>
                    <p className="text-lg font-bold">{attomProperty.building.rooms.bathsTotal || "N/A"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm border-t pt-4 mb-4">
                  <div>
                    <p className="text-muted-foreground text-xs">Year Built</p>
                    <p className="font-medium">{attomProperty.summary.yearBuilt || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Size</p>
                    <p className="font-medium">
                      {attomProperty.building.size.bldgSize ? `${attomProperty.building.size.bldgSize.toLocaleString()} sq ft` : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Type</p>
                    <p className="font-medium">{attomProperty.summary.propClass || "N/A"}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href="/calculator" className="flex-1">
                    <Button className="w-full" data-testid="button-analyze-attom-deal">
                      <Home className="w-4 h-4 mr-2" />
                      Analyze This Deal
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={clearAttomResult}>
                    New Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-64 shrink-0 space-y-8">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-8"
                onClick={() => setFilters({ investmentType: "All", state: "All", rehabType: "All" })}
              >
                Reset
              </Button>
            </div>
            
            <div className="space-y-6 p-6 bg-card rounded-xl border border-border/60 shadow-sm">
              <div className="space-y-3">
                <Label>Investment Type</Label>
                <Select 
                  value={filters.investmentType} 
                  onValueChange={(v) => setFilters({ ...filters, investmentType: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="DSCR">DSCR Rental</SelectItem>
                    <SelectItem value="Fix & Flip">Fix & Flip</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>State</Label>
                <Select 
                  value={filters.state} 
                  onValueChange={(v) => setFilters({ ...filters, state: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All States</SelectItem>
                    {Array.from(new Set(allProperties.map((p: any) => p.state).filter(Boolean))).sort().map((state: any) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filters.investmentType === "Fix & Flip" && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-3"
                >
                  <Label>Rehab Level</Label>
                  <Select 
                    value={filters.rehabType} 
                    onValueChange={(v) => setFilters({ ...filters, rehabType: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">Any Level</SelectItem>
                      <SelectItem value="Cosmetic">Cosmetic</SelectItem>
                      <SelectItem value="Heavy">Heavy</SelectItem>
                      <SelectItem value="Ground-up">Ground-up</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {filters.investmentType === "All" ? "All" : filters.investmentType} Properties
            </h2>
            <span className="text-muted-foreground text-sm">
              {isLoading ? "Searching..." : `${properties?.length || 0} properties found`}
            </span>
          </div>

          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : properties && properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 text-center">
              <p className="text-lg font-medium text-muted-foreground">No properties found matching your criteria.</p>
              <Button variant="link" onClick={() => setFilters({ investmentType: "All", state: "All", rehabType: "All" })}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Home, MapPin, Calendar, Ruler, DollarSign, Bed, Bath, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchProperty, type AttomPropertyData } from "@/services/attom";
import { Link } from "wouter";

export default function PropertySearch() {
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [property, setProperty] = useState<AttomPropertyData | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

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
        setSearchError("ATTOM API key is not configured. Please add your API key to continue.");
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

  return (
    <div className="container max-w-4xl px-4 md:px-8 py-12 min-h-screen mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-heading font-bold">Property Search</h1>
          <p className="text-muted-foreground text-lg">
            Find property details, valuations, and market data using ATTOM
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Search by Address
            </CardTitle>
            <CardDescription>
              Enter a full property address to get detailed information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  data-testid="input-property-address"
                  placeholder="e.g. 4529 Winona Court, Denver, CO"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg h-12"
                />
              </div>
              <Button 
                data-testid="button-search-property"
                onClick={handleSearch} 
                disabled={isSearching}
                size="lg"
                className="h-12 px-6"
              >
                {isSearching ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Powered by ATTOM Data Solutions - Real estate data for 150M+ U.S. properties
            </p>
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          {isSearching && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Searching ATTOM database...</p>
            </motion.div>
          )}

          {!isSearching && searchError && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center">
                  <p className="text-red-700" data-testid="text-search-error">{searchError}</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!isSearching && property && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <Card className="border-2 border-primary/20 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-6 py-4 border-b">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold" data-testid="text-property-address">
                        {property.address.line1}
                      </h2>
                      <p className="text-muted-foreground">
                        {property.address.locality}, {property.address.countrySubd} {property.address.postal1}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {property.summary.propClass}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <DollarSign className="w-4 h-4" />
                        Market Value
                      </div>
                      <p className="text-2xl font-bold text-primary" data-testid="text-market-value">
                        ${property.assessment.market.mktTotalValue?.toLocaleString() || "N/A"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <DollarSign className="w-4 h-4" />
                        Assessed Value
                      </div>
                      <p className="text-2xl font-bold" data-testid="text-assessed-value">
                        ${property.assessment.assessed.assdTotalValue?.toLocaleString() || "N/A"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Bed className="w-4 h-4" />
                        Bedrooms
                      </div>
                      <p className="text-2xl font-bold" data-testid="text-bedrooms">
                        {property.building.rooms.beds || "N/A"}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Bath className="w-4 h-4" />
                        Bathrooms
                      </div>
                      <p className="text-2xl font-bold" data-testid="text-bathrooms">
                        {property.building.rooms.bathsTotal || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="border-t mt-6 pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Property Details
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Year Built</p>
                        <p className="font-medium" data-testid="text-year-built">
                          {property.summary.yearBuilt || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Building Size</p>
                        <p className="font-medium" data-testid="text-building-size">
                          {property.building.size.bldgSize ? `${property.building.size.bldgSize.toLocaleString()} sq ft` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Property Type</p>
                        <p className="font-medium" data-testid="text-property-type">
                          {property.summary.propLandUse || property.summary.propClass || "N/A"}
                        </p>
                      </div>
                      {property.lot?.lotSize1 && (
                        <div>
                          <p className="text-muted-foreground">Lot Size</p>
                          <p className="font-medium">
                            {property.lot.lotSize1.toFixed(2)} acres
                          </p>
                        </div>
                      )}
                      {property.sale?.amount?.saleamt && (
                        <div>
                          <p className="text-muted-foreground">Last Sale Price</p>
                          <p className="font-medium">
                            ${property.sale.amount.saleamt.toLocaleString()}
                          </p>
                        </div>
                      )}
                      {property.sale?.saleTransDate && (
                        <div>
                          <p className="text-muted-foreground">Last Sale Date</p>
                          <p className="font-medium">
                            {new Date(property.sale.saleTransDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="border-t mt-6 pt-6 flex flex-col sm:flex-row gap-4">
                    <Link href="/calculator" className="flex-1">
                      <Button className="w-full" size="lg" data-testid="button-analyze-deal">
                        <Home className="w-4 h-4 mr-2" />
                        Analyze This Deal
                      </Button>
                    </Link>
                    <Button variant="outline" size="lg" onClick={() => setProperty(null)} data-testid="button-new-search">
                      New Search
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {!isSearching && !property && hasSearched && !searchError && (
            <motion.div
              key="no-results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-yellow-200 bg-yellow-50">
                <CardContent className="p-6 text-center">
                  <p className="text-yellow-700">No property found. Try a different address format.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {!hasSearched && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Address Lookup</h3>
                <p className="text-sm text-muted-foreground">
                  Get property details by entering any U.S. address
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Valuations</h3>
                <p className="text-sm text-muted-foreground">
                  Market values, assessments, and tax information
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-semibold mb-2">Sales History</h3>
                <p className="text-sm text-muted-foreground">
                  Previous sale prices and transaction dates
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </motion.div>
    </div>
  );
}

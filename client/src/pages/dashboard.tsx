import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Building2, Bell, AlertCircle, Home, RefreshCw, CheckCircle, XCircle, Clock, MapPin, Scale, Heart, DollarSign, Tag, Trash2, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Property {
  id: string;
  propertyType: string | null;
  address: string;
  city: string | null;
  state: string | null;
  sqFt: number | null;
  beds: number | null;
  baths: number | null;
  estValue: number | null;
  estEquity: number | null;
  owner: string | null;
  attomStatus: string | null;
  attomMarketValue: number | null;
  attomAssessedValue: number | null;
  attomYearBuilt: number | null;
  attomBldgSize: number | null;
  attomBeds: number | null;
  attomBaths: number | null;
  attomPropClass: string | null;
  attomError: string | null;
  attomAvmValue: number | null;
  attomAvmHigh: number | null;
  attomAvmLow: number | null;
  attomAvmConfidence: number | null;
  attomTaxAmount: number | null;
}

interface Listing {
  id: string;
  propertyId: string;
  status: string;
  listPrice: number | null;
  description: string | null;
  property?: Property | null;
  offers?: Offer[];
}

interface WatchlistItem {
  id: string;
  listingId: string;
  listing?: Listing | null;
  property?: Property | null;
}

interface Offer {
  id: string;
  listingId: string;
  offerAmount: number;
  status: string;
  message: string | null;
  listing?: Listing | null;
  property?: Property | null;
  createdAt: string;
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [myListings, setMyListings] = useState<Listing[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [myOffers, setMyOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [listingDialogOpen, setListingDialogOpen] = useState(false);
  const [selectedPropertyForListing, setSelectedPropertyForListing] = useState<Property | null>(null);
  const [listingPrice, setListingPrice] = useState("");
  const [listingDescription, setListingDescription] = useState("");

  useEffect(() => {
    fetchApplications();
    fetchProperties();
    fetchMyListings();
    fetchWatchlist();
    fetchMyOffers();
  }, []);

  async function fetchApplications() {
    try {
      const response = await fetch("/api/applications");
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchProperties() {
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setPropertiesLoading(false);
    }
  }

  async function enrichAllProperties(force = false) {
    setEnriching(true);
    try {
      await fetch("/api/properties/enrich", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force })
      });
      setTimeout(() => {
        fetchProperties();
        setEnriching(false);
      }, 5000);
    } catch (error) {
      console.error("Error enriching properties:", error);
      setEnriching(false);
    }
  }

  async function enrichSingleProperty(id: string) {
    try {
      await fetch(`/api/properties/${id}/enrich`, { method: "POST" });
      fetchProperties();
    } catch (error) {
      console.error("Error enriching property:", error);
    }
  }

  async function fetchMyListings() {
    try {
      const response = await fetch("/api/listings/my");
      if (response.ok) {
        const data = await response.json();
        setMyListings(data);
      }
    } catch (error) {
      console.error("Error fetching my listings:", error);
    }
  }

  async function fetchWatchlist() {
    try {
      const response = await fetch("/api/watchlist");
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      }
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  }

  async function fetchMyOffers() {
    try {
      const response = await fetch("/api/offers/my");
      if (response.ok) {
        const data = await response.json();
        setMyOffers(data);
      }
    } catch (error) {
      console.error("Error fetching my offers:", error);
    }
  }

  async function createListing() {
    if (!selectedPropertyForListing || !listingPrice) return;
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedPropertyForListing.id,
          listPrice: parseInt(listingPrice),
          description: listingDescription,
          status: "active",
        }),
      });
      if (response.ok) {
        setListingDialogOpen(false);
        setListingPrice("");
        setListingDescription("");
        setSelectedPropertyForListing(null);
        fetchMyListings();
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  }

  async function removeListing(listingId: string) {
    try {
      await fetch(`/api/listings/${listingId}`, { method: "DELETE" });
      fetchMyListings();
    } catch (error) {
      console.error("Error removing listing:", error);
    }
  }

  async function removeFromWatchlist(listingId: string) {
    try {
      await fetch(`/api/watchlist/${listingId}`, { method: "DELETE" });
      fetchWatchlist();
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  }

  async function updateOfferStatus(offerId: string, newStatus: string) {
    try {
      await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchMyOffers();
      fetchMyListings();
    } catch (error) {
      console.error("Error updating offer:", error);
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "submitted": return "bg-blue-100 text-blue-700";
      case "underwriting": return "bg-yellow-100 text-yellow-700";
      case "approved": return "bg-green-100 text-green-700";
      case "funded": return "bg-purple-100 text-purple-700";
      case "rejected": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getAttomStatusIcon = (status: string | null) => {
    switch(status) {
      case "success": return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-600" />;
      case "rate_limited": return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getAttomStatusBadge = (status: string | null) => {
    switch(status) {
      case "success": return <Badge className="bg-green-100 text-green-700">Enriched</Badge>;
      case "failed": return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
      case "rate_limited": return <Badge className="bg-yellow-100 text-yellow-700">Rate Limited</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700">Pending</Badge>;
    }
  };

  const successCount = properties.filter(p => p.attomStatus === "success").length;
  const pendingCount = properties.filter(p => p.attomStatus === "pending" || p.attomStatus === "rate_limited").length;
  const failedCount = properties.filter(p => p.attomStatus === "failed").length;
  const totalPortfolioValue = properties.reduce((sum, p) => sum + (p.attomAvmValue || p.attomMarketValue || p.estValue || 0), 0);

  const propertyTypes = Array.from(new Set(properties.map(p => p.propertyType).filter(Boolean)));

  const filteredProperties = properties.filter(p => {
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "pending" && (p.attomStatus === "pending" || p.attomStatus === "rate_limited")) ||
      (statusFilter !== "pending" && p.attomStatus === statusFilter);
    const matchesType = typeFilter === "all" || p.propertyType === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-8 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-heading font-bold text-foreground" data-testid="text-dashboard-title">Investor Dashboard</h1>
            <p className="text-muted-foreground">Track your loan applications and property portfolio</p>
        </div>
        <div className="flex gap-3">
            <Link href="/admin">
                <Button variant="outline" className="hidden md:flex" data-testid="button-admin-view">
                   Admin View
                </Button>
            </Link>
            <Button data-testid="button-notifications">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
            </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Applications</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold" data-testid="text-active-applications">{applications.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {applications.filter(a => a.status === "submitted").length} Awaiting Review
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Properties in Portfolio</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold" data-testid="text-property-count">{properties.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {successCount} enriched with ATTOM
                </p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Value</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-primary" data-testid="text-portfolio-value">
                    ${totalPortfolioValue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Combined market value</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Offers Received</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-green-600" data-testid="text-offers-count">
                     {applications.filter(a => a.status === "approved").length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Ready for acceptance</p>
            </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="properties" className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="properties" data-testid="tab-properties">
            <Home className="w-4 h-4 mr-2" />
            Portfolio ({properties.length})
          </TabsTrigger>
          <TabsTrigger value="listings" data-testid="tab-listings">
            <Tag className="w-4 h-4 mr-2" />
            My Listings ({myListings.length})
          </TabsTrigger>
          <TabsTrigger value="watchlist" data-testid="tab-watchlist">
            <Heart className="w-4 h-4 mr-2" />
            Watchlist ({watchlist.length})
          </TabsTrigger>
          <TabsTrigger value="offers" data-testid="tab-offers">
            <DollarSign className="w-4 h-4 mr-2" />
            My Offers ({myOffers.length})
          </TabsTrigger>
          <TabsTrigger value="applications" data-testid="tab-applications">
            <Building2 className="w-4 h-4 mr-2" />
            Loans ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="space-y-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-heading font-semibold">My Properties</h2>
              <p className="text-sm text-muted-foreground">
                {successCount} enriched, {pendingCount} pending, {failedCount} failed
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm bg-background"
                  data-testid="select-status-filter"
                >
                  <option value="all">All ({properties.length})</option>
                  <option value="success">Enriched ({successCount})</option>
                  <option value="pending">Pending ({pendingCount})</option>
                  <option value="failed">Failed ({failedCount})</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Type:</span>
                <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm bg-background"
                  data-testid="select-type-filter"
                >
                  <option value="all">All Types</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type || ""}>{type}</option>
                  ))}
                </select>
              </div>
              <Link href="/compare">
                <Button variant="outline" data-testid="button-compare">
                  <Scale className="w-4 h-4 mr-2" />
                  Compare
                </Button>
              </Link>
              <Button 
                onClick={() => enrichAllProperties(false)} 
                disabled={enriching || pendingCount === 0}
                data-testid="button-enrich-all"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${enriching ? 'animate-spin' : ''}`} />
                {enriching ? "Enriching..." : `Enrich Pending (${pendingCount})`}
              </Button>
              <Button 
                variant="outline"
                onClick={() => enrichAllProperties(true)} 
                disabled={enriching || properties.length === 0}
                data-testid="button-refresh-all"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${enriching ? 'animate-spin' : ''}`} />
                {enriching ? "Refreshing..." : "Refresh All Data"}
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {propertiesLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading properties...</p>
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Home className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No properties in portfolio</p>
                  <p className="text-sm mb-4">Import properties from Excel to get started.</p>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-lg font-medium">No properties match filters</p>
                  <p className="text-sm mb-4">Try adjusting your filter criteria.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr className="text-left text-sm text-muted-foreground">
                        <th className="p-4 font-medium w-[280px]">Property</th>
                        <th className="p-4 font-medium w-[80px]">Type</th>
                        <th className="p-4 font-medium">Size</th>
                        <th className="p-4 font-medium">Beds/Baths</th>
                        <th className="p-4 font-medium">Est Value</th>
                        <th className="p-4 font-medium">Investee Value</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProperties.map((property) => (
                        <tr 
                          key={property.id} 
                          className="border-t hover:bg-muted/30 transition-colors"
                          data-testid={`row-property-${property.id}`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-lg text-primary">
                                <Home className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{property.address}</p>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {property.city}, {property.state}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">{property.propertyType || "-"}</span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">
                              {property.attomBldgSize || property.sqFt 
                                ? `${(property.attomBldgSize || property.sqFt)?.toLocaleString()} sqft`
                                : "-"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm">
                              {property.attomBeds || property.beds || 0} / {property.attomBaths || property.baths || 0}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-medium">
                              ${property.estValue?.toLocaleString() || "-"}
                            </span>
                          </td>
                          <td className="p-4">
                            {property.attomAvmValue ? (
                              <div>
                                <span className="text-sm font-medium text-primary">
                                  ${property.attomAvmValue.toLocaleString()}
                                </span>
                                {property.attomAvmConfidence && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({property.attomAvmConfidence}%)
                                  </span>
                                )}
                              </div>
                            ) : property.attomMarketValue ? (
                              <span className="text-sm font-medium text-primary">
                                ${property.attomMarketValue.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getAttomStatusIcon(property.attomStatus)}
                              {getAttomStatusBadge(property.attomStatus)}
                            </div>
                            {property.attomError && (
                              <p className="text-xs text-red-500 mt-1">{property.attomError}</p>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/property/${property.id}`}>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  data-testid={`button-view-${property.id}`}
                                >
                                  View
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedPropertyForListing(property);
                                  setListingPrice(String(property.attomAvmValue || property.attomMarketValue || property.estValue || ""));
                                  setListingDialogOpen(true);
                                }}
                                data-testid={`button-list-${property.id}`}
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                List
                              </Button>
                              {(property.attomStatus === "pending" || property.attomStatus === "failed" || property.attomStatus === "rate_limited") && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => enrichSingleProperty(property.id)}
                                  data-testid={`button-enrich-${property.id}`}
                                >
                                  <RefreshCw className="w-3 h-3 mr-1" />
                                  Retry
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listings" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-semibold">My Listings</h2>
              <p className="text-sm text-muted-foreground">Properties you've listed for sale</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {myListings.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Tag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No active listings</p>
                  <p className="text-sm mb-4">List a property from your portfolio to start receiving offers.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {myListings.map((listing) => (
                    <div key={listing.id} className="p-4 hover:bg-muted/30 transition-colors" data-testid={`row-listing-${listing.id}`}>
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <Home className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{listing.property?.address || "Property"}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {listing.property?.city}, {listing.property?.state}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">
                              ${listing.listPrice?.toLocaleString() || "0"}
                            </p>
                            <Badge className={listing.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                              {listing.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {listing.offers && listing.offers.length > 0 && (
                              <Badge className="bg-blue-100 text-blue-700">
                                {listing.offers.length} offer{listing.offers.length > 1 ? "s" : ""}
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeListing(listing.id)}
                              data-testid={`button-remove-listing-${listing.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {listing.offers && listing.offers.length > 0 && (
                        <div className="mt-4 pl-12 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">Offers Received:</p>
                          {listing.offers.map((offer: Offer) => (
                            <div key={offer.id} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                              <div>
                                <p className="font-medium">${offer.offerAmount.toLocaleString()}</p>
                                {offer.message && <p className="text-xs text-muted-foreground">{offer.message}</p>}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  offer.status === "accepted" ? "bg-green-100 text-green-700" :
                                  offer.status === "rejected" ? "bg-red-100 text-red-700" :
                                  "bg-yellow-100 text-yellow-700"
                                }>
                                  {offer.status}
                                </Badge>
                                {offer.status === "submitted" && (
                                  <>
                                    <Button size="sm" onClick={() => updateOfferStatus(offer.id, "accepted")}>Accept</Button>
                                    <Button size="sm" variant="outline" onClick={() => updateOfferStatus(offer.id, "rejected")}>Reject</Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="watchlist" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-semibold">My Watchlist</h2>
              <p className="text-sm text-muted-foreground">Properties you're interested in</p>
            </div>
            <Link href="/marketplace">
              <Button data-testid="button-browse-marketplace">Browse Marketplace</Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              {watchlist.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Your watchlist is empty</p>
                  <p className="text-sm mb-4">Browse the marketplace to find properties you're interested in.</p>
                  <Link href="/marketplace">
                    <Button variant="outline">Browse Marketplace</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {watchlist.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-muted/30 transition-colors" data-testid={`row-watchlist-${item.id}`}>
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-50 p-2 rounded-lg text-red-500">
                            <Heart className="w-5 h-5 fill-current" />
                          </div>
                          <div>
                            <p className="font-medium">{item.property?.address || "Property"}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.property?.city}, {item.property?.state}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-bold text-lg text-primary">
                              ${item.listing?.listPrice?.toLocaleString() || "0"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link href={`/marketplace/${item.listingId}`}>
                              <Button variant="outline" size="sm" data-testid={`button-view-listing-${item.listingId}`}>
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromWatchlist(item.listingId)}
                              data-testid={`button-unwatch-${item.listingId}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-semibold">My Offers</h2>
              <p className="text-sm text-muted-foreground">Offers you've made on properties</p>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {myOffers.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No offers made</p>
                  <p className="text-sm mb-4">Browse the marketplace and make offers on properties you're interested in.</p>
                  <Link href="/marketplace">
                    <Button variant="outline">Browse Marketplace</Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {myOffers.map((offer) => (
                    <div key={offer.id} className="p-4 hover:bg-muted/30 transition-colors" data-testid={`row-offer-${offer.id}`}>
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-50 p-2 rounded-lg text-green-600">
                            <DollarSign className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-medium">{offer.property?.address || "Property"}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {offer.property?.city}, {offer.property?.state}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Offered on {new Date(offer.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Your Offer</p>
                            <p className="font-bold text-lg text-primary">
                              ${offer.offerAmount.toLocaleString()}
                            </p>
                          </div>
                          <Badge className={
                            offer.status === "accepted" ? "bg-green-100 text-green-700" :
                            offer.status === "rejected" ? "bg-red-100 text-red-700" :
                            offer.status === "counter" ? "bg-purple-100 text-purple-700" :
                            "bg-yellow-100 text-yellow-700"
                          }>
                            {offer.status}
                          </Badge>
                          {offer.status === "submitted" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateOfferStatus(offer.id, "withdrawn")}
                              data-testid={`button-withdraw-${offer.id}`}
                            >
                              Withdraw
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold">My Applications</h2>
            <Link href="/calculator">
              <Button data-testid="button-new-application">Start New Application</Button>
            </Link>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">No active applications</p>
                  <p className="text-sm mb-4">Start a new loan request to get matched with lenders.</p>
                  <Link href="/calculator">
                    <Button variant="outline">Request Loan Offers</Button>
                  </Link>
                </div>
              ) : (
                applications.map((app) => (
                  <div 
                    key={app.id} 
                    className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 border-b last:border-0 hover:bg-muted/5 transition-colors gap-4"
                    data-testid={`row-application-${app.id}`}
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
                          <Badge className={getStatusColor(app.status)} variant="secondary">
                            {app.status.toUpperCase().replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {app.propertyType} • Requested: ${app.loanAmount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Submitted on {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link href={`/loan/${app.id}`}>
                      <Button variant="outline" className="w-full md:w-auto group" data-testid={`button-view-${app.id}`}>
                        View Status
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={listingDialogOpen} onOpenChange={setListingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>List Property for Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedPropertyForListing && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium">{selectedPropertyForListing.address}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPropertyForListing.city}, {selectedPropertyForListing.state}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="listPrice">Asking Price ($)</Label>
              <Input
                id="listPrice"
                type="number"
                placeholder="Enter asking price"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                data-testid="input-list-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Describe the property..."
                value={listingDescription}
                onChange={(e) => setListingDescription(e.target.value)}
                data-testid="input-list-description"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setListingDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createListing} disabled={!listingPrice} data-testid="button-create-listing">
                List Property
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

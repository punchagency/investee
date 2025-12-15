import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Home, MapPin, Ruler, Bed, Bath, DollarSign, Calendar, Building2, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";

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
  ownerOccupied: string | null;
  listedForSale: string | null;
  foreclosure: string | null;
  attomStatus: string | null;
  attomMarketValue: number | null;
  attomAssessedValue: number | null;
  attomYearBuilt: number | null;
  attomBldgSize: number | null;
  attomBeds: number | null;
  attomBaths: number | null;
  attomPropClass: string | null;
  attomError: string | null;
}

export default function PropertyProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [enriching, setEnriching] = useState(false);

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  async function fetchProperty() {
    try {
      const response = await fetch(`/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  }

  async function enrichProperty() {
    if (!id) return;
    setEnriching(true);
    try {
      await fetch(`/api/properties/${id}/enrich`, { method: "POST" });
      setTimeout(() => {
        fetchProperty();
        setEnriching(false);
      }, 2000);
    } catch (error) {
      console.error("Error enriching property:", error);
      setEnriching(false);
    }
  }

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "success": return <Badge className="bg-green-100 text-green-700"><CheckCircle className="w-3 h-3 mr-1" /> Enriched</Badge>;
      case "failed": return <Badge className="bg-red-100 text-red-700"><XCircle className="w-3 h-3 mr-1" /> Failed</Badge>;
      case "rate_limited": return <Badge className="bg-yellow-100 text-yellow-700"><Clock className="w-3 h-3 mr-1" /> Rate Limited</Badge>;
      default: return <Badge className="bg-gray-100 text-gray-700"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="container max-w-screen-xl px-4 md:px-8 py-8 min-h-screen">
        <div className="text-center py-12 text-muted-foreground">Loading property...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="container max-w-screen-xl px-4 md:px-8 py-8 min-h-screen">
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-4">Property not found</p>
          <Link href="/dashboard">
            <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const displayValue = property.attomMarketValue || property.estValue;
  const displaySize = property.attomBldgSize || property.sqFt;
  const displayBeds = property.attomBeds || property.beds;
  const displayBaths = property.attomBaths || property.baths;

  return (
    <div className="container max-w-screen-xl px-4 md:px-8 py-8 min-h-screen">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground" data-testid="text-property-address">
              {property.address}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {property.city}, {property.state}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(property.attomStatus)}
            {property.attomStatus !== "success" && (
              <Button onClick={enrichProperty} disabled={enriching} data-testid="button-enrich">
                <RefreshCw className={`w-4 h-4 mr-2 ${enriching ? 'animate-spin' : ''}`} />
                {enriching ? "Enriching..." : "Enrich with ATTOM"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" /> Market Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="text-market-value">
              {displayValue ? `$${displayValue.toLocaleString()}` : "—"}
            </div>
            {property.attomMarketValue && property.estValue && property.attomMarketValue !== property.estValue && (
              <p className="text-xs text-muted-foreground mt-1">
                Original estimate: ${property.estValue.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Ruler className="w-4 h-4" /> Property Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-size">
              {displaySize ? `${displaySize.toLocaleString()} sqft` : "—"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Year Built
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-year-built">
              {property.attomYearBuilt || "—"}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" /> Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Property Type</p>
                <p className="font-medium" data-testid="text-property-type">{property.propertyType || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ATTOM Class</p>
                <p className="font-medium">{property.attomPropClass || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Bed className="w-3 h-3" /> Bedrooms</p>
                <p className="font-medium" data-testid="text-beds">{displayBeds || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1"><Bath className="w-3 h-3" /> Bathrooms</p>
                <p className="font-medium" data-testid="text-baths">{displayBaths || "—"}</p>
              </div>
            </div>
            {property.attomAssessedValue && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Assessed Value</p>
                <p className="font-medium text-lg">${property.attomAssessedValue.toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" /> Ownership Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Owner</p>
                <p className="font-medium" data-testid="text-owner">{property.owner || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Owner Occupied</p>
                <p className="font-medium">{property.ownerOccupied || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Listed for Sale</p>
                <p className="font-medium">{property.listedForSale || "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Foreclosure</p>
                <p className="font-medium">{property.foreclosure || "—"}</p>
              </div>
            </div>
            {property.estEquity && (
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">Estimated Equity</p>
                <p className="font-medium text-lg text-green-600">${property.estEquity.toLocaleString()}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {property.attomError && (
        <Card className="mt-6 border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-sm text-red-700">
              <strong>ATTOM Error:</strong> {property.attomError}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

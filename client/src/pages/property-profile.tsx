import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Home, MapPin, Ruler, Bed, Bath, DollarSign, Calendar, Building2, RefreshCw, CheckCircle, XCircle, Clock, Save, Search, Map } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

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
  attomAvmValue: number | null;
  attomAvmHigh: number | null;
  attomAvmLow: number | null;
  attomAvmConfidence: number | null;
  attomTaxAmount: number | null;
  attomTaxYear: number | null;
  annualTaxes: number | null;
  annualInsurance: number | null;
  monthlyHoa: number | null;
}

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

function PropertyMap({ address, city, state }: { address: string; city: string | null; state: string | null }) {
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [mapsApiKey, setMapsApiKey] = useState<string>("");
  const [keyLoaded, setKeyLoaded] = useState(false);

  useEffect(() => {
    async function fetchKey() {
      try {
        const response = await fetch("/api/config/maps");
        if (response.ok) {
          const data = await response.json();
          setMapsApiKey(data.apiKey);
          setKeyLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching maps API key:", error);
      }
    }
    fetchKey();
  }, []);

  if (!keyLoaded || !mapsApiKey) {
    return (
      <div className="h-[300px] bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return <PropertyMapInner address={address} city={city} state={state} apiKey={mapsApiKey} coordinates={coordinates} setCoordinates={setCoordinates} />;
}

function PropertyMapInner({ 
  address, city, state, apiKey, coordinates, setCoordinates 
}: { 
  address: string; 
  city: string | null; 
  state: string | null; 
  apiKey: string;
  coordinates: { lat: number; lng: number } | null;
  setCoordinates: (coords: { lat: number; lng: number } | null) => void;
}) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
  });

  useEffect(() => {
    if (isLoaded && window.google) {
      const geocoder = new window.google.maps.Geocoder();
      const fullAddress = `${address}, ${city}, ${state}`;
      geocoder.geocode({ address: fullAddress }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const location = results[0].geometry.location;
          setCoordinates({ lat: location.lat(), lng: location.lng() });
        }
      });
    }
  }, [isLoaded, address, city, state]);

  if (!isLoaded) {
    return (
      <div className="h-[300px] bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  if (!coordinates) {
    return (
      <div className="h-[300px] bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">Locating property...</p>
      </div>
    );
  }

  return (
    <GoogleMap mapContainerStyle={mapContainerStyle} center={coordinates} zoom={16}>
      <Marker position={coordinates} />
    </GoogleMap>
  );
}

export default function PropertyProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [editedProperty, setEditedProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (id) fetchProperty();
  }, [id]);

  useEffect(() => {
    if (property && editedProperty) {
      setHasChanges(JSON.stringify(property) !== JSON.stringify(editedProperty));
    }
  }, [property, editedProperty]);

  async function fetchProperty() {
    try {
      const response = await fetch(`/api/properties/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProperty(data);
        setEditedProperty(data);
      }
    } catch (error) {
      console.error("Error fetching property:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveProperty() {
    if (!id || !editedProperty) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedProperty),
      });
      if (response.ok) {
        const updated = await response.json();
        setProperty(updated);
        setEditedProperty(updated);
        setHasChanges(false);
      }
    } catch (error) {
      console.error("Error saving property:", error);
    } finally {
      setSaving(false);
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

  function updateField(field: keyof Property, value: string | number | null) {
    if (!editedProperty) return;
    setEditedProperty({ ...editedProperty, [field]: value });
  }

  function handleSearch() {
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery + " property")}`, "_blank");
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

  if (!property || !editedProperty) {
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

  return (
    <div className="container max-w-screen-xl px-4 md:px-8 py-8 min-h-screen">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground" data-testid="text-property-address">
              {editedProperty.address}
            </h1>
            <p className="text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {editedProperty.city}, {editedProperty.state}
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <Input
                placeholder="Search this address online..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="max-w-sm"
                data-testid="input-search"
              />
              <Button variant="outline" onClick={handleSearch} data-testid="button-search">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(property.attomStatus)}
            {hasChanges && (
              <Button onClick={saveProperty} disabled={saving} data-testid="button-save">
                <Save className={`w-4 h-4 mr-2 ${saving ? 'animate-pulse' : ''}`} />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            )}
            {property.attomStatus !== "success" && (
              <Button variant="outline" onClick={enrichProperty} disabled={enriching} data-testid="button-enrich">
                <RefreshCw className={`w-4 h-4 mr-2 ${enriching ? 'animate-spin' : ''}`} />
                {enriching ? "Enriching..." : "Enrich"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" /> Property Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyMap address={editedProperty.address} city={editedProperty.city} state={editedProperty.state} />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5" /> Property Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Address</Label>
                <Input
                  value={editedProperty.address || ""}
                  onChange={(e) => updateField("address", e.target.value)}
                  data-testid="input-address"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">City</Label>
                <Input
                  value={editedProperty.city || ""}
                  onChange={(e) => updateField("city", e.target.value)}
                  data-testid="input-city"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">State</Label>
                <Input
                  value={editedProperty.state || ""}
                  onChange={(e) => updateField("state", e.target.value)}
                  data-testid="input-state"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Property Type</Label>
                <Input
                  value={editedProperty.propertyType || ""}
                  onChange={(e) => updateField("propertyType", e.target.value)}
                  data-testid="input-property-type"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1"><Ruler className="w-3 h-3" /> Sq Ft</Label>
                <Input
                  type="number"
                  value={editedProperty.sqFt || ""}
                  onChange={(e) => updateField("sqFt", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-sqft"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1"><Bed className="w-3 h-3" /> Bedrooms</Label>
                <Input
                  type="number"
                  value={editedProperty.beds || ""}
                  onChange={(e) => updateField("beds", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-beds"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1"><Bath className="w-3 h-3" /> Bathrooms</Label>
                <Input
                  type="number"
                  value={editedProperty.baths || ""}
                  onChange={(e) => updateField("baths", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-baths"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" /> Year Built</Label>
                <Input
                  type="number"
                  value={editedProperty.attomYearBuilt || ""}
                  onChange={(e) => updateField("attomYearBuilt", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-year-built"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> Valuation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {editedProperty.attomAvmValue && (
              <div className="bg-gradient-to-r from-[#1C49A6]/10 to-[#99C054]/10 rounded-lg p-4 border border-[#1C49A6]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1C49A6]">Investee Estimated Property Value</span>
                  {editedProperty.attomAvmConfidence && (
                    <Badge variant="outline" className="bg-white">
                      {editedProperty.attomAvmConfidence}% Confidence
                    </Badge>
                  )}
                </div>
                <div className="text-3xl font-bold text-[#1C49A6]">
                  ${editedProperty.attomAvmValue.toLocaleString()}
                </div>
                {(editedProperty.attomAvmLow || editedProperty.attomAvmHigh) && (
                  <div className="text-sm text-muted-foreground mt-1">
                    Range: ${editedProperty.attomAvmLow?.toLocaleString() || "N/A"} - ${editedProperty.attomAvmHigh?.toLocaleString() || "N/A"}
                  </div>
                )}
              </div>
            )}

            {editedProperty.attomTaxAmount && (
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-amber-700">Investee Estimated Annual Taxes</span>
                    <div className="text-2xl font-bold text-amber-800">
                      ${editedProperty.attomTaxAmount.toLocaleString()}
                    </div>
                  </div>
                  {editedProperty.attomTaxYear && (
                    <Badge variant="outline" className="bg-white text-amber-700 border-amber-300">
                      Tax Year {editedProperty.attomTaxYear}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Your Est. Value ($)</Label>
                <Input
                  type="number"
                  value={editedProperty.estValue || ""}
                  onChange={(e) => updateField("estValue", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-est-value"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Estimated Equity ($)</Label>
                <Input
                  type="number"
                  value={editedProperty.estEquity || ""}
                  onChange={(e) => updateField("estEquity", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-est-equity"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Investee Market Value ($)</Label>
                <Input
                  type="number"
                  value={editedProperty.attomMarketValue || ""}
                  onChange={(e) => updateField("attomMarketValue", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-market-value"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Investee Assessed Value ($)</Label>
                <Input
                  type="number"
                  value={editedProperty.attomAssessedValue || ""}
                  onChange={(e) => updateField("attomAssessedValue", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-assessed-value"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Annual Taxes (Override) ($)</Label>
                <Input
                  type="number"
                  value={editedProperty.annualTaxes || ""}
                  onChange={(e) => updateField("annualTaxes", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-annual-taxes"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Annual Insurance ($)</Label>
                <Input
                  type="number"
                  value={editedProperty.annualInsurance || ""}
                  onChange={(e) => updateField("annualInsurance", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-annual-insurance"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Monthly HOA ($)</Label>
                <Input
                  type="number"
                  value={editedProperty.monthlyHoa || ""}
                  onChange={(e) => updateField("monthlyHoa", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-monthly-hoa"
                />
              </div>
            </div>
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
              <div className="col-span-2">
                <Label className="text-sm text-muted-foreground">Owner</Label>
                <Input
                  value={editedProperty.owner || ""}
                  onChange={(e) => updateField("owner", e.target.value)}
                  data-testid="input-owner"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Owner Occupied</Label>
                <select
                  value={editedProperty.ownerOccupied || ""}
                  onChange={(e) => updateField("ownerOccupied", e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  data-testid="select-owner-occupied"
                >
                  <option value="">—</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Listed for Sale</Label>
                <select
                  value={editedProperty.listedForSale || ""}
                  onChange={(e) => updateField("listedForSale", e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  data-testid="select-listed-for-sale"
                >
                  <option value="">—</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Foreclosure</Label>
                <select
                  value={editedProperty.foreclosure || ""}
                  onChange={(e) => updateField("foreclosure", e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-background"
                  data-testid="select-foreclosure"
                >
                  <option value="">—</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" /> ATTOM Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">ATTOM Building Size</Label>
                <Input
                  type="number"
                  value={editedProperty.attomBldgSize || ""}
                  onChange={(e) => updateField("attomBldgSize", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-attom-size"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">ATTOM Property Class</Label>
                <Input
                  value={editedProperty.attomPropClass || ""}
                  onChange={(e) => updateField("attomPropClass", e.target.value)}
                  data-testid="input-attom-class"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">ATTOM Beds</Label>
                <Input
                  type="number"
                  value={editedProperty.attomBeds || ""}
                  onChange={(e) => updateField("attomBeds", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-attom-beds"
                />
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">ATTOM Baths</Label>
                <Input
                  type="number"
                  value={editedProperty.attomBaths || ""}
                  onChange={(e) => updateField("attomBaths", e.target.value ? Number(e.target.value) : null)}
                  data-testid="input-attom-baths"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {property.attomError && (
        <Card className="border-red-200 bg-red-50">
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

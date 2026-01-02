import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Bell,
  Plus,
  Pencil,
  Trash2,
  DollarSign,
  Home,
  MapPin,
  Bed,
  Bath,
  Ruler,
} from "lucide-react";
import {
  getAllAlerts,
  createAlert,
  updateAlert,
  deleteAlert,
} from "@/services/AlertServices";

interface PropertyAlert {
  id: string;
  userId: string;
  name: string;
  isActive: string;
  minPrice: number | null;
  maxPrice: number | null;
  minBeds: number | null;
  maxBeds: number | null;
  minBaths: number | null;
  maxBaths: number | null;
  minSqFt: number | null;
  maxSqFt: number | null;
  propertyTypes: string[] | null;
  cities: string[] | null;
  states: string[] | null;
  postalCodes: string[] | null;
  keywords: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AlertFormData {
  name: string;
  isActive: string;
  minPrice: string;
  maxPrice: string;
  minBeds: string;
  maxBeds: string;
  minBaths: string;
  maxBaths: string;
  minSqFt: string;
  maxSqFt: string;
  propertyTypes: string[];
  cities: string;
  states: string;
  postalCodes: string;
  keywords: string;
}

const PROPERTY_TYPES = [
  "Single Family",
  "Multi Family",
  "Condo",
  "Townhouse",
  "Commercial",
  "Land",
  "Other",
];

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

const defaultFormData: AlertFormData = {
  name: "",
  isActive: "true",
  minPrice: "",
  maxPrice: "",
  minBeds: "",
  maxBeds: "",
  minBaths: "",
  maxBaths: "",
  minSqFt: "",
  maxSqFt: "",
  propertyTypes: [],
  cities: "",
  states: "",
  postalCodes: "",
  keywords: "",
};

export default function AlertsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<PropertyAlert | null>(null);
  const [formData, setFormData] = useState<AlertFormData>(defaultFormData);

  const { data: alerts = [], isLoading } = useQuery<PropertyAlert[]>({
    queryKey: ["alerts"],
    queryFn: async () => {
      const response = await getAllAlerts();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: AlertFormData) => {
      const payload = {
        name: data.name,
        isActive: data.isActive,
        minPrice: data.minPrice ? parseInt(data.minPrice) : null,
        maxPrice: data.maxPrice ? parseInt(data.maxPrice) : null,
        minBeds: data.minBeds ? parseInt(data.minBeds) : null,
        maxBeds: data.maxBeds ? parseInt(data.maxBeds) : null,
        minBaths: data.minBaths ? parseFloat(data.minBaths) : null,
        maxBaths: data.maxBaths ? parseFloat(data.maxBaths) : null,
        minSqFt: data.minSqFt ? parseInt(data.minSqFt) : null,
        maxSqFt: data.maxSqFt ? parseInt(data.maxSqFt) : null,
        propertyTypes:
          data.propertyTypes.length > 0 ? data.propertyTypes : null,
        cities: data.cities
          ? data.cities
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : null,
        states: data.states
          ? data.states
              .split(",")
              .map((s) => s.trim().toUpperCase())
              .filter(Boolean)
          : null,
        postalCodes: data.postalCodes
          ? data.postalCodes
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean)
          : null,
        keywords: data.keywords || null,
      };
      return createAlert(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({ title: "Alert created successfully" });
      setIsCreateOpen(false);
      setFormData(defaultFormData);
    },
    onError: () => {
      toast({ title: "Failed to create alert", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<AlertFormData>;
    }) => {
      const payload: any = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.isActive !== undefined) payload.isActive = data.isActive;
      if (data.minPrice !== undefined)
        payload.minPrice = data.minPrice ? parseInt(data.minPrice) : null;
      if (data.maxPrice !== undefined)
        payload.maxPrice = data.maxPrice ? parseInt(data.maxPrice) : null;
      if (data.minBeds !== undefined)
        payload.minBeds = data.minBeds ? parseInt(data.minBeds) : null;
      if (data.maxBeds !== undefined)
        payload.maxBeds = data.maxBeds ? parseInt(data.maxBeds) : null;
      if (data.minBaths !== undefined)
        payload.minBaths = data.minBaths ? parseFloat(data.minBaths) : null;
      if (data.maxBaths !== undefined)
        payload.maxBaths = data.maxBaths ? parseFloat(data.maxBaths) : null;
      if (data.minSqFt !== undefined)
        payload.minSqFt = data.minSqFt ? parseInt(data.minSqFt) : null;
      if (data.maxSqFt !== undefined)
        payload.maxSqFt = data.maxSqFt ? parseInt(data.maxSqFt) : null;
      if (data.propertyTypes !== undefined)
        payload.propertyTypes =
          data.propertyTypes.length > 0 ? data.propertyTypes : null;
      if (data.cities !== undefined)
        payload.cities = data.cities
          ? data.cities
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : null;
      if (data.states !== undefined)
        payload.states = data.states
          ? data.states
              .split(",")
              .map((s) => s.trim().toUpperCase())
              .filter(Boolean)
          : null;
      if (data.postalCodes !== undefined)
        payload.postalCodes = data.postalCodes
          ? data.postalCodes
              .split(",")
              .map((p) => p.trim())
              .filter(Boolean)
          : null;
      if (data.keywords !== undefined) payload.keywords = data.keywords || null;
      return updateAlert(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({ title: "Alert updated successfully" });
      setEditingAlert(null);
      setFormData(defaultFormData);
    },
    onError: () => {
      toast({ title: "Failed to update alert", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return deleteAlert(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
      toast({ title: "Alert deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete alert", variant: "destructive" });
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return updateAlert(id, { isActive: isActive ? "true" : "false" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const openEditDialog = (alert: PropertyAlert) => {
    setEditingAlert(alert);
    setFormData({
      name: alert.name,
      isActive: alert.isActive,
      minPrice: alert.minPrice?.toString() || "",
      maxPrice: alert.maxPrice?.toString() || "",
      minBeds: alert.minBeds?.toString() || "",
      maxBeds: alert.maxBeds?.toString() || "",
      minBaths: alert.minBaths?.toString() || "",
      maxBaths: alert.maxBaths?.toString() || "",
      minSqFt: alert.minSqFt?.toString() || "",
      maxSqFt: alert.maxSqFt?.toString() || "",
      propertyTypes: alert.propertyTypes || [],
      cities: alert.cities?.join(", ") || "",
      states: alert.states?.join(", ") || "",
      postalCodes: alert.postalCodes?.join(", ") || "",
      keywords: alert.keywords || "",
    });
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast({ title: "Please enter an alert name", variant: "destructive" });
      return;
    }
    if (editingAlert) {
      updateMutation.mutate({ id: editingAlert.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const togglePropertyType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      propertyTypes: prev.propertyTypes.includes(type)
        ? prev.propertyTypes.filter((t) => t !== type)
        : [...prev.propertyTypes, type],
    }));
  };

  const formatCriteria = (alert: PropertyAlert): string[] => {
    const criteria: string[] = [];
    if (alert.minPrice || alert.maxPrice) {
      const min = alert.minPrice
        ? `$${alert.minPrice.toLocaleString()}`
        : "Any";
      const max = alert.maxPrice
        ? `$${alert.maxPrice.toLocaleString()}`
        : "Any";
      criteria.push(`Price: ${min} - ${max}`);
    }
    if (alert.minBeds || alert.maxBeds) {
      const min = alert.minBeds || "Any";
      const max = alert.maxBeds || "Any";
      criteria.push(`Beds: ${min} - ${max}`);
    }
    if (alert.minBaths || alert.maxBaths) {
      const min = alert.minBaths || "Any";
      const max = alert.maxBaths || "Any";
      criteria.push(`Baths: ${min} - ${max}`);
    }
    if (alert.minSqFt || alert.maxSqFt) {
      const min = alert.minSqFt ? alert.minSqFt.toLocaleString() : "Any";
      const max = alert.maxSqFt ? alert.maxSqFt.toLocaleString() : "Any";
      criteria.push(`Sq Ft: ${min} - ${max}`);
    }
    if (alert.propertyTypes && alert.propertyTypes.length > 0) {
      criteria.push(`Types: ${alert.propertyTypes.join(", ")}`);
    }
    if (alert.cities && alert.cities.length > 0) {
      criteria.push(`Cities: ${alert.cities.join(", ")}`);
    }
    if (alert.states && alert.states.length > 0) {
      criteria.push(`States: ${alert.states.join(", ")}`);
    }
    if (alert.keywords) {
      criteria.push(`Keywords: ${alert.keywords}`);
    }
    return criteria;
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8 text-[#1C49A6]" />
            Property Alerts
          </h1>
          <p className="text-muted-foreground mt-1">
            Get notified when properties matching your criteria are listed
          </p>
        </div>
        <Dialog
          open={isCreateOpen}
          onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (!open) setFormData(defaultFormData);
          }}
        >
          <DialogTrigger asChild>
            <Button
              data-testid="button-create-alert"
              className="bg-[#1C49A6] hover:bg-[#153a85]"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Alert</DialogTitle>
            </DialogHeader>
            <AlertForm
              formData={formData}
              setFormData={setFormData}
              togglePropertyType={togglePropertyType}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending}
                data-testid="button-save-alert"
                className="bg-[#1C49A6] hover:bg-[#153a85]"
              >
                {createMutation.isPending ? "Creating..." : "Create Alert"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Loading alerts...
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No alerts yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first alert to get notified about new properties
            </p>
            <Button
              onClick={() => setIsCreateOpen(true)}
              className="bg-[#1C49A6] hover:bg-[#153a85]"
            >
              <Plus className="w-4 h-4 mr-2" /> Create Your First Alert
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id} data-testid={`card-alert-${alert.id}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={alert.isActive === "true"}
                      onCheckedChange={(checked) =>
                        toggleActiveMutation.mutate({
                          id: alert.id,
                          isActive: checked,
                        })
                      }
                      data-testid={`switch-alert-active-${alert.id}`}
                    />
                    <div>
                      <CardTitle className="text-lg">{alert.name}</CardTitle>
                      <CardDescription>
                        Created {new Date(alert.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        alert.isActive === "true" ? "default" : "secondary"
                      }
                    >
                      {alert.isActive === "true" ? "Active" : "Paused"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDialog(alert)}
                      data-testid={`button-edit-alert-${alert.id}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteMutation.mutate(alert.id)}
                      data-testid={`button-delete-alert-${alert.id}`}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {formatCriteria(alert).map((criterion, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm">
                      {criterion}
                    </Badge>
                  ))}
                  {formatCriteria(alert).length === 0 && (
                    <span className="text-sm text-muted-foreground">
                      No specific criteria set - matches all properties
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!editingAlert}
        onOpenChange={(open) => {
          if (!open) {
            setEditingAlert(null);
            setFormData(defaultFormData);
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Alert</DialogTitle>
          </DialogHeader>
          <AlertForm
            formData={formData}
            setFormData={setFormData}
            togglePropertyType={togglePropertyType}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingAlert(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={updateMutation.isPending}
              data-testid="button-update-alert"
              className="bg-[#1C49A6] hover:bg-[#153a85]"
            >
              {updateMutation.isPending ? "Updating..." : "Update Alert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AlertForm({
  formData,
  setFormData,
  togglePropertyType,
}: {
  formData: AlertFormData;
  setFormData: React.Dispatch<React.SetStateAction<AlertFormData>>;
  togglePropertyType: (type: string) => void;
}) {
  return (
    <div className="space-y-6 py-4">
      <div>
        <Label htmlFor="alert-name">Alert Name *</Label>
        <Input
          id="alert-name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder="e.g., Miami Investment Properties"
          data-testid="input-alert-name"
        />
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Price Range
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min-price">Min Price</Label>
            <Input
              id="min-price"
              type="number"
              value={formData.minPrice}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, minPrice: e.target.value }))
              }
              placeholder="Any"
              data-testid="input-min-price"
            />
          </div>
          <div>
            <Label htmlFor="max-price">Max Price</Label>
            <Input
              id="max-price"
              type="number"
              value={formData.maxPrice}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, maxPrice: e.target.value }))
              }
              placeholder="Any"
              data-testid="input-max-price"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Home className="w-4 h-4" /> Property Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="min-beds">Min Beds</Label>
            <Input
              id="min-beds"
              type="number"
              value={formData.minBeds}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, minBeds: e.target.value }))
              }
              placeholder="Any"
              data-testid="input-min-beds"
            />
          </div>
          <div>
            <Label htmlFor="max-beds">Max Beds</Label>
            <Input
              id="max-beds"
              type="number"
              value={formData.maxBeds}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, maxBeds: e.target.value }))
              }
              placeholder="Any"
              data-testid="input-max-beds"
            />
          </div>
          <div>
            <Label htmlFor="min-baths">Min Baths</Label>
            <Input
              id="min-baths"
              type="number"
              step="0.5"
              value={formData.minBaths}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, minBaths: e.target.value }))
              }
              placeholder="Any"
              data-testid="input-min-baths"
            />
          </div>
          <div>
            <Label htmlFor="max-baths">Max Baths</Label>
            <Input
              id="max-baths"
              type="number"
              step="0.5"
              value={formData.maxBaths}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, maxBaths: e.target.value }))
              }
              placeholder="Any"
              data-testid="input-max-baths"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="min-sqft">Min Sq Ft</Label>
            <Input
              id="min-sqft"
              type="number"
              value={formData.minSqFt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, minSqFt: e.target.value }))
              }
              placeholder="Any"
              data-testid="input-min-sqft"
            />
          </div>
          <div>
            <Label htmlFor="max-sqft">Max Sq Ft</Label>
            <Input
              id="max-sqft"
              type="number"
              value={formData.maxSqFt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, maxSqFt: e.target.value }))
              }
              placeholder="Any"
              data-testid="input-max-sqft"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3">Property Types</h3>
        <div className="flex flex-wrap gap-2">
          {PROPERTY_TYPES.map((type) => (
            <Badge
              key={type}
              variant={
                formData.propertyTypes.includes(type) ? "default" : "outline"
              }
              className="cursor-pointer"
              onClick={() => togglePropertyType(type)}
              data-testid={`badge-property-type-${type
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4" /> Location
        </h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="cities">Cities (comma-separated)</Label>
            <Input
              id="cities"
              value={formData.cities}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cities: e.target.value }))
              }
              placeholder="e.g., Miami, Orlando, Tampa"
              data-testid="input-cities"
            />
          </div>
          <div>
            <Label htmlFor="states">
              States (comma-separated, e.g., FL, CA)
            </Label>
            <Input
              id="states"
              value={formData.states}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, states: e.target.value }))
              }
              placeholder="e.g., FL, TX, CA"
              data-testid="input-states"
            />
          </div>
          <div>
            <Label htmlFor="postal-codes">Postal Codes (comma-separated)</Label>
            <Input
              id="postal-codes"
              value={formData.postalCodes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  postalCodes: e.target.value,
                }))
              }
              placeholder="e.g., 33101, 33102"
              data-testid="input-postal-codes"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <Label htmlFor="keywords">Keywords</Label>
        <Input
          id="keywords"
          value={formData.keywords}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, keywords: e.target.value }))
          }
          placeholder="e.g., pool, waterfront, new construction"
          data-testid="input-keywords"
        />
      </div>
    </div>
  );
}

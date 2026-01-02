import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  ArrowRight,
  TrendingUp,
  Home,
  Hammer,
  Bed,
  Bath,
  Ruler,
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { getStreetViewImageUrl } from "@/services/PropertyServices";

import fallbackImg from "@/assets/stock_images/rental_property_apar_495de18b.jpg";

interface PropertyCardProps {
  property: any;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const [imgError, setImgError] = useState(false);

  const fullAddress =
    property.city && property.state
      ? `${property.address}, ${property.city}, ${property.state}`
      : property.address;

  const streetViewUrl = getStreetViewImageUrl(fullAddress, "400x300");

  const displayPrice =
    property.purchasePrice ||
    property.attomAvmValue ||
    property.rentcastValueEstimate ||
    property.estValue ||
    0;
  const displayRent =
    property.estRent ||
    property.rentcastRentEstimate ||
    property.estimatedMonthlyRent;
  const displayARV = property.estARV || property.afterRepairValue;
  const displayTaxes =
    property.taxes || property.annualTaxes || property.attomTaxAmount;
  const displayBeds = property.bedrooms || property.beds || property.attomBeds;
  const displayBaths =
    property.bathrooms || property.baths || property.attomBaths;
  const displaySqFt =
    property.squareFeet || property.sqFt || property.attomBldgSize;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card group h-full flex flex-col">
        <div className="relative h-48 bg-muted overflow-hidden">
          <img
            src={imgError ? fallbackImg : streetViewUrl}
            alt={property.address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              variant="default"
              className="font-medium backdrop-blur-md bg-background/80 text-foreground border-none"
            >
              {property.investmentType ||
                property.propertyType ||
                property.attomPropClass ||
                "Property"}
            </Badge>
            {property.rehabType && (
              <Badge
                variant="outline"
                className="bg-black/40 text-white border-white/20 backdrop-blur-sm"
              >
                <Hammer className="w-3 h-3 mr-1" />
                {property.rehabType}
              </Badge>
            )}
          </div>

          <div className="absolute bottom-4 left-4 text-white">
            <p className="font-heading font-semibold text-lg tracking-tight leading-none mb-1">
              {displayPrice > 0
                ? `$${displayPrice.toLocaleString()}`
                : "Price TBD"}
            </p>
            <div className="flex items-center text-xs text-white/80">
              <MapPin className="w-3 h-3 mr-1" />
              {property.city ? `${property.city}, ` : ""}
              {property.state}
            </div>
          </div>
        </div>

        <CardContent className="p-5 flex-1">
          <h3 className="font-heading font-medium text-lg leading-tight mb-4 line-clamp-2 h-12">
            {property.address}
          </h3>

          <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">
                Est. Rent
              </span>
              <span className="font-medium">
                {displayRent ? `$${displayRent.toLocaleString()}` : "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">
                Est. ARV
              </span>
              <span className="font-medium">
                {displayARV ? `$${displayARV.toLocaleString()}` : "N/A"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">
                Rehab
              </span>
              <span className="font-medium">
                {property.rehab && property.rehab > 0
                  ? `$${property.rehab.toLocaleString()}`
                  : "Turnkey"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">
                Taxes/yr
              </span>
              <span className="font-medium">
                {displayTaxes ? `$${displayTaxes.toLocaleString()}` : "N/A"}
              </span>
            </div>
          </div>
          {(displayBeds || displayBaths || displaySqFt) && (
            <div className="flex gap-3 mt-3 text-xs text-muted-foreground">
              {displayBeds && (
                <span className="flex items-center gap-1">
                  <Bed className="w-3 h-3" /> {displayBeds} beds
                </span>
              )}
              {displayBaths && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3 h-3" /> {displayBaths} baths
                </span>
              )}
              {displaySqFt && (
                <span className="flex items-center gap-1">
                  <Ruler className="w-3 h-3" /> {displaySqFt.toLocaleString()}{" "}
                  sqft
                </span>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Link href={`/property/${property.id}`}>
            <Button
              className="w-full group-hover:bg-primary/90 transition-colors"
              variant="outline"
            >
              View Property
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

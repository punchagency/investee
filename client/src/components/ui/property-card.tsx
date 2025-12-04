import { Property } from "@/lib/mockApi";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, TrendingUp, Home, Hammer } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300 bg-card group h-full flex flex-col">
        <div className="relative h-48 bg-muted overflow-hidden">
            {/* Placeholder for property image - in a real app this would be dynamic */}
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-muted-foreground/30">
               <Home className="w-16 h-16 opacity-20" />
            </div>
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge variant={property.investmentType === "DSCR" ? "default" : "secondary"} className="font-medium backdrop-blur-md bg-background/80 text-foreground border-none">
                {property.investmentType}
              </Badge>
              {property.rehabType && (
                <Badge variant="outline" className="bg-black/40 text-white border-white/20 backdrop-blur-sm">
                  <Hammer className="w-3 h-3 mr-1" />
                  {property.rehabType}
                </Badge>
              )}
            </div>

            <div className="absolute bottom-4 left-4 text-white">
              <p className="font-heading font-semibold text-lg tracking-tight leading-none mb-1">
                ${property.purchasePrice.toLocaleString()}
              </p>
              <div className="flex items-center text-xs text-white/80">
                 <MapPin className="w-3 h-3 mr-1" />
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
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Est. Rent</span>
              <span className="font-medium">{property.estRent ? `$${property.estRent.toLocaleString()}` : "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Est. ARV</span>
              <span className="font-medium">{property.estARV ? `$${property.estARV.toLocaleString()}` : "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Rehab</span>
              <span className="font-medium">{property.rehab > 0 ? `$${property.rehab.toLocaleString()}` : "Turnkey"}</span>
            </div>
             <div className="flex flex-col">
              <span className="text-muted-foreground text-xs uppercase tracking-wider">Taxes/yr</span>
              <span className="font-medium">${property.taxes.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <Link href={`/analysis/${property.id}`}>
            <Button className="w-full group-hover:bg-primary/90 transition-colors" variant="outline">
              Analyze Deal
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchProperties } from "@/lib/mockApi";
import { PropertyCard } from "@/components/ui/property-card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function SearchPage() {
  const [filters, setFilters] = useState({
    investmentType: "DSCR",
    state: "All",
    rehabType: "All"
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", filters],
    queryFn: () => searchProperties(filters),
  });

  return (
    <div className="container px-4 md:px-8 py-8 max-w-screen-2xl min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
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
                onClick={() => setFilters({ investmentType: "DSCR", state: "All", rehabType: "All" })}
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
                    <SelectItem value="PA">Pennsylvania</SelectItem>
                    <SelectItem value="GA">Georgia</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="TX">Texas</SelectItem>
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

        {/* Results Grid */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-heading font-bold text-foreground">
              {filters.investmentType} Opportunities
            </h1>
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
              <Button variant="link" onClick={() => setFilters({ investmentType: "DSCR", state: "All", rehabType: "All" })}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

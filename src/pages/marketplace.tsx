import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Heart,
  MapPin,
  DollarSign,
  ArrowLeft,
  Building2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  getListings,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  submitOffer as submitOfferService,
  Listing,
} from "@/services/MarketplaceServices";

// Remove local interfaces that are now in the service or not needed if using service types
// For now, I'll keep the Property interface if it's not exported from service, but Listing is exported.
// Actually, let's just use the types from the service if they match, or keep local if needed for partial updates.
// The service exports Listing and Property (implicitly via Listing).
// Let's use the local interfaces or update them to import from service.
// For this refactor, I will just replace the fetch calls and let the types match structurally or I'll import them.

export default function MarketplacePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchedListings, setWatchedListings] = useState<Set<string>>(
    new Set()
  );
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");

  useEffect(() => {
    fetchListings();
    fetchWatchlist();
  }, []);

  async function fetchListings() {
    try {
      const response = await getListings();
      setListings(response.data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchWatchlist() {
    try {
      const response = await getWatchlist();
      const watchedIds = new Set(
        response.data.map((item: any) => item.listingId)
      );
      setWatchedListings(watchedIds as Set<string>);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  }

  async function toggleWatchlist(listingId: string) {
    try {
      if (watchedListings.has(listingId)) {
        await removeFromWatchlist(listingId);
        setWatchedListings((prev) => {
          const newSet = new Set(prev);
          newSet.delete(listingId);
          return newSet;
        });
      } else {
        await addToWatchlist(listingId);
        setWatchedListings(
          (prev) => new Set(Array.from(prev).concat(listingId))
        );
      }
    } catch (error) {
      console.error("Error updating watchlist:", error);
    }
  }

  async function submitOffer() {
    if (!selectedListing || !offerAmount) return;
    try {
      await submitOfferService({
        listingId: selectedListing.id,
        offerAmount: parseInt(offerAmount),
        message: offerMessage,
      });

      setOfferDialogOpen(false);
      setOfferAmount("");
      setOfferMessage("");
      setSelectedListing(null);
      alert("Offer submitted successfully!");
    } catch (error) {
      console.error("Error submitting offer:", error);
    }
  }

  return (
    <div className="container max-w-screen-2xl px-4 md:px-8 py-8 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1
          className="text-3xl font-heading font-bold text-foreground"
          data-testid="text-marketplace-title"
        >
          Property Marketplace
        </h1>
        <p className="text-muted-foreground">
          Browse and invest in properties listed for sale
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading listings...</p>
        </div>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium text-muted-foreground">
              No listings available
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Check back later for new property listings.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
              data-testid={`card-listing-${listing.id}`}
            >
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/80 p-2 rounded-lg">
                    <Home className="w-6 h-6 text-primary" />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleWatchlist(listing.id)}
                    className={
                      watchedListings.has(listing.id)
                        ? "text-red-500"
                        : "text-gray-400"
                    }
                    data-testid={`button-watchlist-${listing.id}`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        watchedListings.has(listing.id) ? "fill-current" : ""
                      }`}
                    />
                  </Button>
                </div>
                <p className="text-2xl font-bold text-primary">
                  ${listing.listPrice?.toLocaleString() || "0"}
                </p>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">
                  {listing.property?.address || "Property"}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                  <MapPin className="w-3 h-3" />
                  {listing.property?.city}, {listing.property?.state}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="font-medium">
                      {listing.property?.attomBeds ||
                        listing.property?.beds ||
                        "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">Beds</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="font-medium">
                      {listing.property?.attomBaths ||
                        listing.property?.baths ||
                        "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">Baths</p>
                  </div>
                  <div className="text-center p-2 bg-muted/50 rounded">
                    <p className="font-medium">
                      {listing.property?.attomBldgSize?.toLocaleString() ||
                        listing.property?.sqFt?.toLocaleString() ||
                        "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">Sq Ft</p>
                  </div>
                </div>

                {listing.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {listing.description}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => {
                      setSelectedListing(listing);
                      setOfferAmount(String(listing.listPrice || ""));
                      setOfferDialogOpen(true);
                    }}
                    data-testid={`button-make-offer-${listing.id}`}
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Make Offer
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={offerDialogOpen} onOpenChange={setOfferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Make an Offer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            {selectedListing && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="font-medium">
                  {selectedListing.property?.address}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedListing.property?.city},{" "}
                  {selectedListing.property?.state}
                </p>
                <p className="text-sm font-medium text-primary mt-2">
                  Asking: ${selectedListing.listPrice?.toLocaleString()}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="offerAmount">Your Offer ($)</Label>
              <Input
                id="offerAmount"
                type="number"
                placeholder="Enter your offer amount"
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
                data-testid="input-offer-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                placeholder="Add a message to the seller..."
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                data-testid="input-offer-message"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setOfferDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={submitOffer}
                disabled={!offerAmount}
                data-testid="button-submit-offer"
              >
                Submit Offer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

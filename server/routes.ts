import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLoanApplicationSchema, insertListingSchema, insertOfferSchema, type InsertProperty } from "@shared/schema";
import { z } from "zod";
import XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";

const ATTOM_API_BASE = "https://api.gateway.attomdata.com/propertyapi/v1.0.0";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function enrichPropertyWithAttom(
  propertyId: string,
  address: string,
  city: string,
  state: string
): Promise<void> {
  const apiKey = process.env.ATTOM_API_KEY;
  if (!apiKey) {
    await storage.updateProperty(propertyId, {
      attomStatus: "failed",
      attomError: "ATTOM API key not configured",
    });
    return;
  }

  try {
    const address1 = encodeURIComponent(address);
    const address2 = encodeURIComponent(`${city}, ${state}`);
    
    const [basicResponse, assessmentResponse] = await Promise.all([
      fetch(
        `${ATTOM_API_BASE}/property/basicprofile?address1=${address1}&address2=${address2}`,
        {
          headers: {
            Accept: "application/json",
            apikey: apiKey,
          },
        }
      ),
      fetch(
        `${ATTOM_API_BASE}/assessment/detail?address1=${address1}&address2=${address2}`,
        {
          headers: {
            Accept: "application/json",
            apikey: apiKey,
          },
        }
      )
    ]);

    if (basicResponse.status === 429) {
      await storage.updateProperty(propertyId, {
        attomStatus: "rate_limited",
        attomError: "Rate limited - will retry later",
      });
      return;
    }

    if (!basicResponse.ok) {
      await storage.updateProperty(propertyId, {
        attomStatus: "failed",
        attomError: `API returned ${basicResponse.status}`,
      });
      return;
    }

    const basicData = await basicResponse.json();
    const prop = basicData.property?.[0];

    if (!prop) {
      await storage.updateProperty(propertyId, {
        attomStatus: "failed",
        attomError: "No property data returned",
      });
      return;
    }

    let annualTaxes: number | null = null;
    if (assessmentResponse.ok) {
      const assessmentData = await assessmentResponse.json();
      const assessment = assessmentData.property?.[0]?.assessment;
      if (assessment?.tax?.taxamt) {
        annualTaxes = Math.round(assessment.tax.taxamt);
      }
    }

    await storage.updateProperty(propertyId, {
      attomStatus: "success",
      attomMarketValue: prop.assessment?.market?.mktTotalValue || prop.assessment?.market?.mktTtlValue,
      attomAssessedValue: prop.assessment?.assessed?.assdTotalValue || prop.assessment?.assessed?.assdTtlValue,
      attomYearBuilt: prop.summary?.yearBuilt,
      attomBldgSize: prop.building?.size?.bldgSize,
      attomBeds: prop.building?.rooms?.beds,
      attomBaths: prop.building?.rooms?.bathsTotal,
      attomLotSize: prop.lot?.lotSize1,
      attomPropClass: prop.summary?.propClass,
      attomLastSalePrice: prop.sale?.amount?.saleamt,
      attomLastSaleDate: prop.sale?.saleTransDate,
      annualTaxes: annualTaxes,
      attomData: prop,
      attomSyncedAt: new Date(),
      attomError: null,
    });
  } catch (error) {
    await storage.updateProperty(propertyId, {
      attomStatus: "failed",
      attomError: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Create a new loan application
  app.post("/api/applications", async (req, res) => {
    try {
      const validatedData = insertLoanApplicationSchema.parse(req.body);
      const application = await storage.createLoanApplication(validatedData);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid request data", details: error.errors });
      } else {
        console.error("Error creating application:", error);
        res.status(500).json({ error: "Failed to create application" });
      }
    }
  });

  // Get all loan applications
  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getAllLoanApplications();
      res.json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  // Get a specific loan application
  app.get("/api/applications/:id", async (req, res) => {
    try {
      const application = await storage.getLoanApplication(req.params.id);
      if (!application) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      res.json(application);
    } catch (error) {
      console.error("Error fetching application:", error);
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  // Update application status
  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status || typeof status !== "string") {
        res.status(400).json({ error: "Status is required" });
        return;
      }
      const updated = await storage.updateLoanApplicationStatus(req.params.id, status);
      if (!updated) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ error: "Failed to update status" });
    }
  });

  // Update application
  app.patch("/api/applications/:id", async (req, res) => {
    try {
      const updated = await storage.updateLoanApplication(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Application not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating application:", error);
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  // ATTOM Property Search API proxy
  app.get("/api/property/search", async (req, res) => {
    try {
      const { address } = req.query;
      
      if (!address || typeof address !== "string") {
        res.status(400).json({ error: "Address is required" });
        return;
      }

      const apiKey = process.env.ATTOM_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "ATTOM API key not configured" });
        return;
      }

      const response = await fetch(
        `${ATTOM_API_BASE}/property/basicprofile?address=${encodeURIComponent(address)}`,
        {
          headers: {
            "Accept": "application/json",
            "apikey": apiKey,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          res.status(404).json({ error: "Property not found" });
          return;
        }
        throw new Error(`ATTOM API returned ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error searching property:", error);
      res.status(500).json({ error: "Failed to search property" });
    }
  });

  // ATTOM Radius Search API proxy
  app.get("/api/property/radius", async (req, res) => {
    try {
      const { lat, lng, radius, minbeds, maxbeds, propertytype } = req.query;
      
      if (!lat || !lng) {
        res.status(400).json({ error: "Latitude and longitude are required" });
        return;
      }

      const apiKey = process.env.ATTOM_API_KEY;
      if (!apiKey) {
        res.status(500).json({ error: "ATTOM API key not configured" });
        return;
      }

      let url = `${ATTOM_API_BASE}/property/snapshot?latitude=${lat}&longitude=${lng}&radius=${radius || 1}`;
      if (minbeds) url += `&minbeds=${minbeds}`;
      if (maxbeds) url += `&maxbeds=${maxbeds}`;
      if (propertytype) url += `&propertytype=${propertytype}`;

      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "apikey": apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ATTOM API returned ${response.status}`);
      }

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error searching properties by radius:", error);
      res.status(500).json({ error: "Failed to search properties" });
    }
  });

  // Get all properties
  app.get("/api/properties", async (req, res) => {
    try {
      const allProperties = await storage.getAllProperties();
      res.json(allProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ error: "Failed to fetch properties" });
    }
  });

  // Get single property by ID
  app.get("/api/properties/:id", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        res.status(404).json({ error: "Property not found" });
        return;
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ error: "Failed to fetch property" });
    }
  });

  // Update property by ID
  app.put("/api/properties/:id", async (req, res) => {
    try {
      const updated = await storage.updateProperty(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Property not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  // Import properties from Excel file
  app.post("/api/properties/import", async (req, res) => {
    try {
      const { filePath } = req.body;
      
      if (!filePath || typeof filePath !== "string") {
        res.status(400).json({ error: "File path is required" });
        return;
      }

      const normalizedPath = path.normalize(filePath);
      const allowedPrefixes = ["attached_assets/", "attached_assets\\"];
      const isAllowed = allowedPrefixes.some(prefix => normalizedPath.startsWith(prefix));
      
      if (!isAllowed || normalizedPath.includes("..")) {
        res.status(403).json({ error: "Access denied: only files from attached_assets are allowed" });
        return;
      }

      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet) as Array<Record<string, unknown>>;

      const propertiesToInsert: InsertProperty[] = data.map((row) => ({
        propertyType: String(row["Type"] || ""),
        address: String(row["Address"] || ""),
        city: String(row["City"] || ""),
        state: "CA",
        sqFt: Number(row["Sq Ft"]) || null,
        beds: Number(row["Beds"]) || null,
        baths: Number(row["Baths"]) || null,
        estValue: Number(row["Est Value"]) || null,
        estEquity: Number(row["Est Equity $"]) || null,
        owner: String(row["Owner"] || ""),
        ownerOccupied: row["Owner Occ?"] ? "Yes" : "No",
        listedForSale: row["Listed for Sale?"] ? "Yes" : "No",
        foreclosure: row["Foreclosure?"] ? "Yes" : "No",
        attomStatus: "pending",
      }));

      const importedProperties = await storage.createProperties(propertiesToInsert);
      
      res.json({
        success: true,
        imported: importedProperties.length,
        properties: importedProperties,
      });
    } catch (error) {
      console.error("Error importing properties:", error);
      res.status(500).json({ error: "Failed to import properties" });
    }
  });

  // Enrich all pending properties with ATTOM data
  app.post("/api/properties/enrich", async (req, res) => {
    try {
      const pendingProperties = await storage.getPropertiesByStatus("pending");
      const rateLimitedProperties = await storage.getPropertiesByStatus("rate_limited");
      const toEnrich = [...pendingProperties, ...rateLimitedProperties];

      if (toEnrich.length === 0) {
        res.json({ success: true, message: "No properties to enrich", enriched: 0 });
        return;
      }

      res.json({
        success: true,
        message: `Enrichment started for ${toEnrich.length} properties`,
        total: toEnrich.length,
      });

      for (const property of toEnrich) {
        if (property.address && property.city) {
          await enrichPropertyWithAttom(
            property.id,
            property.address,
            property.city,
            property.state || "CA"
          );
          await delay(500);
        }
      }
    } catch (error) {
      console.error("Error enriching properties:", error);
      res.status(500).json({ error: "Failed to enrich properties" });
    }
  });

  // Enrich a single property
  app.post("/api/properties/:id/enrich", async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        res.status(404).json({ error: "Property not found" });
        return;
      }

      await enrichPropertyWithAttom(
        property.id,
        property.address,
        property.city || "",
        property.state || "CA"
      );

      const updated = await storage.getProperty(req.params.id);
      res.json(updated);
    } catch (error) {
      console.error("Error enriching property:", error);
      res.status(500).json({ error: "Failed to enrich property" });
    }
  });

  // =====================
  // PROPERTY LISTINGS
  // =====================

  // Create a new listing
  app.post("/api/listings", async (req, res) => {
    try {
      const userId = "default_user";
      const listingData = {
        ...req.body,
        ownerUserId: userId,
      };
      const listing = await storage.createListing(listingData);
      res.status(201).json(listing);
    } catch (error) {
      console.error("Error creating listing:", error);
      res.status(500).json({ error: "Failed to create listing" });
    }
  });

  // Get all active listings (marketplace)
  app.get("/api/listings", async (req, res) => {
    try {
      const listings = await storage.getAllListings();
      const listingsWithProperties = await Promise.all(
        listings.map(async (listing) => {
          const property = await storage.getProperty(listing.propertyId);
          return { ...listing, property };
        })
      );
      res.json(listingsWithProperties);
    } catch (error) {
      console.error("Error fetching listings:", error);
      res.status(500).json({ error: "Failed to fetch listings" });
    }
  });

  // Get listings by owner (my listings)
  app.get("/api/listings/my", async (req, res) => {
    try {
      const userId = "default_user";
      const listings = await storage.getListingsByOwner(userId);
      const listingsWithProperties = await Promise.all(
        listings.map(async (listing) => {
          const property = await storage.getProperty(listing.propertyId);
          const offers = await storage.getOffersByListing(listing.id);
          return { ...listing, property, offers };
        })
      );
      res.json(listingsWithProperties);
    } catch (error) {
      console.error("Error fetching my listings:", error);
      res.status(500).json({ error: "Failed to fetch my listings" });
    }
  });

  // Get single listing
  app.get("/api/listings/:id", async (req, res) => {
    try {
      const listing = await storage.getListing(req.params.id);
      if (!listing) {
        res.status(404).json({ error: "Listing not found" });
        return;
      }
      const property = await storage.getProperty(listing.propertyId);
      const offers = await storage.getOffersByListing(listing.id);
      res.json({ ...listing, property, offers });
    } catch (error) {
      console.error("Error fetching listing:", error);
      res.status(500).json({ error: "Failed to fetch listing" });
    }
  });

  // Update listing
  app.patch("/api/listings/:id", async (req, res) => {
    try {
      const updated = await storage.updateListing(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Listing not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating listing:", error);
      res.status(500).json({ error: "Failed to update listing" });
    }
  });

  // Delete listing
  app.delete("/api/listings/:id", async (req, res) => {
    try {
      await storage.deleteListing(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting listing:", error);
      res.status(500).json({ error: "Failed to delete listing" });
    }
  });

  // =====================
  // WATCHLIST
  // =====================

  // Get user's watchlist
  app.get("/api/watchlist", async (req, res) => {
    try {
      const userId = "default_user";
      const watchlist = await storage.getWatchlistByUser(userId);
      const watchlistWithListings = await Promise.all(
        watchlist.map(async (item) => {
          const listing = await storage.getListing(item.listingId);
          const property = listing ? await storage.getProperty(listing.propertyId) : null;
          return { ...item, listing, property };
        })
      );
      res.json(watchlistWithListings);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.status(500).json({ error: "Failed to fetch watchlist" });
    }
  });

  // Add to watchlist
  app.post("/api/watchlist", async (req, res) => {
    try {
      const { listingId } = req.body;
      const userId = "default_user";
      
      const exists = await storage.isInWatchlist(userId, listingId);
      if (exists) {
        res.status(400).json({ error: "Already in watchlist" });
        return;
      }
      
      const item = await storage.addToWatchlist({ userId, listingId });
      res.status(201).json(item);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ error: "Failed to add to watchlist" });
    }
  });

  // Remove from watchlist
  app.delete("/api/watchlist/:listingId", async (req, res) => {
    try {
      const userId = "default_user";
      await storage.removeFromWatchlist(userId, req.params.listingId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      res.status(500).json({ error: "Failed to remove from watchlist" });
    }
  });

  // Check if listing is in watchlist
  app.get("/api/watchlist/check/:listingId", async (req, res) => {
    try {
      const userId = "default_user";
      const isWatched = await storage.isInWatchlist(userId, req.params.listingId);
      res.json({ isWatched });
    } catch (error) {
      console.error("Error checking watchlist:", error);
      res.status(500).json({ error: "Failed to check watchlist" });
    }
  });

  // =====================
  // OFFERS
  // =====================

  // Create offer
  app.post("/api/offers", async (req, res) => {
    try {
      const userId = "default_user";
      const offerData = {
        ...req.body,
        buyerUserId: userId,
      };
      const offer = await storage.createOffer(offerData);
      res.status(201).json(offer);
    } catch (error) {
      console.error("Error creating offer:", error);
      res.status(500).json({ error: "Failed to create offer" });
    }
  });

  // Get my offers (as buyer)
  app.get("/api/offers/my", async (req, res) => {
    try {
      const userId = "default_user";
      const offers = await storage.getOffersByBuyer(userId);
      const offersWithListings = await Promise.all(
        offers.map(async (offer) => {
          const listing = await storage.getListing(offer.listingId);
          const property = listing ? await storage.getProperty(listing.propertyId) : null;
          return { ...offer, listing, property };
        })
      );
      res.json(offersWithListings);
    } catch (error) {
      console.error("Error fetching my offers:", error);
      res.status(500).json({ error: "Failed to fetch my offers" });
    }
  });

  // Get offers for a listing
  app.get("/api/listings/:listingId/offers", async (req, res) => {
    try {
      const offers = await storage.getOffersByListing(req.params.listingId);
      res.json(offers);
    } catch (error) {
      console.error("Error fetching offers:", error);
      res.status(500).json({ error: "Failed to fetch offers" });
    }
  });

  // Update offer status
  app.patch("/api/offers/:id", async (req, res) => {
    try {
      const updated = await storage.updateOffer(req.params.id, req.body);
      if (!updated) {
        res.status(404).json({ error: "Offer not found" });
        return;
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating offer:", error);
      res.status(500).json({ error: "Failed to update offer" });
    }
  });

  return httpServer;
}

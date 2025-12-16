import { 
  loanApplications, properties, propertyListings, propertyWatchlist, propertyOffers, propertyAlerts,
  type LoanApplication, type InsertLoanApplication, 
  type Property, type InsertProperty,
  type PropertyListing, type InsertListing,
  type PropertyWatchlistItem, type InsertWatchlist,
  type PropertyOffer, type InsertOffer,
  type PropertyAlert, type InsertAlert
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  getLoanApplication(id: string): Promise<LoanApplication | undefined>;
  getAllLoanApplications(): Promise<LoanApplication[]>;
  updateLoanApplicationStatus(id: string, status: string): Promise<LoanApplication | undefined>;
  updateLoanApplication(id: string, updates: Partial<LoanApplication>): Promise<LoanApplication | undefined>;

  createProperty(property: InsertProperty): Promise<Property>;
  createProperties(propertiesToInsert: InsertProperty[]): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  getPropertiesByStatus(status: string): Promise<Property[]>;
  updateProperty(id: string, updates: Partial<Property>): Promise<Property | undefined>;

  createListing(listing: InsertListing): Promise<PropertyListing>;
  getListing(id: string): Promise<PropertyListing | undefined>;
  getAllListings(): Promise<PropertyListing[]>;
  getListingsByOwner(ownerId: string): Promise<PropertyListing[]>;
  updateListing(id: string, updates: Partial<PropertyListing>): Promise<PropertyListing | undefined>;
  deleteListing(id: string): Promise<void>;

  addToWatchlist(item: InsertWatchlist): Promise<PropertyWatchlistItem>;
  removeFromWatchlist(userId: string, listingId: string): Promise<void>;
  getWatchlistByUser(userId: string): Promise<PropertyWatchlistItem[]>;
  isInWatchlist(userId: string, listingId: string): Promise<boolean>;

  createOffer(offer: InsertOffer): Promise<PropertyOffer>;
  getOffer(id: string): Promise<PropertyOffer | undefined>;
  getOffersByListing(listingId: string): Promise<PropertyOffer[]>;
  getOffersByBuyer(buyerId: string): Promise<PropertyOffer[]>;
  updateOffer(id: string, updates: Partial<PropertyOffer>): Promise<PropertyOffer | undefined>;
  
  countRentcastSyncedProperties(): Promise<number>;

  createAlert(alert: InsertAlert): Promise<PropertyAlert>;
  getAlert(id: string): Promise<PropertyAlert | undefined>;
  getAlertsByUser(userId: string): Promise<PropertyAlert[]>;
  updateAlert(id: string, updates: Partial<PropertyAlert>): Promise<PropertyAlert | undefined>;
  deleteAlert(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication> {
    const [created] = await db
      .insert(loanApplications)
      .values(application)
      .returning();
    return created;
  }

  async getLoanApplication(id: string): Promise<LoanApplication | undefined> {
    const [application] = await db
      .select()
      .from(loanApplications)
      .where(eq(loanApplications.id, id));
    return application || undefined;
  }

  async getAllLoanApplications(): Promise<LoanApplication[]> {
    const applications = await db
      .select()
      .from(loanApplications)
      .orderBy(desc(loanApplications.submittedAt));
    return applications;
  }

  async updateLoanApplicationStatus(id: string, status: string): Promise<LoanApplication | undefined> {
    const [updated] = await db
      .update(loanApplications)
      .set({ status, updatedAt: new Date() })
      .where(eq(loanApplications.id, id))
      .returning();
    return updated || undefined;
  }

  async updateLoanApplication(id: string, updates: Partial<LoanApplication>): Promise<LoanApplication | undefined> {
    const [updated] = await db
      .update(loanApplications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(loanApplications.id, id))
      .returning();
    return updated || undefined;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [created] = await db
      .insert(properties)
      .values(property)
      .returning();
    return created;
  }

  async createProperties(propertiesToInsert: InsertProperty[]): Promise<Property[]> {
    if (propertiesToInsert.length === 0) return [];
    const created = await db
      .insert(properties)
      .values(propertiesToInsert)
      .returning();
    return created;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    return property || undefined;
  }

  async getAllProperties(): Promise<Property[]> {
    const allProperties = await db
      .select()
      .from(properties)
      .orderBy(desc(properties.createdAt));
    return allProperties;
  }

  async getPropertiesByStatus(status: string): Promise<Property[]> {
    const result = await db
      .select()
      .from(properties)
      .where(eq(properties.attomStatus, status))
      .orderBy(desc(properties.createdAt));
    return result;
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property | undefined> {
    const [updated] = await db
      .update(properties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updated || undefined;
  }

  async createListing(listing: InsertListing): Promise<PropertyListing> {
    const [created] = await db
      .insert(propertyListings)
      .values(listing)
      .returning();
    return created;
  }

  async getListing(id: string): Promise<PropertyListing | undefined> {
    const [listing] = await db
      .select()
      .from(propertyListings)
      .where(eq(propertyListings.id, id));
    return listing || undefined;
  }

  async getAllListings(): Promise<PropertyListing[]> {
    const listings = await db
      .select()
      .from(propertyListings)
      .where(eq(propertyListings.status, "active"))
      .orderBy(desc(propertyListings.createdAt));
    return listings;
  }

  async getListingsByOwner(ownerId: string): Promise<PropertyListing[]> {
    const listings = await db
      .select()
      .from(propertyListings)
      .where(eq(propertyListings.ownerUserId, ownerId))
      .orderBy(desc(propertyListings.createdAt));
    return listings;
  }

  async updateListing(id: string, updates: Partial<PropertyListing>): Promise<PropertyListing | undefined> {
    const [updated] = await db
      .update(propertyListings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(propertyListings.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteListing(id: string): Promise<void> {
    await db.delete(propertyListings).where(eq(propertyListings.id, id));
  }

  async addToWatchlist(item: InsertWatchlist): Promise<PropertyWatchlistItem> {
    const [created] = await db
      .insert(propertyWatchlist)
      .values(item)
      .returning();
    return created;
  }

  async removeFromWatchlist(userId: string, listingId: string): Promise<void> {
    await db
      .delete(propertyWatchlist)
      .where(and(
        eq(propertyWatchlist.userId, userId),
        eq(propertyWatchlist.listingId, listingId)
      ));
  }

  async getWatchlistByUser(userId: string): Promise<PropertyWatchlistItem[]> {
    const items = await db
      .select()
      .from(propertyWatchlist)
      .where(eq(propertyWatchlist.userId, userId))
      .orderBy(desc(propertyWatchlist.createdAt));
    return items;
  }

  async isInWatchlist(userId: string, listingId: string): Promise<boolean> {
    const [item] = await db
      .select()
      .from(propertyWatchlist)
      .where(and(
        eq(propertyWatchlist.userId, userId),
        eq(propertyWatchlist.listingId, listingId)
      ));
    return !!item;
  }

  async createOffer(offer: InsertOffer): Promise<PropertyOffer> {
    const [created] = await db
      .insert(propertyOffers)
      .values(offer)
      .returning();
    return created;
  }

  async getOffer(id: string): Promise<PropertyOffer | undefined> {
    const [offer] = await db
      .select()
      .from(propertyOffers)
      .where(eq(propertyOffers.id, id));
    return offer || undefined;
  }

  async getOffersByListing(listingId: string): Promise<PropertyOffer[]> {
    const offers = await db
      .select()
      .from(propertyOffers)
      .where(eq(propertyOffers.listingId, listingId))
      .orderBy(desc(propertyOffers.createdAt));
    return offers;
  }

  async getOffersByBuyer(buyerId: string): Promise<PropertyOffer[]> {
    const offers = await db
      .select()
      .from(propertyOffers)
      .where(eq(propertyOffers.buyerUserId, buyerId))
      .orderBy(desc(propertyOffers.createdAt));
    return offers;
  }

  async updateOffer(id: string, updates: Partial<PropertyOffer>): Promise<PropertyOffer | undefined> {
    const [updated] = await db
      .update(propertyOffers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(propertyOffers.id, id))
      .returning();
    return updated || undefined;
  }

  async countRentcastSyncedProperties(): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(properties)
      .where(eq(properties.rentcastStatus, "success"));
    return result[0]?.count || 0;
  }

  async createAlert(alert: InsertAlert): Promise<PropertyAlert> {
    const [created] = await db
      .insert(propertyAlerts)
      .values(alert)
      .returning();
    return created;
  }

  async getAlert(id: string): Promise<PropertyAlert | undefined> {
    const [alert] = await db
      .select()
      .from(propertyAlerts)
      .where(eq(propertyAlerts.id, id));
    return alert || undefined;
  }

  async getAlertsByUser(userId: string): Promise<PropertyAlert[]> {
    const alerts = await db
      .select()
      .from(propertyAlerts)
      .where(eq(propertyAlerts.userId, userId))
      .orderBy(desc(propertyAlerts.createdAt));
    return alerts;
  }

  async updateAlert(id: string, updates: Partial<PropertyAlert>): Promise<PropertyAlert | undefined> {
    const [updated] = await db
      .update(propertyAlerts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(propertyAlerts.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteAlert(id: string): Promise<void> {
    await db.delete(propertyAlerts).where(eq(propertyAlerts.id, id));
  }
}

export const storage = new DatabaseStorage();

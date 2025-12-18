import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, real, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const loanApplications = pgTable("loan_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanType: text("loan_type").notNull(),
  propertyType: text("property_type").notNull(),
  address: text("address"),
  purchasePrice: integer("purchase_price").notNull(),
  estimatedValue: integer("estimated_value").notNull(),
  downPayment: integer("down_payment").notNull(),
  loanAmount: integer("loan_amount").notNull(),
  creditScore: text("credit_score").notNull(),
  status: text("status").notNull().default("submitted"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  preferredContact: text("preferred_contact"),
  preferredCallTime: text("preferred_call_time"),
  agreeMarketing: text("agree_marketing"),
  documents: jsonb("documents").default([]),
  attomData: jsonb("attom_data"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  submittedAt: true,
  updatedAt: true,
});

export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type LoanApplication = typeof loanApplications.$inferSelect;

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyType: text("property_type"),
  address: text("address").notNull(),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  sqFt: integer("sq_ft"),
  beds: integer("beds"),
  baths: real("baths"),
  estValue: integer("est_value"),
  estEquity: integer("est_equity"),
  owner: text("owner"),
  ownerOccupied: text("owner_occupied"),
  listedForSale: text("listed_for_sale"),
  foreclosure: text("foreclosure"),
  attomStatus: text("attom_status").default("pending"),
  attomMarketValue: integer("attom_market_value"),
  attomAssessedValue: integer("attom_assessed_value"),
  attomYearBuilt: integer("attom_year_built"),
  attomBldgSize: integer("attom_bldg_size"),
  attomBeds: integer("attom_beds"),
  attomBaths: real("attom_baths"),
  attomLotSize: real("attom_lot_size"),
  attomPropClass: text("attom_prop_class"),
  attomLastSalePrice: integer("attom_last_sale_price"),
  attomLastSaleDate: text("attom_last_sale_date"),
  attomData: jsonb("attom_data"),
  attomError: text("attom_error"),
  attomAvmValue: integer("attom_avm_value"),
  attomAvmHigh: integer("attom_avm_high"),
  attomAvmLow: integer("attom_avm_low"),
  attomAvmConfidence: integer("attom_avm_confidence"),
  attomTaxAmount: integer("attom_tax_amount"),
  attomTaxYear: integer("attom_tax_year"),
  annualTaxes: integer("annual_taxes"),
  annualInsurance: integer("annual_insurance"),
  monthlyHoa: integer("monthly_hoa"),
  attomSyncedAt: timestamp("attom_synced_at"),
  rentcastStatus: text("rentcast_status").default("pending"),
  rentcastValueEstimate: integer("rentcast_value_estimate"),
  rentcastValueLow: integer("rentcast_value_low"),
  rentcastValueHigh: integer("rentcast_value_high"),
  rentcastRentEstimate: integer("rentcast_rent_estimate"),
  rentcastRentLow: integer("rentcast_rent_low"),
  rentcastRentHigh: integer("rentcast_rent_high"),
  rentcastPropertyData: jsonb("rentcast_property_data"),
  rentcastTaxHistory: jsonb("rentcast_tax_history"),
  rentcastSaleComps: jsonb("rentcast_sale_comps"),
  rentcastRentComps: jsonb("rentcast_rent_comps"),
  rentcastMarketData: jsonb("rentcast_market_data"),
  rentcastError: text("rentcast_error"),
  rentcastSyncedAt: timestamp("rentcast_synced_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export const propertyListings = pgTable("property_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull(),
  ownerUserId: text("owner_user_id").notNull().default("default_user"),
  status: text("status").notNull().default("active"),
  listPrice: integer("list_price"),
  description: text("description"),
  terms: text("terms"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertListingSchema = createInsertSchema(propertyListings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertListing = z.infer<typeof insertListingSchema>;
export type PropertyListing = typeof propertyListings.$inferSelect;

export const propertyWatchlist = pgTable("property_watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().default("default_user"),
  listingId: varchar("listing_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertWatchlistSchema = createInsertSchema(propertyWatchlist).omit({
  id: true,
  createdAt: true,
});

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type PropertyWatchlistItem = typeof propertyWatchlist.$inferSelect;

export const propertyOffers = pgTable("property_offers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: varchar("listing_id").notNull(),
  buyerUserId: text("buyer_user_id").notNull().default("default_user"),
  offerAmount: integer("offer_amount").notNull(),
  status: text("status").notNull().default("submitted"),
  message: text("message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertOfferSchema = createInsertSchema(propertyOffers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOffer = z.infer<typeof insertOfferSchema>;
export type PropertyOffer = typeof propertyOffers.$inferSelect;

export const propertyAlerts = pgTable("property_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id").notNull().default("default_user"),
  name: text("name").notNull(),
  isActive: text("is_active").notNull().default("true"),
  minPrice: integer("min_price"),
  maxPrice: integer("max_price"),
  minBeds: integer("min_beds"),
  maxBeds: integer("max_beds"),
  minBaths: real("min_baths"),
  maxBaths: real("max_baths"),
  minSqFt: integer("min_sq_ft"),
  maxSqFt: integer("max_sq_ft"),
  propertyTypes: text("property_types").array(),
  cities: text("cities").array(),
  states: text("states").array(),
  postalCodes: text("postal_codes").array(),
  keywords: text("keywords"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAlertSchema = createInsertSchema(propertyAlerts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type PropertyAlert = typeof propertyAlerts.$inferSelect;

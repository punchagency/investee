import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

import { loanApplications, properties, type LoanApplication, type InsertLoanApplication, type Property, type InsertProperty } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();

import { loanApplications, type LoanApplication, type InsertLoanApplication } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Loan Applications
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  getLoanApplication(id: string): Promise<LoanApplication | undefined>;
  getAllLoanApplications(): Promise<LoanApplication[]>;
  updateLoanApplicationStatus(id: string, status: string): Promise<LoanApplication | undefined>;
  updateLoanApplication(id: string, updates: Partial<LoanApplication>): Promise<LoanApplication | undefined>;
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
}

export const storage = new DatabaseStorage();

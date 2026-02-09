import { db } from "./db";
import {
  waterQualityMetrics, filterProducts, filterPerformance, userScans,
  type WaterQualityMetric, type FilterProduct, type UserScan,
  type InsertWaterQualityMetric, type InsertFilterProduct, type InsertUserScan
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Water Quality
  getWaterQualityByPlz(plz: string): Promise<WaterQualityMetric[]>;
  createWaterQualityMetric(metric: InsertWaterQualityMetric): Promise<WaterQualityMetric>;

  // Filters
  getAllFilters(): Promise<(FilterProduct & { performance: any[] })[]>;
  createFilterProduct(product: InsertFilterProduct): Promise<FilterProduct>;
  
  // User Scans
  getUserScans(userId: string): Promise<UserScan[]>;
  createUserScan(scan: InsertUserScan): Promise<UserScan>;
}

export class DatabaseStorage implements IStorage {
  async getWaterQualityByPlz(plz: string): Promise<WaterQualityMetric[]> {
    return await db.select().from(waterQualityMetrics).where(eq(waterQualityMetrics.plz, plz));
  }

  async createWaterQualityMetric(metric: InsertWaterQualityMetric): Promise<WaterQualityMetric> {
    const [newMetric] = await db.insert(waterQualityMetrics).values(metric).returning();
    return newMetric;
  }

  async getAllFilters(): Promise<(FilterProduct & { performance: any[] })[]> {
    const products = await db.select().from(filterProducts);
    // Fetch performance for each (could be optimized with a join)
    const results = await Promise.all(products.map(async (p) => {
        const perf = await db.select().from(filterPerformance).where(eq(filterPerformance.filterId, p.id));
        return { ...p, performance: perf };
    }));
    return results;
  }

  async createFilterProduct(product: InsertFilterProduct): Promise<FilterProduct> {
    const [newProduct] = await db.insert(filterProducts).values(product).returning();
    return newProduct;
  }

  async getUserScans(userId: string): Promise<UserScan[]> {
    return await db.select().from(userScans).where(eq(userScans.userId, userId));
  }

  async createUserScan(scan: InsertUserScan): Promise<UserScan> {
    const [newScan] = await db.insert(userScans).values(scan).returning();
    return newScan;
  }
}

export const storage = new DatabaseStorage();

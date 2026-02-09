import { pgTable, text, serial, integer, boolean, timestamp, decimal, date, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export Auth and Chat models from integrations
export * from "./models/auth";
export * from "./models/chat";

// === APP SPECIFIC TABLES ===

export const waterQualityMetrics = pgTable("water_quality_metrics", {
  id: serial("id").primaryKey(),
  plz: varchar("plz", { length: 5 }).notNull(),
  city: text("city").notNull(),
  contaminationType: text("contamination_type").notNull(), // e.g., 'PFAS', 'Nitrate', 'Lead'
  measuredValue: decimal("measured_value").notNull(),
  unit: text("unit").notNull(),
  limitValue: decimal("limit_value").notNull(),
  measurementDate: date("measurement_date").notNull(),
  dataSource: text("data_source").notNull(),
  riskLevel: text("risk_level").notNull(), // 'low', 'medium', 'high', 'critical'
  legalAdvice: text("legal_advice"), // Mietrechtliche Einordnung
});

export const filterProducts = pgTable("filter_products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  description: text("description").notNull(),
  price: decimal("price").notNull(),
  imageUrl: text("image_url"),
  affiliateLink: text("affiliate_link"),
  category: text("category").notNull(), // 'under-sink', 'table-top', 'whole-house'
});

export const filterPerformance = pgTable("filter_performance", {
  id: serial("id").primaryKey(),
  filterId: integer("filter_id").references(() => filterProducts.id),
  contaminant: text("contaminant").notNull(), // 'PFAS', 'Lead', etc.
  removalRate: decimal("removal_rate").notNull(), // Percentage
  certification: text("certification"), // e.g., 'NSF 53'
});

export const userScans = pgTable("user_scans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(), // Links to auth.users.id
  plz: varchar("plz", { length: 5 }).notNull(),
  scannedAt: timestamp("scanned_at").defaultNow(),
  isSaved: boolean("is_saved").default(false),
});

// === RELATIONS ===

export const filterProductsRelations = relations(filterProducts, ({ many }) => ({
  performance: many(filterPerformance),
}));

export const filterPerformanceRelations = relations(filterPerformance, ({ one }) => ({
  product: one(filterProducts, {
    fields: [filterPerformance.filterId],
    references: [filterProducts.id],
  }),
}));

// === INSERTS ===

export const insertWaterQualitySchema = createInsertSchema(waterQualityMetrics).omit({ id: true });
export const insertFilterProductSchema = createInsertSchema(filterProducts).omit({ id: true });
export const insertFilterPerformanceSchema = createInsertSchema(filterPerformance).omit({ id: true });
export const insertUserScanSchema = createInsertSchema(userScans).omit({ id: true, scannedAt: true });

// === TYPES ===

export type WaterQualityMetric = typeof waterQualityMetrics.$inferSelect;
export type InsertWaterQualityMetric = z.infer<typeof insertWaterQualitySchema>;

export type FilterProduct = typeof filterProducts.$inferSelect;
export type InsertFilterProduct = z.infer<typeof insertFilterProductSchema>;

export type FilterPerformance = typeof filterPerformance.$inferSelect;
export type InsertFilterPerformance = z.infer<typeof insertFilterPerformanceSchema>;

export type UserScan = typeof userScans.$inferSelect;
export type InsertUserScan = z.infer<typeof insertUserScanSchema>;

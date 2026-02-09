import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Integrations
  await setupAuth(app);
  registerAuthRoutes(app);
  registerChatRoutes(app);

  // === API ROUTES ===

  // Water Quality
  app.get(api.water.getByPlz.path, async (req, res) => {
    const plz = req.params.plz;
    const data = await storage.getWaterQualityByPlz(plz);
    
    // Fallback Mock Data if empty (for demo purposes)
    if (data.length === 0) {
       // Return realistic mock data
       return res.json([
         { id: 0, plz, city: "Musterstadt", contaminationType: "PFAS", measuredValue: "12.5", unit: "ng/L", limitValue: "20", measurementDate: new Date().toISOString(), dataSource: "UBA 2026", riskLevel: "medium" },
         { id: 0, plz, city: "Musterstadt", contaminationType: "Nitrat", measuredValue: "45", unit: "mg/L", limitValue: "50", measurementDate: new Date().toISOString(), dataSource: "UBA 2026", riskLevel: "high" },
         { id: 0, plz, city: "Musterstadt", contaminationType: "Blei", measuredValue: "0.005", unit: "mg/L", limitValue: "0.01", measurementDate: new Date().toISOString(), dataSource: "UBA 2026", riskLevel: "low" },
       ]);
    }

    res.json(data);
  });

  app.post(api.water.aggregate.path, async (req, res) => {
      // Stub for data aggregation trigger
      res.json({ message: "Aggregation started" });
  });

  // Filters
  app.get(api.filters.list.path, async (req, res) => {
    const filters = await storage.getAllFilters();
    res.json(filters);
  });

  app.post(api.filters.recommend.path, async (req, res) => {
      // Stub for recommendation logic
      // In a real app, this would analyze water quality vs filter specs
      const allFilters = await storage.getAllFilters();
      res.json(allFilters.slice(0, 3)); // Return top 3
  });

  // Scans
  app.get(api.scans.list.path, async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
      const userId = (req.user as any).claims.sub;
      const scans = await storage.getUserScans(userId);
      res.json(scans);
  });

  app.post(api.scans.create.path, async (req, res) => {
      if (!req.isAuthenticated()) return res.status(401).send("Unauthorized");
      try {
          const userId = (req.user as any).claims.sub;
          const input = api.scans.create.input.parse(req.body);
          const scan = await storage.createUserScan({ ...input, userId });
          res.status(201).json(scan);
      } catch (err) {
          if (err instanceof z.ZodError) {
              res.status(400).json(err.errors);
          } else {
              res.status(500).json({ message: "Internal Server Error" });
          }
      }
  });

  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
    // Seed Filters if empty
    const filters = await storage.getAllFilters();
    if (filters.length === 0) {
        await storage.createFilterProduct({
            name: "Alb Filter Active S",
            brand: "Alb Filter",
            description: "Hochleistungs-Untertischfilter für PFAS und Bakterien. Speziell optimiert für die Grenzwerte 2026.",
            price: "159.90",
            category: "under-sink",
            affiliateLink: "https://alb-filter.de",
            imageUrl: "https://images.unsplash.com/photo-1585832678696-d716886e33bd?auto=format&fit=crop&q=80&w=200"
        });
        await storage.createFilterProduct({
            name: "The Local Water Base",
            brand: "The Local Water",
            description: "Premium Aktivkohle-Blockfilter. Entfernt zuverlässig Schadstoffe und verbessert den Geschmack.",
            price: "249.00",
            category: "under-sink",
            affiliateLink: "https://thelocalwater.com",
            imageUrl: "https://images.unsplash.com/photo-1546768292-fb12f6c92568?auto=format&fit=crop&q=80&w=200"
        });
        await storage.createFilterProduct({
            name: "Brita Marella",
            brand: "Brita",
            description: "Tischwasserfilter zur Reduzierung von Kalk und geschmacksstörenden Stoffen.",
            price: "24.99",
            category: "table-top",
            affiliateLink: "https://brita.de",
            imageUrl: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?auto=format&fit=crop&q=80&w=200"
        });
    }

    // Seed Water Data for Berlin (10115)
    const existing = await storage.getWaterQualityByPlz("10115");
    if (existing.length === 0) {
        await storage.createWaterQualityMetric({
            plz: "10115",
            city: "Berlin",
            contaminationType: "PFAS",
            measuredValue: "18.5",
            unit: "ng/L",
            limitValue: "20.0",
            measurementDate: new Date().toISOString().split('T')[0],
            dataSource: "UBA 2026 Analyse",
            riskLevel: "medium"
        });
         await storage.createWaterQualityMetric({
            plz: "10115",
            city: "Berlin",
            contaminationType: "Blei",
            measuredValue: "0.002",
            unit: "mg/L",
            limitValue: "0.010",
            measurementDate: new Date().toISOString().split('T')[0],
            dataSource: "Berliner Wasserbetriebe",
            riskLevel: "low"
        });
    }
}

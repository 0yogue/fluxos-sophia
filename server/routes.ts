import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get performance metrics
  app.get("/api/performance", async (req, res) => {
    try {
      const filters: any = {};
      
      if (req.query.startDate) {
        filters.startDate = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        filters.endDate = new Date(req.query.endDate as string);
      }
      if (req.query.salespersonId) {
        filters.salespersonId = parseInt(req.query.salespersonId as string);
      }

      const metrics = await storage.getPerformanceMetrics(filters);
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance metrics" });
    }
  });

  // Get salespeople
  app.get("/api/salespeople", async (req, res) => {
    try {
      const salespeople = await storage.getSalespeople();
      res.json(salespeople);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch salespeople" });
    }
  });

  // Get conversations with filters
  app.get("/api/conversations", async (req, res) => {
    try {
      const filters: any = {};
      
      if (req.query.salespersonId) {
        filters.salespersonId = parseInt(req.query.salespersonId as string);
      }
      if (req.query.startDate) {
        filters.startDate = new Date(req.query.startDate as string);
      }
      if (req.query.endDate) {
        filters.endDate = new Date(req.query.endDate as string);
      }
      if (req.query.hasSale !== undefined) {
        filters.hasSale = req.query.hasSale === 'true';
      }
      if (req.query.minScore) {
        filters.minScore = parseInt(req.query.minScore as string);
      }
      if (req.query.maxScore) {
        filters.maxScore = parseInt(req.query.maxScore as string);
      }

      const conversations = await storage.getConversations(filters);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get single conversation
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

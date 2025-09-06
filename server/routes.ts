import type { Express } from "express";
import { createServer, type Server } from "http";
import { notion, getNotionDatabases, extractPageIdFromUrl } from "./notion";
import { databaseResponseSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get database info and records
  app.get("/api/database/:databaseId", async (req, res) => {
    try {
      const { databaseId } = req.params;
      
      // Get database info
      const database = await notion.databases.retrieve({
        database_id: databaseId,
      });
      
      // Get database records using raw HTTP API
      const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NOTION_INTEGRATION_SECRET}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          page_size: 100
        })
      });
      
      if (!response.ok) {
        throw new Error(`Notion API error: ${response.status} ${response.statusText}`);
      }
      
      const recordsResponse = await response.json();
      
      const result = {
        database,
        records: recordsResponse.results,
        recordCount: recordsResponse.results.length,
        lastUpdated: new Date().toISOString(),
      };
      
      res.json(result);
    } catch (error) {
      console.error("Error fetching database:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch database" 
      });
    }
  });
  
  // Get all databases from the configured page
  app.get("/api/databases", async (req, res) => {
    try {
      const databases = await getNotionDatabases();
      res.json(databases);
    } catch (error) {
      console.error("Error fetching databases:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch databases" 
      });
    }
  });
  
  // Extract database ID from URL
  app.post("/api/extract-database-id", async (req, res) => {
    try {
      const { pageUrl } = req.body;
      
      if (!pageUrl) {
        return res.status(400).json({ message: "Page URL is required" });
      }
      
      const databaseId = extractPageIdFromUrl(pageUrl);
      res.json({ databaseId });
    } catch (error) {
      console.error("Error extracting database ID:", error);
      res.status(400).json({ 
        message: "Invalid Notion URL format" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

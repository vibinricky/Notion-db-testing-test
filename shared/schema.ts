import { z } from "zod";

// Notion property types
export const notionPropertySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
});

export const notionRecordSchema = z.object({
  id: z.string(),
  properties: z.record(z.any()),
  created_time: z.string(),
  last_edited_time: z.string(),
});

export const notionDatabaseSchema = z.object({
  id: z.string(),
  title: z.array(z.object({
    plain_text: z.string(),
  })),
  properties: z.record(z.any()),
  created_time: z.string(),
  last_edited_time: z.string(),
});

export type NotionProperty = z.infer<typeof notionPropertySchema>;
export type NotionRecord = z.infer<typeof notionRecordSchema>;
export type NotionDatabase = z.infer<typeof notionDatabaseSchema>;

// API response schemas
export const databaseResponseSchema = z.object({
  database: notionDatabaseSchema,
  records: z.array(notionRecordSchema),
  recordCount: z.number(),
  lastUpdated: z.string(),
});

export type DatabaseResponse = z.infer<typeof databaseResponseSchema>;

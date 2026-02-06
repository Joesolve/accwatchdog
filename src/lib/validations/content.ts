import { z } from "zod";

export const contentStatusEnum = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

// Case Highlights
export const caseHighlightSchema = z.object({
  title: z.string().min(5).max(200),
  summary: z.string().min(20).max(500),
  content: z.string().min(100),
  caseNumber: z.string().max(50).optional(),
  defendant: z.string().max(200).optional(),
  charges: z.array(z.string()).default([]),
  verdict: z.string().max(100).optional(),
  sentence: z.string().max(500).optional(),
  amountInvolved: z.number().min(0).optional(),
  amountRecovered: z.number().min(0).optional(),
  sector: z.string().optional(),
  region: z.string().optional(),
  caseDate: z.coerce.date().optional(),
  verdictDate: z.coerce.date().optional(),
  featuredImage: z.string().url().optional(),
  status: contentStatusEnum.default("DRAFT"),
});

export const caseHighlightUpdateSchema = caseHighlightSchema.partial();

// News Updates
export const newsUpdateSchema = z.object({
  title: z.string().min(5).max(200),
  excerpt: z.string().max(500).optional(),
  content: z.string().min(100),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().url().optional(),
  status: contentStatusEnum.default("DRAFT"),
});

export const newsUpdateUpdateSchema = newsUpdateSchema.partial();

// Educational Resources
export const resourceTypeEnum = z.enum(["ARTICLE", "VIDEO", "PDF", "INFOGRAPHIC"]);

export const educationalResourceSchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(1000),
  content: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  resourceType: resourceTypeEnum,
  featuredImage: z.string().url().optional(),
  fileUrl: z.string().url().optional(),
  videoUrl: z.string().url().optional(),
  status: contentStatusEnum.default("DRAFT"),
});

export const educationalResourceUpdateSchema = educationalResourceSchema.partial();

// Filters
export const caseFiltersSchema = z.object({
  sector: z.string().optional(),
  region: z.string().optional(),
  year: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export const newsFiltersSchema = z.object({
  category: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export const resourceFiltersSchema = z.object({
  category: z.string().optional(),
  type: resourceTypeEnum.optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export type CaseHighlightInput = z.infer<typeof caseHighlightSchema>;
export type NewsUpdateInput = z.infer<typeof newsUpdateSchema>;
export type EducationalResourceInput = z.infer<typeof educationalResourceSchema>;
export type CaseFilters = z.infer<typeof caseFiltersSchema>;
export type NewsFilters = z.infer<typeof newsFiltersSchema>;
export type ResourceFilters = z.infer<typeof resourceFiltersSchema>;

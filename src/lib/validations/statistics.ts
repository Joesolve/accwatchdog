import { z } from "zod";

export const periodTypeEnum = z.enum(["monthly", "quarterly", "yearly"]);

export const recoveryStatisticSchema = z.object({
  period: z.string().min(4).max(10), // e.g., "2024", "2024-Q1", "2024-01"
  periodType: periodTypeEnum,

  // Financial Recovery
  totalRecovered: z.number().min(0),
  cashRecovered: z.number().min(0).optional(),
  assetsRecovered: z.number().min(0).optional(),
  fundsToTreasury: z.number().min(0).optional(),

  // Case Statistics
  casesOpened: z.number().int().min(0).optional(),
  casesClosed: z.number().int().min(0).optional(),
  prosecutions: z.number().int().min(0).optional(),
  convictions: z.number().int().min(0).optional(),
  acquittals: z.number().int().min(0).optional(),

  // Property Statistics
  propertiesSeized: z.number().int().min(0).optional(),
  propertiesAuctioned: z.number().int().min(0).optional(),

  // Breakdowns (JSON)
  sectorBreakdown: z.record(z.string(), z.number()).optional(),
  regionBreakdown: z.record(z.string(), z.number()).optional(),
});

export const recoveryStatisticUpdateSchema = recoveryStatisticSchema.partial().extend({
  period: z.string().min(4).max(10).optional(),
  periodType: periodTypeEnum.optional(),
});

export const dashboardFiltersSchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  periodType: periodTypeEnum.optional(),
  region: z.string().optional(),
  sector: z.string().optional(),
});

export type RecoveryStatisticInput = z.infer<typeof recoveryStatisticSchema>;
export type RecoveryStatisticUpdate = z.infer<typeof recoveryStatisticUpdateSchema>;
export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>;

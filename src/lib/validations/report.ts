import { z } from "zod";

export const reportCategoryEnum = z.enum([
  "BRIBERY",
  "EMBEZZLEMENT",
  "FRAUD",
  "NEPOTISM",
  "ABUSE_OF_OFFICE",
  "PROCUREMENT_FRAUD",
  "EXTORTION",
  "MONEY_LAUNDERING",
  "OTHER",
]);

export const corruptionReportSchema = z
  .object({
    // Reporter Details (optional if anonymous)
    reporterName: z.string().min(2).max(100).optional(),
    reporterEmail: z.string().email().optional(),
    reporterPhone: z.string().min(8).max(20).optional(),
    isAnonymous: z.boolean().default(true),

    // Incident Details
    incidentDate: z.coerce.date().optional(),
    incidentLocation: z.string().max(500).optional(),
    region: z.string().optional(),

    // Accused Details
    accusedName: z.string().max(200).optional(),
    accusedPosition: z.string().max(200).optional(),
    accusedOrganization: z.string().max(200).optional(),

    // Report Details
    category: reportCategoryEnum.optional(),
    description: z
      .string()
      .min(50, "Please provide at least 50 characters describing the incident")
      .max(5000),
    estimatedAmount: z.number().min(0).optional(),

    // Evidence
    hasEvidence: z.boolean().default(false),
    evidenceDescription: z.string().max(2000).optional(),
  })
  .refine(
    (data) => {
      // If not anonymous, at least one contact method is required
      if (!data.isAnonymous) {
        return data.reporterEmail || data.reporterPhone;
      }
      return true;
    },
    {
      message: "Please provide at least an email or phone number for non-anonymous reports",
      path: ["reporterEmail"],
    }
  );

export const reportStatusEnum = z.enum([
  "RECEIVED",
  "UNDER_REVIEW",
  "INVESTIGATING",
  "CLOSED_SUBSTANTIATED",
  "CLOSED_UNSUBSTANTIATED",
  "REFERRED",
]);

export const reportPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const reportUpdateSchema = z.object({
  status: reportStatusEnum.optional(),
  priority: reportPriorityEnum.optional(),
  assignedToId: z.string().cuid().optional().nullable(),
  internalNotes: z.string().max(5000).optional(),
});

export type CorruptionReportInput = z.infer<typeof corruptionReportSchema>;
export type ReportUpdate = z.infer<typeof reportUpdateSchema>;

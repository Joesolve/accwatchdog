import { z } from "zod";

export const propertyTypeEnum = z.enum([
  "RESIDENTIAL",
  "COMMERCIAL",
  "LAND",
  "VEHICLE",
  "EQUIPMENT",
  "OTHER",
]);

export const propertyStatusEnum = z.enum([
  "AVAILABLE",
  "UNDER_AUCTION",
  "SOLD",
  "RESERVED",
  "WITHDRAWN",
]);

export const propertyFiltersSchema = z.object({
  type: propertyTypeEnum.optional(),
  status: propertyStatusEnum.optional(),
  region: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(12),
});

export const propertyCreateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z.string().min(20, "Description must be at least 20 characters"),
  type: propertyTypeEnum,
  status: propertyStatusEnum.default("AVAILABLE"),
  region: z.string().min(1, "Region is required"),
  district: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  estimatedValue: z.number().min(0, "Estimated value must be positive"),
  minimumBid: z.number().min(0).optional(),
  currency: z.string().default("SLE"),
  auctionDate: z.coerce.date().optional(),
  auctionVenue: z.string().optional(),
  auctionEndDate: z.coerce.date().optional(),
  size: z.string().optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  features: z.array(z.string()).default([]),
  caseReference: z.string().optional(),
  formerOwner: z.string().optional(),
  recoveryDate: z.coerce.date().optional(),
  isFeatured: z.boolean().default(false),
});

export const propertyUpdateSchema = propertyCreateSchema.partial();

export const expressionOfInterestSchema = z.object({
  propertyId: z.string().cuid("Invalid property ID"),
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number must be at least 8 digits").max(20),
  organization: z.string().max(200).optional(),
  address: z.string().max(500).optional(),
  nationality: z.string().min(1, "Nationality is required"),
  nin: z.string().optional(),
  passportNumber: z.string().optional(),
  intendedUse: z.string().max(500).optional(),
  proposedAmount: z.preprocess(
    (val) => (val === "" || val === undefined || Number.isNaN(val) ? undefined : Number(val)),
    z.number().min(0).optional()
  ),
  message: z.string().max(2000).optional(),
}).superRefine((data, ctx) => {
  if (data.nationality === "Sierra Leonean") {
    if (!data.nin || data.nin.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NIN must be at least 8 characters",
        path: ["nin"],
      });
    }
  } else if (data.nationality && data.nationality.length > 0) {
    if (!data.passportNumber || data.passportNumber.length < 5) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passport number must be at least 5 characters",
        path: ["passportNumber"],
      });
    }
  }
});

export type PropertyFilters = z.infer<typeof propertyFiltersSchema>;
export type PropertyCreate = z.infer<typeof propertyCreateSchema>;
export type PropertyUpdate = z.infer<typeof propertyUpdateSchema>;
export type ExpressionOfInterestInput = z.infer<typeof expressionOfInterestSchema>;

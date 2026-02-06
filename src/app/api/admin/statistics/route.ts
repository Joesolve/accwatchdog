import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const statisticCreateSchema = z.object({
  period: z.string().min(1, "Period is required"),
  periodType: z.enum(["monthly", "quarterly", "yearly"]),
  totalRecovered: z.number().min(0, "Total recovered must be positive"),
  cashRecovered: z.number().min(0).optional(),
  assetsRecovered: z.number().min(0).optional(),
  fundsToTreasury: z.number().min(0).optional(),
  casesOpened: z.number().int().min(0).optional(),
  casesClosed: z.number().int().min(0).optional(),
  prosecutions: z.number().int().min(0).optional(),
  convictions: z.number().int().min(0).optional(),
  acquittals: z.number().int().min(0).optional(),
  propertiesSeized: z.number().int().min(0).optional(),
  propertiesAuctioned: z.number().int().min(0).optional(),
  sectorBreakdown: z.record(z.number()).optional(),
  regionBreakdown: z.record(z.number()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = statisticCreateSchema.parse(body);

    // Check if period already exists
    const existing = await prisma.recoveryStatistic.findFirst({
      where: {
        period: validatedData.period,
        periodType: validatedData.periodType,
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Statistics for this period already exist" },
        { status: 400 }
      );
    }

    const statistic = await prisma.recoveryStatistic.create({
      data: {
        period: validatedData.period,
        periodType: validatedData.periodType,
        totalRecovered: validatedData.totalRecovered,
        cashRecovered: validatedData.cashRecovered,
        assetsRecovered: validatedData.assetsRecovered,
        fundsToTreasury: validatedData.fundsToTreasury,
        casesOpened: validatedData.casesOpened,
        casesClosed: validatedData.casesClosed,
        prosecutions: validatedData.prosecutions,
        convictions: validatedData.convictions,
        acquittals: validatedData.acquittals,
        propertiesSeized: validatedData.propertiesSeized,
        propertiesAuctioned: validatedData.propertiesAuctioned,
        sectorBreakdown: validatedData.sectorBreakdown,
        regionBreakdown: validatedData.regionBreakdown,
      },
    });

    return NextResponse.json({
      success: true,
      data: statistic,
    });
  } catch (error) {
    console.error("Error creating statistic:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create statistic" },
      { status: 500 }
    );
  }
}

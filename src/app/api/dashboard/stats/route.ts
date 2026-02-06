import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get aggregate statistics
    const statistics = await prisma.recoveryStatistic.findMany({
      orderBy: { period: "desc" },
      take: 10,
    });

    // Calculate totals from yearly statistics
    const yearlyStats = statistics.filter((s) => s.periodType === "yearly");

    const totalRecovered = yearlyStats.reduce(
      (sum, s) => sum + Number(s.totalRecovered),
      0
    );

    const fundsToTreasury = yearlyStats.reduce(
      (sum, s) => sum + Number(s.fundsToTreasury || 0),
      0
    );

    const totalConvictions = yearlyStats.reduce(
      (sum, s) => sum + (s.convictions || 0),
      0
    );

    const totalProsecutions = yearlyStats.reduce(
      (sum, s) => sum + (s.prosecutions || 0),
      0
    );

    const propertiesSeized = yearlyStats.reduce(
      (sum, s) => sum + (s.propertiesSeized || 0),
      0
    );

    const propertiesSold = yearlyStats.reduce(
      (sum, s) => sum + (s.propertiesAuctioned || 0),
      0
    );

    const casesResolved = yearlyStats.reduce(
      (sum, s) => sum + (s.casesClosed || 0),
      0
    );

    const convictionRate = totalProsecutions > 0
      ? Math.round((totalConvictions / totalProsecutions) * 100)
      : 0;

    // Get trend data
    const trendData = statistics
      .sort((a, b) => a.period.localeCompare(b.period))
      .map((s) => ({
        period: s.period,
        recovered: Number(s.totalRecovered),
        treasury: Number(s.fundsToTreasury || 0),
      }));

    // Get sector breakdown from the most recent year
    const latestYearly = yearlyStats[0];
    const sectorBreakdown = latestYearly?.sectorBreakdown
      ? Object.entries(latestYearly.sectorBreakdown as Record<string, number>).map(
          ([sector, amount]) => ({
            name: sector,
            value: amount,
          })
        )
      : [];

    // Get region breakdown
    const regionBreakdown = latestYearly?.regionBreakdown
      ? Object.entries(latestYearly.regionBreakdown as Record<string, number>).map(
          ([region, recovered]) => ({
            region,
            recovered,
            cases: Math.floor(recovered / 1e8), // Approximation
          })
        )
      : [];

    // Get prosecution outcomes by period
    const prosecutionOutcomes = statistics.map((s) => ({
      period: s.period,
      prosecutions: s.prosecutions || 0,
      convictions: s.convictions || 0,
      acquittals: s.acquittals || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalRecovered,
          fundsToTreasury,
          propertiesSeized,
          propertiesSold,
          convictionRate,
          casesResolved,
        },
        trendData,
        sectorBreakdown,
        regionBreakdown,
        prosecutionOutcomes,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}

import { Metadata } from "next";
import {
  Banknote,
  Building2,
  Scale,
  TrendingUp,
  Download,
  BarChart3,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { RecoveryTrendChart } from "@/components/dashboard/RecoveryTrendChart";
import { AssetBreakdownChart } from "@/components/dashboard/AssetBreakdownChart";
import { SectoralChart } from "@/components/dashboard/SectoralChart";
import { RegionalMap } from "@/components/dashboard/RegionalMap";
import { CaseOutcomesTable } from "@/components/dashboard/CaseOutcomesTable";

export const metadata: Metadata = {
  title: "Transparency Dashboard",
  description:
    "Explore interactive data on Sierra Leone's anti-corruption efforts, asset recovery, and prosecution outcomes.",
};

async function getDashboardData() {
  const statistics = await prisma.recoveryStatistic.findMany({
    orderBy: { period: "desc" },
  });

  const yearlyStats = statistics.filter((s) => s.periodType === "yearly");

  // Calculate totals
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

  // Trend data
  const trendData = statistics
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((s) => ({
      period: s.period,
      recovered: Number(s.totalRecovered),
      treasury: Number(s.fundsToTreasury || 0),
    }));

  // Sector breakdown
  const latestYearly = yearlyStats[0];
  const sectorBreakdown = latestYearly?.sectorBreakdown
    ? Object.entries(latestYearly.sectorBreakdown as Record<string, number>).map(
        ([sector, amount]) => ({
          sector,
          amount,
        })
      )
    : [];

  // Asset type breakdown (simulated - based on property counts)
  const propertyStats = await prisma.property.groupBy({
    by: ["type"],
    _count: true,
    _sum: { estimatedValue: true },
  });

  const assetTypeBreakdown = propertyStats.map((p) => ({
    name: p.type,
    value: Number(p._sum.estimatedValue || 0),
  }));

  // Region breakdown
  const regionBreakdown = latestYearly?.regionBreakdown
    ? Object.entries(latestYearly.regionBreakdown as Record<string, number>).map(
        ([region, recovered]) => ({
          region,
          recovered,
          cases: Math.floor(recovered / 5e8), // Approximation
        })
      )
    : [];

  // Prosecution outcomes
  const prosecutionOutcomes = statistics
    .filter((s) => s.prosecutions && s.prosecutions > 0)
    .map((s) => ({
      period: s.period,
      prosecutions: s.prosecutions || 0,
      convictions: s.convictions || 0,
      acquittals: s.acquittals || 0,
    }));

  return {
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
    assetTypeBreakdown,
    regionBreakdown,
    prosecutionOutcomes,
  };
}

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Transparency Dashboard</h1>
            <p className="text-muted-foreground">
              Real-time data on anti-corruption efforts in Sierra Leone
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <MetricCard
          title="Total Assets Recovered"
          value={formatCurrency(data.summary.totalRecovered)}
          description="Since 2019"
          icon={Banknote}
        />
        <MetricCard
          title="Funds to Treasury"
          value={formatCurrency(data.summary.fundsToTreasury)}
          description="Transferred to CRF"
          icon={TrendingUp}
        />
        <MetricCard
          title="Properties Recovered"
          value={data.summary.propertiesSeized}
          description={`${data.summary.propertiesSold} sold at auction`}
          icon={Building2}
        />
        <MetricCard
          title="Conviction Rate"
          value={`${data.summary.convictionRate}%`}
          description={`${data.summary.casesResolved} cases resolved`}
          icon={Scale}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <RecoveryTrendChart data={data.trendData} />
        <AssetBreakdownChart
          data={data.assetTypeBreakdown}
          title="Recovery by Asset Type"
          description="Distribution of recovered assets by category"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <SectoralChart data={data.sectorBreakdown} />
        <RegionalMap data={data.regionBreakdown} />
      </div>

      {/* Prosecution Outcomes Table */}
      <div className="mb-8">
        <CaseOutcomesTable data={data.prosecutionOutcomes} />
      </div>

      {/* Data Note */}
      <div className="bg-slate-50 rounded-lg p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Data is updated quarterly. Last updated: {new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          For detailed reports and methodology, please contact the Anti-Corruption Commission.
        </p>
      </div>
    </div>
  );
}

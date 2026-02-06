import Link from "next/link";
import { Plus, Edit, BarChart3 } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getStatistics() {
  return prisma.recoveryStatistic.findMany({
    orderBy: [{ periodType: "asc" }, { period: "desc" }],
  });
}

export default async function AdminStatisticsPage() {
  const statistics = await getStatistics();

  const yearlyStats = statistics.filter((s) => s.periodType === "yearly");
  const quarterlyStats = statistics.filter((s) => s.periodType === "quarterly");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recovery Statistics</h1>
          <p className="text-muted-foreground">Manage transparency dashboard data</p>
        </div>
        <Button asChild>
          <Link href="/admin/statistics/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Period
          </Link>
        </Button>
      </div>

      {/* Yearly Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Yearly Statistics
          </CardTitle>
          <CardDescription>Annual recovery and prosecution data</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Total Recovered</TableHead>
                <TableHead className="text-right">To Treasury</TableHead>
                <TableHead className="text-right">Cases Closed</TableHead>
                <TableHead className="text-right">Convictions</TableHead>
                <TableHead className="text-right">Conv. Rate</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearlyStats.map((stat) => {
                const convictionRate = stat.prosecutions
                  ? Math.round(((stat.convictions || 0) / stat.prosecutions) * 100)
                  : 0;
                return (
                  <TableRow key={stat.id}>
                    <TableCell className="font-medium">{stat.period}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(Number(stat.totalRecovered))}
                    </TableCell>
                    <TableCell className="text-right">
                      {stat.fundsToTreasury
                        ? formatCurrency(Number(stat.fundsToTreasury))
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">{stat.casesClosed || 0}</TableCell>
                    <TableCell className="text-right">{stat.convictions || 0}</TableCell>
                    <TableCell className="text-right">{convictionRate}%</TableCell>
                    <TableCell>
                      <div className="flex justify-end">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {yearlyStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No yearly statistics found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quarterly Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Quarterly Statistics</CardTitle>
          <CardDescription>Quarterly breakdown data</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Total Recovered</TableHead>
                <TableHead className="text-right">Cash</TableHead>
                <TableHead className="text-right">Assets</TableHead>
                <TableHead className="text-right">Properties Seized</TableHead>
                <TableHead className="text-right">Properties Auctioned</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quarterlyStats.map((stat) => (
                <TableRow key={stat.id}>
                  <TableCell className="font-medium">{stat.period}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(Number(stat.totalRecovered))}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.cashRecovered
                      ? formatCurrency(Number(stat.cashRecovered))
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.assetsRecovered
                      ? formatCurrency(Number(stat.assetsRecovered))
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.propertiesSeized || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.propertiesAuctioned || 0}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {quarterlyStats.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No quarterly statistics found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

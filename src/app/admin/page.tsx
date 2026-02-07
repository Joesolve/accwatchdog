export const dynamic = 'force-dynamic';

import Link from "next/link";
import {
  Building2,
  AlertTriangle,
  FileText,
  Users,
  TrendingUp,
  Calendar,
  Eye,
  ArrowRight,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

async function getAdminStats() {
  const [
    propertiesCount,
    pendingInterests,
    pendingReports,
    publishedCases,
    publishedNews,
    usersCount,
    recentProperties,
    recentReports,
  ] = await Promise.all([
    prisma.property.count({ where: { publishedAt: { not: null } } }),
    prisma.expressionOfInterest.count({ where: { status: "PENDING" } }),
    prisma.corruptionReport.count({ where: { status: "RECEIVED" } }),
    prisma.caseHighlight.count({ where: { status: "PUBLISHED" } }),
    prisma.newsUpdate.count({ where: { status: "PUBLISHED" } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        viewCount: true,
        createdAt: true,
      },
    }),
    prisma.corruptionReport.findMany({
      take: 5,
      where: { status: { in: ["RECEIVED", "UNDER_REVIEW"] } },
      orderBy: { submittedAt: "desc" },
      select: {
        id: true,
        referenceNumber: true,
        category: true,
        status: true,
        priority: true,
        submittedAt: true,
      },
    }),
  ]);

  // Get total recovered value
  const latestStats = await prisma.recoveryStatistic.findFirst({
    where: { periodType: "yearly" },
    orderBy: { period: "desc" },
  });

  return {
    propertiesCount,
    pendingInterests,
    pendingReports,
    publishedCases,
    publishedNews,
    usersCount,
    totalRecovered: latestStats ? Number(latestStats.totalRecovered) : 0,
    recentProperties,
    recentReports,
  };
}

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  AVAILABLE: "success",
  UNDER_AUCTION: "warning",
  SOLD: "secondary",
  RECEIVED: "warning",
  UNDER_REVIEW: "info" as "default",
  INVESTIGATING: "default",
};

const priorityColors: Record<string, string> = {
  LOW: "text-slate-500",
  MEDIUM: "text-blue-500",
  HIGH: "text-orange-500",
  URGENT: "text-red-500",
};

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of the ACC Transparency Platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Recovered</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(stats.totalRecovered)}
            </div>
            <p className="text-xs text-muted-foreground">Latest yearly figure</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.propertiesCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingInterests} pending interests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.publishedCases + stats.publishedNews}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedCases} cases, {stats.publishedNews} news
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Properties</CardTitle>
              <CardDescription>Latest property listings</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/properties">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{property.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(property.createdAt)}
                      <Eye className="h-3 w-3 ml-2" />
                      {property.viewCount}
                    </div>
                  </div>
                  <Badge variant={statusColors[property.status]}>
                    {property.status}
                  </Badge>
                </div>
              ))}
              {stats.recentProperties.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No properties yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Reports</CardTitle>
              <CardDescription>Corruption reports awaiting review</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/reports">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-sm font-medium">
                      {report.referenceNumber}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{report.category || "Uncategorized"}</span>
                      <span className={priorityColors[report.priority]}>
                        {report.priority}
                      </span>
                    </div>
                  </div>
                  <Badge variant={statusColors[report.status] || "secondary"}>
                    {report.status.replace("_", " ")}
                  </Badge>
                </div>
              ))}
              {stats.recentReports.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pending reports
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Button variant="outline" className="h-auto py-4" asChild>
              <Link href="/admin/properties/new" className="flex flex-col items-center gap-2">
                <Building2 className="h-6 w-6" />
                <span>Add Property</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4" asChild>
              <Link href="/admin/statistics" className="flex flex-col items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                <span>Update Statistics</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4" asChild>
              <Link href="/admin/reports" className="flex flex-col items-center gap-2">
                <AlertTriangle className="h-6 w-6" />
                <span>Review Reports</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4" asChild>
              <Link href="/admin/news" className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <span>Publish News</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

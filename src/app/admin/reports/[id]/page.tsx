import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertTriangle,
  MapPin,
  Calendar,
  User,
  Building2,
  FileText,
  Shield,
  Clock,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ReportActions } from "@/components/admin/ReportActions";

interface ReportPageProps {
  params: { id: string };
}

async function getReport(id: string) {
  const report = await prisma.corruptionReport.findUnique({
    where: { id },
    include: {
      assignedTo: {
        select: { id: true, name: true, email: true },
      },
      attachments: true,
    },
  });

  if (!report) return null;

  // Convert Decimal to number for client components
  return {
    ...report,
    estimatedAmount: report.estimatedAmount ? Number(report.estimatedAmount) : null,
  };
}

async function getUsers() {
  return prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  });
}

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  RECEIVED: "warning",
  UNDER_REVIEW: "default",
  INVESTIGATING: "default",
  CLOSED_SUBSTANTIATED: "success",
  CLOSED_UNSUBSTANTIATED: "secondary",
  REFERRED: "secondary",
};

const priorityColors: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-700",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-orange-100 text-orange-700",
  URGENT: "bg-red-100 text-red-700",
};

export default async function ReportDetailPage({ params }: ReportPageProps) {
  const [report, users] = await Promise.all([
    getReport(params.id),
    getUsers(),
  ]);

  if (!report) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{report.referenceNumber}</h1>
              <Badge variant={statusColors[report.status]}>
                {report.status.replace(/_/g, " ")}
              </Badge>
              <Badge className={priorityColors[report.priority]}>
                {report.priority}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Submitted {formatDate(report.submittedAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Report Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Report Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {report.category && (
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{report.category}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="whitespace-pre-wrap mt-1">{report.description}</p>
              </div>

              {report.estimatedAmount && (
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Amount Involved</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(report.estimatedAmount)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Accused Details */}
          {(report.accusedName || report.accusedPosition || report.accusedOrganization) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Accused Party
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {report.accusedName && (
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{report.accusedName}</p>
                  </div>
                )}
                {report.accusedPosition && (
                  <div>
                    <p className="text-sm text-muted-foreground">Position</p>
                    <p className="font-medium">{report.accusedPosition}</p>
                  </div>
                )}
                {report.accusedOrganization && (
                  <div>
                    <p className="text-sm text-muted-foreground">Organization</p>
                    <p className="font-medium">{report.accusedOrganization}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Incident Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {report.incidentDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Incident Date</p>
                    <p className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(report.incidentDate)}
                    </p>
                  </div>
                )}
                {report.region && (
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium">{report.region}</p>
                  </div>
                )}
              </div>
              {report.incidentLocation && (
                <div>
                  <p className="text-sm text-muted-foreground">Location Details</p>
                  <p className="font-medium">{report.incidentLocation}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evidence */}
          {report.hasEvidence && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {report.evidenceDescription && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description of Evidence</p>
                    <p className="whitespace-pre-wrap mt-1">{report.evidenceDescription}</p>
                  </div>
                )}

                {report.attachments && report.attachments.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Attachments</p>
                    <div className="space-y-2">
                      {report.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg border hover:bg-slate-50 transition-colors"
                        >
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1">{attachment.fileName}</span>
                          <span className="text-xs text-muted-foreground">
                            {(attachment.fileSize / 1024).toFixed(1)} KB
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Internal Notes */}
          {report.internalNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Internal Notes
                </CardTitle>
                <CardDescription>Only visible to admin staff</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{report.internalNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <ReportActions report={report} users={users} />

          {/* Reporter Information */}
          <Card>
            <CardHeader>
              <CardTitle>Reporter Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.isAnonymous ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Anonymous Report</span>
                </div>
              ) : (
                <>
                  {report.reporterName && (
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{report.reporterName}</p>
                    </div>
                  )}
                  {report.reporterEmail && (
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{report.reporterEmail}</p>
                    </div>
                  )}
                  {report.reporterPhone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{report.reporterPhone}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Assignment */}
          <Card>
            <CardHeader>
              <CardTitle>Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              {report.assignedTo ? (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                    {report.assignedTo.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{report.assignedTo.name}</p>
                    <p className="text-sm text-muted-foreground">{report.assignedTo.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">Not yet assigned</p>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Submitted</p>
                <p className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatDate(report.submittedAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(report.updatedAt)}</p>
              </div>
              {report.ipAddress && (
                <div>
                  <p className="text-sm text-muted-foreground">IP Address</p>
                  <p className="font-mono text-sm">{report.ipAddress}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Banknote,
  Scale,
  User,
  FileText,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CasePageProps {
  params: { slug: string };
}

async function getCase(slug: string) {
  return prisma.caseHighlight.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

export async function generateMetadata({
  params,
}: CasePageProps): Promise<Metadata> {
  const caseData = await prisma.caseHighlight.findFirst({
    where: { slug: params.slug },
    select: { title: true, summary: true },
  });

  if (!caseData) {
    return { title: "Case Not Found" };
  }

  return {
    title: caseData.title,
    description: caseData.summary,
  };
}

export default async function CaseDetailPage({ params }: CasePageProps) {
  const caseData = await getCase(params.slug);

  if (!caseData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/cases">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Cases
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {caseData.verdict && (
                <Badge
                  variant={
                    caseData.verdict.toLowerCase().includes("guilty")
                      ? "success"
                      : "secondary"
                  }
                  className="text-sm"
                >
                  {caseData.verdict}
                </Badge>
              )}
              {caseData.sector && (
                <Badge variant="outline">{caseData.sector}</Badge>
              )}
              {caseData.region && (
                <Badge variant="outline">{caseData.region}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-4">{caseData.title}</h1>
            <p className="text-lg text-muted-foreground">{caseData.summary}</p>
          </div>

          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: caseData.content }}
              />
            </CardContent>
          </Card>

          {/* Charges */}
          {caseData.charges && caseData.charges.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Charges
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {caseData.charges.map((charge, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {charge}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Case Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Case Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {caseData.caseNumber && (
                <div>
                  <p className="text-sm text-muted-foreground">Case Number</p>
                  <p className="font-mono font-medium">{caseData.caseNumber}</p>
                </div>
              )}

              {caseData.defendant && (
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Defendant</p>
                    <p className="font-medium">{caseData.defendant}</p>
                  </div>
                </div>
              )}

              {caseData.caseDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Case Filed</p>
                    <p className="font-medium">{formatDate(caseData.caseDate)}</p>
                  </div>
                </div>
              )}

              {caseData.verdictDate && (
                <div className="flex items-start gap-3">
                  <Scale className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Verdict Date</p>
                    <p className="font-medium">{formatDate(caseData.verdictDate)}</p>
                  </div>
                </div>
              )}

              {caseData.region && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{caseData.region}</p>
                  </div>
                </div>
              )}

              {caseData.sentence && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground">Sentence</p>
                    <p className="font-medium text-primary">{caseData.sentence}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Financial Impact Card */}
          {(caseData.amountInvolved || caseData.amountRecovered) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-primary" />
                  Financial Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {caseData.amountInvolved && (
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Involved</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(Number(caseData.amountInvolved))}
                    </p>
                  </div>
                )}

                {caseData.amountRecovered && (
                  <div>
                    <p className="text-sm text-muted-foreground">Amount Recovered</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatCurrency(Number(caseData.amountRecovered))}
                    </p>
                    {caseData.amountInvolved && (
                      <p className="text-sm text-muted-foreground">
                        Recovery Rate:{" "}
                        {Math.round(
                          (Number(caseData.amountRecovered) /
                            Number(caseData.amountInvolved)) *
                            100
                        )}
                        %
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Report CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Report Corruption</h3>
              <p className="text-sm opacity-90 mb-4">
                If you have information about corrupt activities, you can submit
                an anonymous report.
              </p>
              <Link href="/report-corruption">
                <Button variant="secondary" className="w-full">
                  Submit a Report
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

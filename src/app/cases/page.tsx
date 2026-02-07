export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import Link from "next/link";
import { Scale, Calendar, MapPin, Banknote, ArrowRight } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Case Highlights",
  description:
    "Explore significant corruption cases prosecuted by the Anti-Corruption Commission of Sierra Leone.",
};

async function getCases() {
  const cases = await prisma.caseHighlight.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return cases;
}

export default async function CasesPage() {
  const cases = await getCases();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Scale className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Case Highlights</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Learn about significant corruption cases prosecuted by the ACC. These cases
          demonstrate our commitment to holding corrupt officials accountable.
        </p>
      </div>

      {/* Cases Grid */}
      {cases.length === 0 ? (
        <div className="text-center py-12">
          <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No cases published yet</h3>
          <p className="text-muted-foreground">Check back soon for case highlights.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((caseItem) => (
            <Link key={caseItem.id} href={`/cases/${caseItem.slug}`}>
              <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {caseItem.verdict && (
                      <Badge
                        variant={
                          caseItem.verdict.toLowerCase().includes("guilty")
                            ? "success"
                            : "secondary"
                        }
                      >
                        {caseItem.verdict}
                      </Badge>
                    )}
                    {caseItem.sector && (
                      <Badge variant="outline">{caseItem.sector}</Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{caseItem.title}</CardTitle>
                  <CardDescription className="line-clamp-3">
                    {caseItem.summary}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {caseItem.amountInvolved && (
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Amount Involved</p>
                          <p className="text-sm font-medium">
                            {formatCurrency(Number(caseItem.amountInvolved))}
                          </p>
                        </div>
                      </div>
                    )}
                    {caseItem.amountRecovered && (
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-primary" />
                        <div>
                          <p className="text-xs text-muted-foreground">Recovered</p>
                          <p className="text-sm font-medium text-primary">
                            {formatCurrency(Number(caseItem.amountRecovered))}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      {caseItem.verdictDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(caseItem.verdictDate)}
                        </span>
                      )}
                      {caseItem.region && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {caseItem.region}
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

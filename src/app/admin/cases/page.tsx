import Link from "next/link";
import { Plus, Edit, Eye, Trash2, Scale } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

async function getCases() {
  return prisma.caseHighlight.findMany({
    orderBy: { createdAt: "desc" },
  });
}

const statusColors: Record<string, "default" | "secondary" | "success"> = {
  DRAFT: "secondary",
  PUBLISHED: "success",
  ARCHIVED: "default",
};

export default async function AdminCasesPage() {
  const cases = await getCases();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Highlights</h1>
          <p className="text-muted-foreground">Manage corruption case stories</p>
        </div>
        <Button asChild>
          <Link href="/admin/cases/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Case
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Cases</CardTitle>
          <CardDescription>{cases.length} cases in total</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Verdict</TableHead>
                <TableHead className="text-right">Amount Involved</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((caseItem) => (
                <TableRow key={caseItem.id}>
                  <TableCell>
                    <div className="max-w-[250px] truncate font-medium">
                      {caseItem.title}
                    </div>
                  </TableCell>
                  <TableCell>{caseItem.sector || "N/A"}</TableCell>
                  <TableCell>
                    {caseItem.verdict ? (
                      <Badge
                        variant={
                          caseItem.verdict.toLowerCase().includes("guilty")
                            ? "success"
                            : "secondary"
                        }
                      >
                        {caseItem.verdict}
                      </Badge>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {caseItem.amountInvolved
                      ? formatCurrency(Number(caseItem.amountInvolved))
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[caseItem.status]}>
                      {caseItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(caseItem.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/cases/${caseItem.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/cases/${caseItem.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {cases.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <Scale className="h-8 w-8 mx-auto mb-2" />
                    No cases found. Add your first case highlight.
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

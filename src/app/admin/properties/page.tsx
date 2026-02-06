import Link from "next/link";
import { Plus, Search, Eye, Edit, Trash2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

async function getProperties() {
  return prisma.property.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { expressionsOfInterest: true },
      },
    },
  });
}

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  AVAILABLE: "success",
  UNDER_AUCTION: "warning",
  SOLD: "secondary",
  RESERVED: "default",
  WITHDRAWN: "destructive",
};

export default async function AdminPropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">Manage property listings and auctions</p>
        </div>
        <Button asChild>
          <Link href="/admin/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search properties..." className="pl-9" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Properties</CardTitle>
          <CardDescription>{properties.length} properties in total</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reference</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Views</TableHead>
                <TableHead className="text-center">Interests</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-mono text-sm">
                    {property.referenceNumber}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate font-medium">
                      {property.title}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(property.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>{property.type}</TableCell>
                  <TableCell>{property.region}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(Number(property.estimatedValue))}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[property.status]}>
                      {property.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{property.viewCount}</TableCell>
                  <TableCell className="text-center">
                    {property._count.expressionsOfInterest}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/properties/${property.slug}`} target="_blank">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/properties/${property.id}/edit`}>
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
              {properties.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No properties found. Add your first property.
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

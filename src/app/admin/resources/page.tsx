export const dynamic = 'force-dynamic';

import Link from "next/link";
import { Plus, Edit, Eye, Trash2, BookOpen, Video, FileText, Image } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
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

async function getResources() {
  return prisma.educationalResource.findMany({
    orderBy: { createdAt: "desc" },
  });
}

const statusColors: Record<string, "default" | "secondary" | "success"> = {
  DRAFT: "secondary",
  PUBLISHED: "success",
  ARCHIVED: "default",
};

const typeIcons: Record<string, typeof FileText> = {
  ARTICLE: FileText,
  VIDEO: Video,
  PDF: FileText,
  INFOGRAPHIC: Image,
};

export default async function AdminResourcesPage() {
  const resources = await getResources();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Educational Resources</h1>
          <p className="text-muted-foreground">Manage learning materials and guides</p>
        </div>
        <Button asChild>
          <Link href="/admin/resources/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Resources</CardTitle>
          <CardDescription>{resources.length} resources in total</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Downloads</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resources.map((resource) => {
                const TypeIcon = typeIcons[resource.resourceType] || FileText;
                return (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="max-w-[250px] truncate font-medium">
                          {resource.title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{resource.category}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{resource.resourceType}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{resource.downloadCount}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[resource.status]}>
                        {resource.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(resource.createdAt)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/resources/${resource.slug}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/resources/${resource.id}/edit`}>
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {resources.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-8 w-8 mx-auto mb-2" />
                    No resources found. Add your first educational resource.
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

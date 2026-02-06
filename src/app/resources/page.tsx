import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  ArrowRight,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Educational Resources",
  description:
    "Access educational materials about corruption prevention, anti-corruption laws, and how to report corrupt activities.",
};

async function getResources() {
  const resources = await prisma.educationalResource.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return resources;
}

const typeIcons: Record<string, typeof FileText> = {
  ARTICLE: FileText,
  VIDEO: Video,
  PDF: Download,
  INFOGRAPHIC: ImageIcon,
};

const typeLabels: Record<string, string> = {
  ARTICLE: "Article",
  VIDEO: "Video",
  PDF: "PDF Document",
  INFOGRAPHIC: "Infographic",
};

export default async function ResourcesPage() {
  const resources = await getResources();

  // Group resources by category
  const resourcesByCategory = resources.reduce((acc, resource) => {
    const category = resource.category || "General";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Educational Resources</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Learn about corruption, anti-corruption laws, and how you can contribute to
          building a more transparent Sierra Leone.
        </p>
      </div>

      {/* Resource Categories */}
      {Object.keys(resourcesByCategory).length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No resources available yet</h3>
          <p className="text-muted-foreground">Check back soon for educational materials.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(resourcesByCategory).map(([category, categoryResources]) => (
            <section key={category}>
              <h2 className="text-2xl font-semibold mb-6">{category}</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryResources.map((resource) => {
                  const TypeIcon = typeIcons[resource.resourceType] || FileText;
                  const isDownloadable = resource.resourceType === "PDF" && resource.fileUrl;
                  const isVideo = resource.resourceType === "VIDEO" && resource.videoUrl;

                  return (
                    <Card key={resource.id} className="h-full flex flex-col">
                      <CardHeader>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                            <TypeIcon className="h-4 w-4 text-primary" />
                          </div>
                          <Badge variant="outline">
                            {typeLabels[resource.resourceType]}
                          </Badge>
                        </div>
                        <CardTitle className="line-clamp-2">{resource.title}</CardTitle>
                        <CardDescription className="line-clamp-3">
                          {resource.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto">
                        {isDownloadable ? (
                          <a href={resource.fileUrl!} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full gap-2">
                              <Download className="h-4 w-4" />
                              Download PDF
                            </Button>
                          </a>
                        ) : isVideo ? (
                          <a href={resource.videoUrl!} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="w-full gap-2">
                              <Video className="h-4 w-4" />
                              Watch Video
                            </Button>
                          </a>
                        ) : (
                          <Link href={`/resources/${resource.slug}`}>
                            <Button variant="outline" className="w-full gap-2">
                              Read Article
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}

                        {resource.downloadCount > 0 && (
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            {resource.downloadCount} downloads
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <div className="mt-16 bg-slate-50 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Need More Information?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          If you have questions about corruption, our anti-corruption efforts, or need
          additional resources, please don't hesitate to contact us.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/report-corruption">Report Corruption</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

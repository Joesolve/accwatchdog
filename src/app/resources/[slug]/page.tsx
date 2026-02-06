import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BookOpen, Download, Video } from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ResourcePageProps {
  params: { slug: string };
}

async function getResource(slug: string) {
  return prisma.educationalResource.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

async function getRelatedResources(currentId: string, category: string) {
  return prisma.educationalResource.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: currentId },
      category,
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const resource = await prisma.educationalResource.findFirst({
    where: { slug: params.slug },
    select: { title: true, description: true },
  });

  if (!resource) {
    return { title: "Resource Not Found" };
  }

  return {
    title: resource.title,
    description: resource.description,
  };
}

export default async function ResourceDetailPage({ params }: ResourcePageProps) {
  const resource = await getResource(params.slug);

  if (!resource) {
    notFound();
  }

  const relatedResources = await getRelatedResources(resource.id, resource.category);

  // Increment download count for tracking
  await prisma.educationalResource.update({
    where: { id: resource.id },
    data: { downloadCount: { increment: 1 } },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/resources">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Resources
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {resource.featuredImage && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={resource.featuredImage}
                alt={resource.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary">{resource.category}</Badge>
              <Badge variant="outline">{resource.resourceType}</Badge>
            </div>
            <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
            <p className="text-lg text-muted-foreground">{resource.description}</p>
          </div>

          {/* Video Embed */}
          {resource.resourceType === "VIDEO" && resource.videoUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
              <iframe
                src={resource.videoUrl.replace("watch?v=", "embed/")}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* PDF Download */}
          {resource.resourceType === "PDF" && resource.fileUrl && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                      <Download className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">Download PDF Document</p>
                      <p className="text-sm text-muted-foreground">
                        Click to download this resource
                      </p>
                    </div>
                  </div>
                  <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Button className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Content */}
          {resource.content && (
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: resource.content }}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related Resources */}
          {relatedResources.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Related Resources</h3>
                <div className="space-y-4">
                  {relatedResources.map((related) => (
                    <Link key={related.id} href={`/resources/${related.slug}`}>
                      <div className="group flex items-start gap-3">
                        <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {related.resourceType === "VIDEO" ? (
                            <Video className="h-4 w-4 text-primary" />
                          ) : related.resourceType === "PDF" ? (
                            <Download className="h-4 w-4 text-primary" />
                          ) : (
                            <BookOpen className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                            {related.title}
                          </p>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {related.resourceType}
                          </Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Report CTA */}
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">See Something Wrong?</h3>
              <p className="text-sm opacity-90 mb-4">
                If you have information about corrupt activities, submit an anonymous report.
              </p>
              <Link href="/report-corruption">
                <Button variant="secondary" className="w-full">
                  Report Corruption
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Explore More</h3>
              <div className="space-y-2">
                <Link
                  href="/cases"
                  className="block text-sm hover:text-primary transition-colors"
                >
                  Case Highlights
                </Link>
                <Link
                  href="/news"
                  className="block text-sm hover:text-primary transition-colors"
                >
                  News & Updates
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-sm hover:text-primary transition-colors"
                >
                  Transparency Dashboard
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

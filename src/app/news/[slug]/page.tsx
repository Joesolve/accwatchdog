import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NewsletterSubscribe } from "@/components/NewsletterSubscribe";

interface NewsPageProps {
  params: { slug: string };
}

async function getNewsArticle(slug: string) {
  return prisma.newsUpdate.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
}

async function getRelatedNews(currentId: string, category: string | null) {
  return prisma.newsUpdate.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: currentId },
      ...(category ? { category } : {}),
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const article = await prisma.newsUpdate.findFirst({
    where: { slug: params.slug },
    select: { title: true, excerpt: true },
  });

  if (!article) {
    return { title: "Article Not Found" };
  }

  return {
    title: article.title,
    description: article.excerpt || article.title,
  };
}

export default async function NewsDetailPage({ params }: NewsPageProps) {
  const article = await getNewsArticle(params.slug);

  if (!article) {
    notFound();
  }

  const relatedNews = await getRelatedNews(article.id, article.category);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/news">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Featured Image */}
          {article.featuredImage && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Header */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {article.category && (
                <Badge variant="secondary">{article.category}</Badge>
              )}
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {article.publishedAt && formatDate(article.publishedAt)}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
            {article.excerpt && (
              <p className="text-lg text-muted-foreground">{article.excerpt}</p>
            )}
          </div>

          <Separator />

          {/* Content */}
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <>
              <Separator />
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Tag className="h-4 w-4" />
                  Tags:
                </span>
                {article.tags.map((tag, idx) => (
                  <Badge key={idx} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </>
          )}

          {/* Share */}
          <div className="flex items-center gap-4 pt-4">
            <span className="text-sm text-muted-foreground">Share this article:</span>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Related News */}
          {relatedNews.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Related News</h3>
                <div className="space-y-4">
                  {relatedNews.map((news) => (
                    <Link key={news.id} href={`/news/${news.slug}`}>
                      <div className="group">
                        <p className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                          {news.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {news.publishedAt && formatDate(news.publishedAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subscribe CTA */}
          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Stay Updated</h3>
              <p className="text-sm opacity-90 mb-4">
                Get the latest news and updates from the ACC delivered to your inbox.
              </p>
              <NewsletterSubscribe variant="sidebar" />
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/properties"
                  className="block text-sm hover:text-primary transition-colors"
                >
                  Property Auctions
                </Link>
                <Link
                  href="/dashboard"
                  className="block text-sm hover:text-primary transition-colors"
                >
                  Transparency Dashboard
                </Link>
                <Link
                  href="/cases"
                  className="block text-sm hover:text-primary transition-colors"
                >
                  Case Highlights
                </Link>
                <Link
                  href="/report-corruption"
                  className="block text-sm hover:text-primary transition-colors"
                >
                  Report Corruption
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Newspaper, Calendar, ArrowRight, Tag } from "lucide-react";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "News & Updates",
  description:
    "Stay informed about the latest news and updates from the Anti-Corruption Commission of Sierra Leone.",
};

async function getNews() {
  const news = await prisma.newsUpdate.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return news;
}

export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Newspaper className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">News & Updates</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Stay informed about the latest developments, announcements, and achievements
          of the Anti-Corruption Commission.
        </p>
      </div>

      {/* News Grid */}
      {news.length === 0 ? (
        <div className="text-center py-12">
          <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No news articles yet</h3>
          <p className="text-muted-foreground">Check back soon for updates.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {news.map((article, index) => (
            <Link key={article.id} href={`/news/${article.slug}`}>
              <Card
                className={`h-full transition-all hover:shadow-lg hover:-translate-y-1 ${
                  index === 0 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                {article.featuredImage && (
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <Image
                      src={article.featuredImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    {article.category && (
                      <Badge variant="secondary">{article.category}</Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                  {article.excerpt && (
                    <CardDescription className="line-clamp-3">
                      {article.excerpt}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {article.publishedAt && formatDate(article.publishedAt)}
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.slice(0, 3).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs text-muted-foreground flex items-center gap-1"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

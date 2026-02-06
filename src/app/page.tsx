import Link from "next/link";
import {
  ArrowRight,
  Building2,
  BarChart3,
  FileText,
  AlertTriangle,
  TrendingUp,
  Users,
  Banknote,
  Scale,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PropertyCard } from "@/components/properties/PropertyCard";

const stats = [
  {
    label: "Total Recovered",
    value: "Le 50B+",
    description: "Assets recovered since 2019",
    icon: Banknote,
  },
  {
    label: "Properties Auctioned",
    value: "150+",
    description: "Recovered properties sold",
    icon: Building2,
  },
  {
    label: "Conviction Rate",
    value: "87%",
    description: "Successful prosecutions",
    icon: Scale,
  },
  {
    label: "Cases Resolved",
    value: "500+",
    description: "Corruption cases handled",
    icon: Users,
  },
];

const features = [
  {
    title: "Property Auctions",
    description:
      "Browse and bid on recovered assets including real estate, vehicles, and equipment seized from corruption cases.",
    icon: Building2,
    href: "/properties",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Transparency Dashboard",
    description:
      "Explore interactive charts and data on asset recovery, prosecution outcomes, and anti-corruption efforts.",
    icon: BarChart3,
    href: "/dashboard",
    color: "bg-secondary/10 text-secondary",
  },
  {
    title: "Case Highlights",
    description:
      "Read about significant corruption cases, their outcomes, and the impact on Sierra Leone's fight against corruption.",
    icon: FileText,
    href: "/cases",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    title: "Report Corruption",
    description:
      "Submit anonymous reports of suspected corruption. Your identity is protected and all reports are investigated.",
    icon: AlertTriangle,
    href: "/report-corruption",
    color: "bg-red-500/10 text-red-600",
  },
];

async function getFeaturedProperties() {
  const properties = await prisma.property.findMany({
    where: {
      publishedAt: { not: null },
      status: { in: ["AVAILABLE", "UNDER_AUCTION"] },
    },
    include: {
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
        take: 1,
      },
    },
    orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    take: 3,
  });
  return properties;
}

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary/90 to-secondary py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Building a Transparent Sierra Leone
            </h1>
            <p className="mt-6 text-lg text-white/90 sm:text-xl">
              The Anti-Corruption Commission is committed to fighting corruption
              and recovering stolen assets for the people of Sierra Leone. Explore
              our transparency platform to see our progress.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/properties">
                <Button size="lg" variant="secondary" className="gap-2">
                  View Property Auctions
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20"
                >
                  Explore Dashboard
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-slate-50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="font-medium text-foreground">{stat.label}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Transparency Tools
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Access comprehensive information about asset recovery, anti-corruption
              efforts, and public resources.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Link key={feature.title} href={feature.href}>
                <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <span className="inline-flex items-center text-sm font-medium text-primary">
                      Learn more
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 py-16">
        <div className="container mx-auto px-4 text-center">
          <TrendingUp className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Help Us Fight Corruption
          </h2>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Your reports matter. If you have information about corrupt practices,
            you can submit an anonymous report. Together, we can build a more
            transparent Sierra Leone.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/report-corruption">
              <Button size="lg" className="gap-2">
                Report Corruption
                <AlertTriangle className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="lg" variant="secondary" className="gap-2">
                Learn About Corruption
                <FileText className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Auctions Preview */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Properties
              </h2>
              <p className="mt-2 text-muted-foreground">
                Recently listed recovered assets available for auction
              </p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="gap-2">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.length > 0 ? (
              featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No properties available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

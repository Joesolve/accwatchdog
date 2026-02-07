export const dynamic = 'force-dynamic';

import { Suspense } from "react";
import { Metadata } from "next";
import { Building2, Grid3X3, List } from "lucide-react";
import prisma from "@/lib/prisma";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Property Auctions",
  description:
    "Browse recovered assets available for auction including real estate, vehicles, and equipment seized from corruption cases in Sierra Leone.",
};

interface PropertyPageProps {
  searchParams: {
    type?: string;
    status?: string;
    region?: string;
    minPrice?: string;
    maxPrice?: string;
    search?: string;
    page?: string;
  };
}

async function getProperties(searchParams: PropertyPageProps["searchParams"]) {
  const page = parseInt(searchParams.page || "1");
  const limit = 12;

  const where: Prisma.PropertyWhereInput = {
    publishedAt: { not: null },
  };

  if (searchParams.type) {
    where.type = searchParams.type as Prisma.EnumPropertyTypeFilter;
  }

  if (searchParams.status) {
    where.status = searchParams.status as Prisma.EnumPropertyStatusFilter;
  }

  if (searchParams.region) {
    where.region = searchParams.region;
  }

  if (searchParams.minPrice || searchParams.maxPrice) {
    where.estimatedValue = {};
    if (searchParams.minPrice) {
      where.estimatedValue.gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice) {
      where.estimatedValue.lte = parseFloat(searchParams.maxPrice);
    }
  }

  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
      { referenceNumber: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        images: {
          orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
          take: 1,
        },
      },
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

function PropertyGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-lg border overflow-hidden">
          <Skeleton className="aspect-[4/3]" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Pagination({
  pagination,
  searchParams,
}: {
  pagination: { total: number; page: number; totalPages: number };
  searchParams: PropertyPageProps["searchParams"];
}) {
  const createPageUrl = (pageNum: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") {
        params.set(key, value);
      }
    });
    params.set("page", pageNum.toString());
    return `/properties?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-between border-t pt-4 mt-8">
      <p className="text-sm text-muted-foreground">
        Showing {(pagination.page - 1) * 12 + 1} to{" "}
        {Math.min(pagination.page * 12, pagination.total)} of {pagination.total} properties
      </p>
      <div className="flex gap-2">
        {pagination.page > 1 && (
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl(pagination.page - 1)}>Previous</a>
          </Button>
        )}
        {pagination.page < pagination.totalPages && (
          <Button variant="outline" size="sm" asChild>
            <a href={createPageUrl(pagination.page + 1)}>Next</a>
          </Button>
        )}
      </div>
    </div>
  );
}

export default async function PropertiesPage({ searchParams }: PropertyPageProps) {
  const { properties, pagination } = await getProperties(searchParams);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Property Auctions</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Browse recovered assets available for auction. These properties were seized from
          corruption cases and are being sold to return funds to the people of Sierra Leone.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <Suspense fallback={<Skeleton className="h-10 w-full" />}>
          <PropertyFilters />
        </Suspense>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">
          {pagination.total} {pagination.total === 1 ? "property" : "properties"} found
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Property Grid */}
      <Suspense fallback={<PropertyGridSkeleton />}>
        {properties.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No properties found</h3>
            <p className="text-muted-foreground">
              Try adjusting your filters or check back later for new listings.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </Suspense>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination pagination={pagination} searchParams={searchParams} />
      )}
    </div>
  );
}

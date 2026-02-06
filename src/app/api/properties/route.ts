import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { propertyFiltersSchema } from "@/lib/validations/property";
import type { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = Object.fromEntries(searchParams.entries());

    // Validate and parse query params
    const validatedParams = propertyFiltersSchema.parse(params);
    const { type, status, region, minPrice, maxPrice, search, page, limit } = validatedParams;

    // Build where clause
    const where: Prisma.PropertyWhereInput = {
      publishedAt: { not: null },
    };

    if (type) {
      where.type = type;
    }

    if (status) {
      where.status = status;
    }

    if (region) {
      where.region = region;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.estimatedValue = {};
      if (minPrice !== undefined) {
        where.estimatedValue.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.estimatedValue.lte = maxPrice;
      }
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { referenceNumber: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count
    const total = await prisma.property.count({ where });

    // Get properties with pagination
    const properties = await prisma.property.findMany({
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
    });

    return NextResponse.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

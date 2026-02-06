import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";

const newsCreateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().optional(),
  content: z.string().min(50, "Content must be at least 50 characters"),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  featuredImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = newsCreateSchema.parse(body);

    const news = await prisma.newsUpdate.create({
      data: {
        slug: generateSlug(validatedData.title),
        title: validatedData.title,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        category: validatedData.category,
        tags: validatedData.tags,
        featuredImage: validatedData.featuredImage,
        status: validatedData.status,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Error creating news:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create news" },
      { status: 500 }
    );
  }
}

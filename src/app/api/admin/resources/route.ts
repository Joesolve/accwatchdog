import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";

const resourceCreateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  content: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  resourceType: z.enum(["ARTICLE", "VIDEO", "PDF", "INFOGRAPHIC"]),
  featuredImage: z.string().optional(),
  fileUrl: z.string().optional(),
  videoUrl: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resourceCreateSchema.parse(body);

    const resource = await prisma.educationalResource.create({
      data: {
        slug: generateSlug(validatedData.title),
        title: validatedData.title,
        description: validatedData.description,
        content: validatedData.content,
        category: validatedData.category,
        resourceType: validatedData.resourceType,
        featuredImage: validatedData.featuredImage,
        fileUrl: validatedData.fileUrl,
        videoUrl: validatedData.videoUrl,
        status: validatedData.status,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error("Error creating resource:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

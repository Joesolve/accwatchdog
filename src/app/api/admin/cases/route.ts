import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { generateSlug } from "@/lib/utils";

const caseCreateSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  summary: z.string().min(20, "Summary must be at least 20 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  caseNumber: z.string().optional(),
  defendant: z.string().optional(),
  charges: z.array(z.string()).default([]),
  verdict: z.string().optional(),
  sentence: z.string().optional(),
  amountInvolved: z.number().min(0).optional(),
  amountRecovered: z.number().min(0).optional(),
  sector: z.string().optional(),
  region: z.string().optional(),
  caseDate: z.coerce.date().optional(),
  verdictDate: z.coerce.date().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = caseCreateSchema.parse(body);

    const caseHighlight = await prisma.caseHighlight.create({
      data: {
        slug: generateSlug(validatedData.title),
        title: validatedData.title,
        summary: validatedData.summary,
        content: validatedData.content,
        caseNumber: validatedData.caseNumber,
        defendant: validatedData.defendant,
        charges: validatedData.charges,
        verdict: validatedData.verdict,
        sentence: validatedData.sentence,
        amountInvolved: validatedData.amountInvolved,
        amountRecovered: validatedData.amountRecovered,
        sector: validatedData.sector,
        region: validatedData.region,
        caseDate: validatedData.caseDate,
        verdictDate: validatedData.verdictDate,
        featuredImage: validatedData.featuredImage,
        status: validatedData.status,
        publishedAt: validatedData.status === "PUBLISHED" ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: caseHighlight,
    });
  } catch (error) {
    console.error("Error creating case:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to create case" },
      { status: 500 }
    );
  }
}

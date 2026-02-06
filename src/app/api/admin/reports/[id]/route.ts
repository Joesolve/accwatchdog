import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const reportUpdateSchema = z.object({
  status: z.enum([
    "RECEIVED",
    "UNDER_REVIEW",
    "INVESTIGATING",
    "CLOSED_SUBSTANTIATED",
    "CLOSED_UNSUBSTANTIATED",
    "REFERRED",
  ]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  assignedToId: z.string().nullable().optional(),
  internalNotes: z.string().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const validatedData = reportUpdateSchema.parse(body);

    // Check if report exists
    const existing = await prisma.corruptionReport.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    // Update report
    const report = await prisma.corruptionReport.update({
      where: { id },
      data: {
        status: validatedData.status,
        priority: validatedData.priority,
        assignedToId: validatedData.assignedToId,
        internalNotes: validatedData.internalNotes,
      },
    });

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error updating report:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update report" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const report = await prisma.corruptionReport.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
        attachments: true,
      },
    });

    if (!report) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Error fetching report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

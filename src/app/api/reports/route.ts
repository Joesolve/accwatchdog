import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { corruptionReportSchema } from "@/lib/validations/report";
import { generateReferenceNumber } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = corruptionReportSchema.parse(body);

    // Get IP address
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0] || "unknown";

    // Create corruption report
    const report = await prisma.corruptionReport.create({
      data: {
        referenceNumber: generateReferenceNumber("CR"),
        reporterName: validatedData.isAnonymous ? null : validatedData.reporterName,
        reporterEmail: validatedData.isAnonymous ? null : validatedData.reporterEmail,
        reporterPhone: validatedData.isAnonymous ? null : validatedData.reporterPhone,
        isAnonymous: validatedData.isAnonymous,
        incidentDate: validatedData.incidentDate,
        incidentLocation: validatedData.incidentLocation,
        region: validatedData.region,
        accusedName: validatedData.accusedName,
        accusedPosition: validatedData.accusedPosition,
        accusedOrganization: validatedData.accusedOrganization,
        category: validatedData.category,
        description: validatedData.description,
        estimatedAmount: validatedData.estimatedAmount,
        hasEvidence: validatedData.hasEvidence,
        evidenceDescription: validatedData.evidenceDescription,
        ipAddress,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        referenceNumber: report.referenceNumber,
        message: "Your report has been submitted successfully",
      },
    });
  } catch (error) {
    console.error("Error submitting corruption report:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to submit report" },
      { status: 500 }
    );
  }
}

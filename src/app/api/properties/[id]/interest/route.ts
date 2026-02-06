import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { expressionOfInterestSchema } from "@/lib/validations/property";
import { generateReferenceNumber } from "@/lib/utils";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Validate input
    const validatedData = expressionOfInterestSchema.parse({
      ...body,
      propertyId: id,
    });

    // Check if property exists and is available
    const property = await prisma.property.findUnique({
      where: { id },
      select: { id: true, status: true, title: true },
    });

    if (!property) {
      return NextResponse.json(
        { success: false, error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.status === "SOLD" || property.status === "WITHDRAWN") {
      return NextResponse.json(
        { success: false, error: "This property is no longer available" },
        { status: 400 }
      );
    }

    // Get IP address
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0] || "unknown";

    // Create expression of interest
    const expression = await prisma.expressionOfInterest.create({
      data: {
        referenceNumber: generateReferenceNumber("EOI"),
        propertyId: id,
        fullName: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        organization: validatedData.organization,
        address: validatedData.address,
        nationality: validatedData.nationality,
        nin: validatedData.nin,
        passportNumber: validatedData.passportNumber,
        intendedUse: validatedData.intendedUse,
        proposedAmount: validatedData.proposedAmount,
        message: validatedData.message,
        ipAddress,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        referenceNumber: expression.referenceNumber,
        message: "Your expression of interest has been submitted successfully",
      },
    });
  } catch (error) {
    console.error("Error submitting expression of interest:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to submit expression of interest" },
      { status: 500 }
    );
  }
}

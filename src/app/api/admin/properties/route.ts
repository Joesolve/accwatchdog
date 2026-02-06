import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { propertyCreateSchema } from "@/lib/validations/property";
import { generateReferenceNumber, generateSlug } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = propertyCreateSchema.parse(body);

    const property = await prisma.property.create({
      data: {
        referenceNumber: generateReferenceNumber("PROP"),
        slug: generateSlug(validatedData.title),
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        status: validatedData.status,
        region: validatedData.region,
        district: validatedData.district,
        address: validatedData.address,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
        estimatedValue: validatedData.estimatedValue,
        minimumBid: validatedData.minimumBid,
        currency: validatedData.currency,
        auctionDate: validatedData.auctionDate,
        auctionVenue: validatedData.auctionVenue,
        auctionEndDate: validatedData.auctionEndDate,
        size: validatedData.size,
        bedrooms: validatedData.bedrooms,
        bathrooms: validatedData.bathrooms,
        yearBuilt: validatedData.yearBuilt,
        features: validatedData.features,
        caseReference: validatedData.caseReference,
        formerOwner: validatedData.formerOwner,
        recoveryDate: validatedData.recoveryDate,
        isFeatured: validatedData.isFeatured,
        publishedAt: body.publish ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      data: property,
    });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create property" },
      { status: 500 }
    );
  }
}

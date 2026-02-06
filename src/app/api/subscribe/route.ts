import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().optional(),
  categories: z.array(z.string()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = subscribeSchema.parse(body);

    // Check if already subscribed
    const existing = await prisma.emailSubscription.findUnique({
      where: { email: validatedData.email },
    });

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { success: false, error: "This email is already subscribed" },
          { status: 400 }
        );
      }

      // Reactivate subscription
      await prisma.emailSubscription.update({
        where: { email: validatedData.email },
        data: {
          isActive: true,
          unsubscribedAt: null,
          confirmedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Your subscription has been reactivated",
      });
    }

    // Create new subscription
    await prisma.emailSubscription.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        categories: validatedData.categories || ["news", "updates"],
        confirmedAt: new Date(), // Auto-confirm for now
      },
    });

    return NextResponse.json({
      success: true,
      message: "You have been successfully subscribed to our newsletter",
    });
  } catch (error) {
    console.error("Error subscribing:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid email address" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

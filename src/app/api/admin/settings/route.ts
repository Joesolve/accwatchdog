export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  siteDescription: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  contactAddress: z.string().optional(),
  socialFacebook: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialLinkedIn: z.string().optional(),
  socialYouTube: z.string().optional(),
  featuredPropertiesCount: z.number().min(1).max(20).optional(),
  enableAnonymousReports: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  footerText: z.string().optional(),
});

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();

    const settingsMap: Record<string, unknown> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json({
      success: true,
      data: settingsMap,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    // Update each setting
    const updates = Object.entries(validatedData).map(([key, value]) => {
      return prisma.siteSetting.upsert({
        where: { key },
        update: { value: value as never },
        create: { key, value: value as never },
      });
    });

    await prisma.$transaction(updates);

    // Fetch all settings to return
    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, unknown> = {};
    settings.forEach((setting) => {
      settingsMap[setting.key] = setting.value;
    });

    return NextResponse.json({
      success: true,
      data: settingsMap,
    });
  } catch (error) {
    console.error("Error updating settings:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

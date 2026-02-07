export const dynamic = 'force-dynamic';

import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const metadata: Metadata = {
  title: "Settings",
};

async function getSettings() {
  const settings = await prisma.siteSetting.findMany();

  // Convert to a key-value object
  const settingsMap: Record<string, unknown> = {};
  settings.forEach((setting) => {
    settingsMap[setting.key] = setting.value;
  });

  return settingsMap;
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage site-wide settings and configurations
        </p>
      </div>

      <SettingsForm initialSettings={settings} />
    </div>
  );
}

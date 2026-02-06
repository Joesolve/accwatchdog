"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Globe, Mail, Phone, MapPin, Share2, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

interface SettingsFormProps {
  initialSettings: Record<string, unknown>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Site settings
  const [siteName, setSiteName] = useState(
    (initialSettings.siteName as string) || "ACC Sierra Leone"
  );
  const [siteDescription, setSiteDescription] = useState(
    (initialSettings.siteDescription as string) || ""
  );

  // Contact settings
  const [contactEmail, setContactEmail] = useState(
    (initialSettings.contactEmail as string) || ""
  );
  const [contactPhone, setContactPhone] = useState(
    (initialSettings.contactPhone as string) || ""
  );
  const [contactAddress, setContactAddress] = useState(
    (initialSettings.contactAddress as string) || ""
  );

  // Social media
  const [socialFacebook, setSocialFacebook] = useState(
    (initialSettings.socialFacebook as string) || ""
  );
  const [socialTwitter, setSocialTwitter] = useState(
    (initialSettings.socialTwitter as string) || ""
  );
  const [socialLinkedIn, setSocialLinkedIn] = useState(
    (initialSettings.socialLinkedIn as string) || ""
  );
  const [socialYouTube, setSocialYouTube] = useState(
    (initialSettings.socialYouTube as string) || ""
  );

  // Feature settings
  const [featuredPropertiesCount, setFeaturedPropertiesCount] = useState(
    (initialSettings.featuredPropertiesCount as number) || 6
  );
  const [enableAnonymousReports, setEnableAnonymousReports] = useState(
    (initialSettings.enableAnonymousReports as boolean) ?? true
  );
  const [maintenanceMode, setMaintenanceMode] = useState(
    (initialSettings.maintenanceMode as boolean) || false
  );
  const [footerText, setFooterText] = useState(
    (initialSettings.footerText as string) || ""
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          siteDescription,
          contactEmail,
          contactPhone,
          contactAddress,
          socialFacebook,
          socialTwitter,
          socialLinkedIn,
          socialYouTube,
          featuredPropertiesCount,
          enableAnonymousReports,
          maintenanceMode,
          footerText,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save settings");
      }

      toast({
        title: "Success",
        description: "Settings saved successfully",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Basic site information and branding
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="ACC Sierra Leone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="footerText">Footer Text</Label>
              <Input
                id="footerText"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                placeholder="© 2024 Anti-Corruption Commission"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea
              id="siteDescription"
              value={siteDescription}
              onChange={(e) => setSiteDescription(e.target.value)}
              placeholder="Transparency and asset recovery platform for Sierra Leone's Anti-Corruption Commission"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
          <CardDescription>
            Public contact details displayed on the website
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="info@anticorruption.gov.sl"
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+232 22 123 456"
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactAddress">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="contactAddress"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                placeholder="3 Gloucester Street, Freetown, Sierra Leone"
                className="pl-10"
                rows={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Media Links
          </CardTitle>
          <CardDescription>
            Connect your social media profiles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="socialFacebook">Facebook URL</Label>
              <Input
                id="socialFacebook"
                value={socialFacebook}
                onChange={(e) => setSocialFacebook(e.target.value)}
                placeholder="https://facebook.com/accsl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialTwitter">Twitter / X URL</Label>
              <Input
                id="socialTwitter"
                value={socialTwitter}
                onChange={(e) => setSocialTwitter(e.target.value)}
                placeholder="https://twitter.com/accsl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialLinkedIn">LinkedIn URL</Label>
              <Input
                id="socialLinkedIn"
                value={socialLinkedIn}
                onChange={(e) => setSocialLinkedIn(e.target.value)}
                placeholder="https://linkedin.com/company/accsl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="socialYouTube">YouTube URL</Label>
              <Input
                id="socialYouTube"
                value={socialYouTube}
                onChange={(e) => setSocialYouTube(e.target.value)}
                placeholder="https://youtube.com/@accsl"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Feature Settings
          </CardTitle>
          <CardDescription>
            Configure site features and behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="featuredPropertiesCount">Featured Properties Count</Label>
            <Input
              id="featuredPropertiesCount"
              type="number"
              min={1}
              max={20}
              value={featuredPropertiesCount}
              onChange={(e) => setFeaturedPropertiesCount(parseInt(e.target.value) || 6)}
              className="w-32"
            />
            <p className="text-xs text-muted-foreground">
              Number of featured properties to display on the homepage
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Anonymous Reports</Label>
              <p className="text-sm text-muted-foreground">
                Allow users to submit corruption reports anonymously
              </p>
            </div>
            <Switch
              checked={enableAnonymousReports}
              onCheckedChange={setEnableAnonymousReports}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Show maintenance page to visitors (admins can still access)
              </p>
            </div>
            <Switch
              checked={maintenanceMode}
              onCheckedChange={setMaintenanceMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

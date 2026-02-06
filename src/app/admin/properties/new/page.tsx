"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";

const PROPERTY_TYPES = ["RESIDENTIAL", "COMMERCIAL", "LAND", "VEHICLE", "EQUIPMENT", "OTHER"];
const PROPERTY_STATUSES = ["AVAILABLE", "UNDER_AUCTION", "SOLD", "RESERVED", "WITHDRAWN"];
const REGIONS = [
  "Western Area Urban",
  "Western Area Rural",
  "North West",
  "Northern",
  "Eastern",
  "Southern",
];

export default function NewPropertyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publish, setPublish] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      description: formData.get("description"),
      type: formData.get("type"),
      status: formData.get("status") || "AVAILABLE",
      region: formData.get("region"),
      district: formData.get("district") || undefined,
      address: formData.get("address") || undefined,
      estimatedValue: Number(formData.get("estimatedValue")),
      minimumBid: formData.get("minimumBid") ? Number(formData.get("minimumBid")) : undefined,
      auctionDate: formData.get("auctionDate") || undefined,
      auctionVenue: formData.get("auctionVenue") || undefined,
      size: formData.get("size") || undefined,
      bedrooms: formData.get("bedrooms") ? Number(formData.get("bedrooms")) : undefined,
      bathrooms: formData.get("bathrooms") ? Number(formData.get("bathrooms")) : undefined,
      yearBuilt: formData.get("yearBuilt") ? Number(formData.get("yearBuilt")) : undefined,
      caseReference: formData.get("caseReference") || undefined,
      formerOwner: formData.get("formerOwner") || undefined,
      features: formData.get("features")
        ? (formData.get("features") as string).split(",").map(f => f.trim()).filter(Boolean)
        : [],
      isFeatured: formData.get("isFeatured") === "on",
      publish,
    };

    try {
      const response = await fetch("/api/admin/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create property");
      }

      toast({
        title: "Success",
        description: "Property created successfully",
      });

      router.push("/admin/properties");
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
      <div className="flex items-center gap-4">
        <Link href="/admin/properties">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Property</h1>
          <p className="text-muted-foreground">Create a new property listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the property details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g., 4 Bedroom House in Freetown" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Detailed description of the property..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Property Type *</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="AVAILABLE">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Region *</Label>
                <Select name="region" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" name="district" placeholder="e.g., Freetown" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Input id="address" name="address" placeholder="e.g., 123 Main Street, Freetown" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Auction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">Estimated Value (SLE) *</Label>
                <Input id="estimatedValue" name="estimatedValue" type="number" required min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumBid">Minimum Bid (SLE)</Label>
                <Input id="minimumBid" name="minimumBid" type="number" min="0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="auctionDate">Auction Date</Label>
                <Input id="auctionDate" name="auctionDate" type="datetime-local" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="auctionVenue">Auction Venue</Label>
                <Input id="auctionVenue" name="auctionVenue" placeholder="e.g., ACC Headquarters" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="size">Size</Label>
                <Input id="size" name="size" placeholder="e.g., 500 sqm" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" name="bedrooms" type="number" min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input id="bathrooms" name="bathrooms" type="number" min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearBuilt">Year Built</Label>
                <Input id="yearBuilt" name="yearBuilt" type="number" min="1800" max={new Date().getFullYear()} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input id="features" name="features" placeholder="e.g., Swimming Pool, Garage, Garden" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recovery Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caseReference">Case Reference</Label>
                <Input id="caseReference" name="caseReference" placeholder="e.g., ACC/2024/001" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="formerOwner">Source / Former Owner</Label>
                <Input id="formerOwner" name="formerOwner" placeholder="Name redacted for legal reasons" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Featured Property</Label>
                <p className="text-sm text-muted-foreground">Show this property on the homepage</p>
              </div>
              <Switch name="isFeatured" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Publish Immediately</Label>
                <p className="text-sm text-muted-foreground">Make this property visible to the public</p>
              </div>
              <Switch checked={publish} onCheckedChange={setPublish} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/properties">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Property
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

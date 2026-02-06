"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const PERIOD_TYPES = [
  { value: "yearly", label: "Yearly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "monthly", label: "Monthly" },
];

export default function NewStatisticPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [periodType, setPeriodType] = useState("yearly");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      period: formData.get("period"),
      periodType,
      totalRecovered: Number(formData.get("totalRecovered")),
      cashRecovered: formData.get("cashRecovered") ? Number(formData.get("cashRecovered")) : undefined,
      assetsRecovered: formData.get("assetsRecovered") ? Number(formData.get("assetsRecovered")) : undefined,
      fundsToTreasury: formData.get("fundsToTreasury") ? Number(formData.get("fundsToTreasury")) : undefined,
      casesOpened: formData.get("casesOpened") ? Number(formData.get("casesOpened")) : undefined,
      casesClosed: formData.get("casesClosed") ? Number(formData.get("casesClosed")) : undefined,
      prosecutions: formData.get("prosecutions") ? Number(formData.get("prosecutions")) : undefined,
      convictions: formData.get("convictions") ? Number(formData.get("convictions")) : undefined,
      acquittals: formData.get("acquittals") ? Number(formData.get("acquittals")) : undefined,
      propertiesSeized: formData.get("propertiesSeized") ? Number(formData.get("propertiesSeized")) : undefined,
      propertiesAuctioned: formData.get("propertiesAuctioned") ? Number(formData.get("propertiesAuctioned")) : undefined,
    };

    try {
      const response = await fetch("/api/admin/statistics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create statistics");
      }

      toast({
        title: "Success",
        description: "Statistics created successfully",
      });

      router.push("/admin/statistics");
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
        <Link href="/admin/statistics">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Statistics</h1>
          <p className="text-muted-foreground">Create a new statistics period</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Period Information</CardTitle>
            <CardDescription>Specify the time period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Period Type *</Label>
                <Select value={periodType} onValueChange={setPeriodType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIOD_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Period *</Label>
                <Input
                  id="period"
                  name="period"
                  required
                  placeholder={
                    periodType === "yearly"
                      ? "e.g., 2024"
                      : periodType === "quarterly"
                      ? "e.g., 2024-Q1"
                      : "e.g., 2024-01"
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Recovery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalRecovered">Total Recovered (SLE) *</Label>
                <Input id="totalRecovered" name="totalRecovered" type="number" required min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fundsToTreasury">Funds to Treasury (SLE)</Label>
                <Input id="fundsToTreasury" name="fundsToTreasury" type="number" min="0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cashRecovered">Cash Recovered (SLE)</Label>
                <Input id="cashRecovered" name="cashRecovered" type="number" min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetsRecovered">Assets Recovered (SLE)</Label>
                <Input id="assetsRecovered" name="assetsRecovered" type="number" min="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Case Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="casesOpened">Cases Opened</Label>
                <Input id="casesOpened" name="casesOpened" type="number" min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="casesClosed">Cases Closed</Label>
                <Input id="casesClosed" name="casesClosed" type="number" min="0" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prosecutions">Prosecutions</Label>
                <Input id="prosecutions" name="prosecutions" type="number" min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="convictions">Convictions</Label>
                <Input id="convictions" name="convictions" type="number" min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acquittals">Acquittals</Label>
                <Input id="acquittals" name="acquittals" type="number" min="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Property Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertiesSeized">Properties Seized</Label>
                <Input id="propertiesSeized" name="propertiesSeized" type="number" min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertiesAuctioned">Properties Auctioned</Label>
                <Input id="propertiesAuctioned" name="propertiesAuctioned" type="number" min="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/statistics">
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
                Create Statistics
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

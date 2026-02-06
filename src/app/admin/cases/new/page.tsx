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

const SECTORS = [
  "Public Sector",
  "Healthcare",
  "Education",
  "Infrastructure",
  "Mining",
  "Finance",
  "Judiciary",
  "Law Enforcement",
  "Other",
];

const REGIONS = [
  "Western Area Urban",
  "Western Area Rural",
  "North West",
  "Northern",
  "Eastern",
  "Southern",
];

const STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"];

export default function NewCasePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("DRAFT");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title"),
      summary: formData.get("summary"),
      content: formData.get("content"),
      caseNumber: formData.get("caseNumber") || undefined,
      defendant: formData.get("defendant") || undefined,
      charges: formData.get("charges")
        ? (formData.get("charges") as string).split(",").map(c => c.trim()).filter(Boolean)
        : [],
      verdict: formData.get("verdict") || undefined,
      sentence: formData.get("sentence") || undefined,
      amountInvolved: formData.get("amountInvolved") ? Number(formData.get("amountInvolved")) : undefined,
      amountRecovered: formData.get("amountRecovered") ? Number(formData.get("amountRecovered")) : undefined,
      sector: formData.get("sector") || undefined,
      region: formData.get("region") || undefined,
      caseDate: formData.get("caseDate") || undefined,
      verdictDate: formData.get("verdictDate") || undefined,
      status,
    };

    try {
      const response = await fetch("/api/admin/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create case");
      }

      toast({
        title: "Success",
        description: "Case created successfully",
      });

      router.push("/admin/cases");
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
        <Link href="/admin/cases">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Case</h1>
          <p className="text-muted-foreground">Create a new case highlight</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
            <CardDescription>Enter the case details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" required placeholder="e.g., Corruption Case: Ministry of Health" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="summary">Summary *</Label>
              <Textarea
                id="summary"
                name="summary"
                required
                rows={3}
                placeholder="Brief summary of the case..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content *</Label>
              <Textarea
                id="content"
                name="content"
                required
                rows={10}
                placeholder="Detailed description of the case, proceedings, and outcomes..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caseNumber">Case Number</Label>
                <Input id="caseNumber" name="caseNumber" placeholder="e.g., ACC/2024/001" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="defendant">Defendant</Label>
                <Input id="defendant" name="defendant" placeholder="Name of the accused" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="charges">Charges (comma-separated)</Label>
              <Input id="charges" name="charges" placeholder="e.g., Embezzlement, Fraud, Money Laundering" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="verdict">Verdict</Label>
                <Input id="verdict" name="verdict" placeholder="e.g., Guilty, Not Guilty, Pending" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sentence">Sentence</Label>
                <Input id="sentence" name="sentence" placeholder="e.g., 5 years imprisonment" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amountInvolved">Amount Involved (SLE)</Label>
                <Input id="amountInvolved" name="amountInvolved" type="number" min="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amountRecovered">Amount Recovered (SLE)</Label>
                <Input id="amountRecovered" name="amountRecovered" type="number" min="0" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Sector</Label>
                <Select name="sector">
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {SECTORS.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Select name="region">
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caseDate">Case Date</Label>
                <Input id="caseDate" name="caseDate" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="verdictDate">Verdict Date</Label>
                <Input id="verdictDate" name="verdictDate" type="date" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Link href="/admin/cases">
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
                Create Case
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

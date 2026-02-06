"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Shield,
  CheckCircle,
  Loader2,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { corruptionReportSchema, type CorruptionReportInput } from "@/lib/validations/report";
import { SIERRA_LEONE_REGIONS } from "@/lib/utils";

const CATEGORIES = [
  { value: "BRIBERY", label: "Bribery" },
  { value: "EMBEZZLEMENT", label: "Embezzlement" },
  { value: "FRAUD", label: "Fraud" },
  { value: "NEPOTISM", label: "Nepotism" },
  { value: "ABUSE_OF_OFFICE", label: "Abuse of Office" },
  { value: "PROCUREMENT_FRAUD", label: "Procurement Fraud" },
  { value: "EXTORTION", label: "Extortion" },
  { value: "MONEY_LAUNDERING", label: "Money Laundering" },
  { value: "OTHER", label: "Other" },
];

export default function ReportCorruptionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CorruptionReportInput>({
    resolver: zodResolver(corruptionReportSchema),
    defaultValues: {
      isAnonymous: true,
      hasEvidence: false,
    },
  });

  const hasEvidence = watch("hasEvidence");

  const onSubmit = async (data: CorruptionReportInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit report");
      }

      setReferenceNumber(result.data.referenceNumber);
      setIsSuccess(true);
      reset();
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

  if (isSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <CheckCircle className="h-20 w-20 text-primary mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Report Submitted Successfully</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for helping fight corruption in Sierra Leone. Your report has been
              received and will be reviewed by our team.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">Your Reference Number</p>
              <p className="text-3xl font-mono font-bold text-primary">{referenceNumber}</p>
              <p className="text-sm text-muted-foreground mt-4">
                Please save this reference number. You may need it to follow up on your report.
              </p>
            </CardContent>
          </Card>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-amber-800 mb-2">What Happens Next?</h3>
            <ul className="text-sm text-amber-700 text-left space-y-2">
              <li>1. Your report will be reviewed by our assessment team</li>
              <li>2. If additional information is needed, we will contact you (if contact details were provided)</li>
              <li>3. The case will be assigned to an investigator if warranted</li>
              <li>4. You may be contacted for further details during the investigation</li>
            </ul>
          </div>

          <Button onClick={() => setIsSuccess(false)} className="gap-2">
            Submit Another Report
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Report Corruption</h1>
            <p className="text-muted-foreground">
              Help us fight corruption in Sierra Leone
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Report</CardTitle>
              <CardDescription>
                All reports are treated confidentially. You can choose to remain anonymous.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Anonymous Toggle */}
                <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                  <Checkbox
                    id="isAnonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => {
                      setIsAnonymous(checked as boolean);
                      setValue("isAnonymous", checked as boolean);
                    }}
                  />
                  <div className="flex-1">
                    <Label htmlFor="isAnonymous" className="font-medium cursor-pointer">
                      Submit Anonymously
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Your identity will be protected
                    </p>
                  </div>
                  <Shield className="h-5 w-5 text-primary" />
                </div>

                {/* Contact Details (shown if not anonymous) */}
                {!isAnonymous && (
                  <div className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-medium flex items-center gap-2">
                      <EyeOff className="h-4 w-4" />
                      Your Contact Details (Confidential)
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reporterName">Full Name</Label>
                        <Input
                          id="reporterName"
                          {...register("reporterName")}
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reporterPhone">Phone Number</Label>
                        <Input
                          id="reporterPhone"
                          {...register("reporterPhone")}
                          placeholder="+232 76 123 456"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reporterEmail">Email Address</Label>
                      <Input
                        id="reporterEmail"
                        type="email"
                        {...register("reporterEmail")}
                        placeholder="your@email.com"
                      />
                      {errors.reporterEmail && (
                        <p className="text-sm text-destructive">{errors.reporterEmail.message}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Incident Details */}
                <div className="space-y-4">
                  <h3 className="font-medium">Incident Details</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="incidentDate">Date of Incident</Label>
                      <Input
                        id="incidentDate"
                        type="date"
                        {...register("incidentDate")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select onValueChange={(value) => setValue("region", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {SIERRA_LEONE_REGIONS.map((region) => (
                            <SelectItem key={region} value={region}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="incidentLocation">Location / Address</Label>
                    <Input
                      id="incidentLocation"
                      {...register("incidentLocation")}
                      placeholder="Where did this occur?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Type of Corruption</Label>
                    <Select onValueChange={(value) => setValue("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Accused Details */}
                <div className="space-y-4">
                  <h3 className="font-medium">Person(s) Involved (if known)</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="accusedName">Name</Label>
                      <Input
                        id="accusedName"
                        {...register("accusedName")}
                        placeholder="Name of person involved"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accusedPosition">Position/Title</Label>
                      <Input
                        id="accusedPosition"
                        {...register("accusedPosition")}
                        placeholder="Their role or position"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accusedOrganization">Organization/Ministry</Label>
                    <Input
                      id="accusedOrganization"
                      {...register("accusedOrganization")}
                      placeholder="Where do they work?"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedAmount">Estimated Amount Involved (SLE)</Label>
                    <Input
                      id="estimatedAmount"
                      type="number"
                      {...register("estimatedAmount", { valueAsNumber: true })}
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Detailed Description *
                    <span className="text-muted-foreground font-normal ml-2">
                      (minimum 50 characters)
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    {...register("description")}
                    placeholder="Please provide as much detail as possible about what happened, when, where, and who was involved..."
                    rows={6}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                {/* Evidence */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="hasEvidence"
                      checked={hasEvidence}
                      onCheckedChange={(checked) => {
                        setValue("hasEvidence", checked as boolean);
                      }}
                    />
                    <Label htmlFor="hasEvidence" className="cursor-pointer">
                      I have evidence to support this report
                    </Label>
                  </div>

                  {hasEvidence && (
                    <div className="space-y-2">
                      <Label htmlFor="evidenceDescription">Describe your evidence</Label>
                      <Textarea
                        id="evidenceDescription"
                        {...register("evidenceDescription")}
                        placeholder="What type of evidence do you have? (documents, photos, recordings, witness information, etc.)"
                        rows={3}
                      />
                    </div>
                  )}
                </div>

                {/* Submit */}
                <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Report...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <Shield className="h-8 w-8 mb-4" />
              <h3 className="font-semibold mb-2">Your Safety First</h3>
              <p className="text-sm opacity-90">
                All reports are treated with strict confidentiality. The ACC is committed
                to protecting whistleblowers under Sierra Leone law.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Info className="h-6 w-6 text-secondary mb-4" />
              <h3 className="font-semibold mb-2">What to Include</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>- Date, time, and location of incident</li>
                <li>- Names of persons involved</li>
                <li>- Description of what happened</li>
                <li>- Any evidence you may have</li>
                <li>- Names of witnesses (if any)</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Other Ways to Report</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong>Hotline:</strong> 077-985-985
                </p>
                <p>
                  <strong>Email:</strong> report@anticorruption.gov.sl
                </p>
                <p>
                  <strong>In Person:</strong> ACC Headquarters, 3 Gloucester Street, Freetown
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

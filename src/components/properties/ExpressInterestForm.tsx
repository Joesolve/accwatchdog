"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send, CheckCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { expressionOfInterestSchema, type ExpressionOfInterestInput } from "@/lib/validations/property";
import { formatCurrency } from "@/lib/utils";

const NATIONALITIES = [
  "Sierra Leonean",
  "Nigerian",
  "Ghanaian",
  "Liberian",
  "Guinean",
  "Gambian",
  "Senegalese",
  "British",
  "American",
  "Chinese",
  "Indian",
  "Lebanese",
  "Other",
];

interface ExpressInterestFormProps {
  propertyId: string;
  propertyTitle: string;
  estimatedValue: number;
}

export function ExpressInterestForm({
  propertyId,
  propertyTitle,
  estimatedValue,
}: ExpressInterestFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ExpressionOfInterestInput>({
    resolver: zodResolver(expressionOfInterestSchema),
    defaultValues: {
      propertyId,
      nationality: "",
      nin: "",
      passportNumber: "",
    },
  });

  const selectedNationality = watch("nationality");

  const onSubmit = async (data: ExpressionOfInterestInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/properties/${propertyId}/interest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit expression of interest");
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

  const handleClose = () => {
    setOpen(false);
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
        setReferenceNumber("");
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (isOpen) {
        setOpen(true);
      } else {
        handleClose();
      }
    }}>
      <DialogTrigger asChild>
        <Button size="lg" className="w-full gap-2">
          <Send className="h-4 w-4" />
          Express Interest
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        {isSuccess ? (
          <div className="text-center py-6">
            <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Interest Submitted!</h3>
            <p className="text-muted-foreground mb-4">
              Your expression of interest has been submitted successfully.
            </p>
            <div className="bg-slate-100 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Reference Number</p>
              <p className="text-lg font-mono font-bold">{referenceNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Please save this reference number. Our team will contact you within 5-7 business days.
            </p>
            <Button className="mt-6" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Express Interest</DialogTitle>
              <DialogDescription>
                Submit your interest in: <strong>{propertyTitle}</strong>
                <br />
                Estimated Value: <strong>{formatCurrency(estimatedValue)}</strong>
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input type="hidden" {...register("propertyId")} value={propertyId} />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    {...register("fullName")}
                    placeholder="John Doe"
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="+232 76 123 456"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization (Optional)</Label>
                <Input
                  id="organization"
                  {...register("organization")}
                  placeholder="Company or organization name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input
                  id="address"
                  {...register("address")}
                  placeholder="Your address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationality *</Label>
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Clear the other field when nationality changes
                        if (value === "Sierra Leonean") {
                          setValue("passportNumber", "");
                        } else {
                          setValue("nin", "");
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {NATIONALITIES.map((nat) => (
                          <SelectItem key={nat} value={nat}>
                            {nat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.nationality && (
                  <p className="text-sm text-destructive">{errors.nationality.message}</p>
                )}
              </div>

              {selectedNationality === "Sierra Leonean" ? (
                <div className="space-y-2">
                  <Label htmlFor="nin">National Identification Number (NIN) *</Label>
                  <Input
                    id="nin"
                    {...register("nin")}
                    placeholder="Enter your NIN"
                  />
                  {errors.nin && (
                    <p className="text-sm text-destructive">{errors.nin.message}</p>
                  )}
                </div>
              ) : selectedNationality ? (
                <div className="space-y-2">
                  <Label htmlFor="passportNumber">Passport Number *</Label>
                  <Input
                    id="passportNumber"
                    {...register("passportNumber")}
                    placeholder="Enter your passport number"
                  />
                  {errors.passportNumber && (
                    <p className="text-sm text-destructive">{errors.passportNumber.message}</p>
                  )}
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="proposedAmount">Proposed Amount (SLE)</Label>
                <Input
                  id="proposedAmount"
                  type="number"
                  {...register("proposedAmount", { valueAsNumber: true })}
                  placeholder="Enter your proposed amount"
                />
                {errors.proposedAmount && (
                  <p className="text-sm text-destructive">{errors.proposedAmount.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="intendedUse">Intended Use (Optional)</Label>
                <Input
                  id="intendedUse"
                  {...register("intendedUse")}
                  placeholder="How do you plan to use this property?"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Additional Message (Optional)</Label>
                <Textarea
                  id="message"
                  {...register("message")}
                  placeholder="Any additional information..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Interest
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  Bed,
  Bath,
  Maximize,
  FileText,
  Download,
  Eye,
  Clock,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ImageGallery } from "@/components/properties/ImageGallery";
import { PropertyMap } from "@/components/properties/PropertyMap";
import { ExpressInterestForm } from "@/components/properties/ExpressInterestForm";
import { ShareButtons } from "@/components/properties/ShareButtons";

interface PropertyPageProps {
  params: { slug: string };
}

async function getProperty(slug: string) {
  const property = await prisma.property.findFirst({
    where: {
      slug,
      publishedAt: { not: null },
    },
    include: {
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
      },
      documents: true,
    },
  });

  if (property) {
    // Increment view count
    await prisma.property.update({
      where: { id: property.id },
      data: { viewCount: { increment: 1 } },
    });
  }

  return property;
}

export async function generateMetadata({
  params,
}: PropertyPageProps): Promise<Metadata> {
  const property = await prisma.property.findFirst({
    where: { slug: params.slug },
    select: { title: true, description: true },
  });

  if (!property) {
    return { title: "Property Not Found" };
  }

  return {
    title: property.title,
    description: property.description.slice(0, 160),
  };
}

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  AVAILABLE: "success",
  UNDER_AUCTION: "warning",
  SOLD: "secondary",
  RESERVED: "default",
  WITHDRAWN: "destructive",
};

const typeLabels: Record<string, string> = {
  RESIDENTIAL: "Residential",
  COMMERCIAL: "Commercial",
  LAND: "Land",
  VEHICLE: "Vehicle",
  EQUIPMENT: "Equipment",
  OTHER: "Other",
};

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const property = await getProperty(params.slug);

  if (!property) {
    notFound();
  }

  const isAvailable = property.status === "AVAILABLE" || property.status === "UNDER_AUCTION";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/properties">
        <Button variant="ghost" size="sm" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Properties
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <ImageGallery images={property.images} title={property.title} />

          {/* Title and Badges */}
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant={statusColors[property.status]}>
                {property.status.replace("_", " ")}
              </Badge>
              <Badge variant="outline">{typeLabels[property.type]}</Badge>
              {property.isFeatured && <Badge className="bg-primary">Featured</Badge>}
            </div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {property.region}
                {property.district && `, ${property.district}`}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {property.viewCount} views
              </span>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{property.description}</p>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.size && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Maximize className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="font-medium">{property.size}</p>
                    </div>
                  </div>
                )}
                {property.bedrooms !== null && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bedrooms</p>
                      <p className="font-medium">{property.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.bathrooms !== null && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Bath className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bathrooms</p>
                      <p className="font-medium">{property.bathrooms}</p>
                    </div>
                  </div>
                )}
                {property.yearBuilt && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Year Built</p>
                      <p className="font-medium">{property.yearBuilt}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium">{typeLabels[property.type]}</p>
                  </div>
                </div>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h4 className="font-medium mb-3">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <Badge key={index} variant="secondary">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Case Information */}
          {(property.caseReference || property.formerOwner || property.recoveryDate) && (
            <Card>
              <CardHeader>
                <CardTitle>Recovery Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {property.caseReference && (
                  <div>
                    <p className="text-sm text-muted-foreground">Case Reference</p>
                    <p className="font-medium">{property.caseReference}</p>
                  </div>
                )}
                {property.formerOwner && (
                  <div>
                    <p className="text-sm text-muted-foreground">Source</p>
                    <p className="font-medium">{property.formerOwner}</p>
                  </div>
                )}
                {property.recoveryDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Recovery Date</p>
                    <p className="font-medium">{formatDate(property.recoveryDate)}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Map */}
          <PropertyMap
            latitude={property.latitude}
            longitude={property.longitude}
            address={property.address}
            title={property.title}
          />

          {/* Documents */}
          {property.documents && property.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {property.documents.map((doc) => (
                    <a
                      key={doc.id}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">{doc.type}</p>
                        </div>
                      </div>
                      <Download className="h-5 w-5 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="sticky top-24">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Value</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatCurrency(Number(property.estimatedValue))}
                  </p>
                </div>

                {property.minimumBid && (
                  <div>
                    <p className="text-sm text-muted-foreground">Minimum Bid</p>
                    <p className="text-xl font-semibold">
                      {formatCurrency(Number(property.minimumBid))}
                    </p>
                  </div>
                )}

                <Separator />

                {/* Auction Info */}
                {property.auctionDate && (
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-amber-800 font-medium">Auction Date</p>
                      <p className="text-amber-900">{formatDate(property.auctionDate)}</p>
                    </div>
                  </div>
                )}

                {property.auctionVenue && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Venue</p>
                      <p className="font-medium">{property.auctionVenue}</p>
                    </div>
                  </div>
                )}

                <Separator />

                {/* Actions */}
                {isAvailable ? (
                  <ExpressInterestForm
                    propertyId={property.id}
                    propertyTitle={property.title}
                    estimatedValue={Number(property.estimatedValue)}
                  />
                ) : (
                  <Button disabled className="w-full">
                    {property.status === "SOLD" ? "Property Sold" : "Not Available"}
                  </Button>
                )}

                <ShareButtons
                  title={property.title}
                  url={`${process.env.NEXT_PUBLIC_APP_URL || "https://acc.gov.sl"}/properties/${property.slug}`}
                />
              </div>
            </CardContent>
          </Card>

          {/* Reference Number */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Reference Number</p>
              <p className="font-mono font-medium">{property.referenceNumber}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

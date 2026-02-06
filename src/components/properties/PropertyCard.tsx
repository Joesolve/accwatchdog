import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Eye } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PropertyWithImages } from "@/types";

interface PropertyCardProps {
  property: PropertyWithImages;
}

const statusColors: Record<string, "default" | "secondary" | "success" | "warning" | "destructive"> = {
  AVAILABLE: "success",
  UNDER_AUCTION: "warning",
  SOLD: "secondary",
  RESERVED: "info" as "default",
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

export function PropertyCard({ property }: PropertyCardProps) {
  const primaryImage = property.images?.find((img) => img.isPrimary) || property.images?.[0];

  return (
    <Link href={`/properties/${property.slug}`}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || property.title}
              fill
              className="object-cover transition-transform hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-200">
              <span className="text-slate-400">No image</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={statusColors[property.status] || "default"}>
              {property.status.replace("_", " ")}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-white/90">
              {typeLabels[property.type]}
            </Badge>
          </div>
          {property.isFeatured && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-primary">Featured</Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-2">{property.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.region}</span>
            {property.district && <span>• {property.district}</span>}
          </div>
        </CardHeader>

        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {property.description}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-2 pt-0">
          <div className="w-full">
            <p className="text-xs text-muted-foreground">Estimated Value</p>
            <p className="text-xl font-bold text-primary">
              {formatCurrency(Number(property.estimatedValue))}
            </p>
            {property.minimumBid && (
              <p className="text-sm text-muted-foreground">
                Min. Bid: {formatCurrency(Number(property.minimumBid))}
              </p>
            )}
          </div>

          <div className="flex w-full items-center justify-between text-xs text-muted-foreground">
            {property.auctionDate && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Auction: {formatDate(property.auctionDate)}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{property.viewCount} views</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

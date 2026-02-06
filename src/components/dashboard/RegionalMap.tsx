"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface RegionData {
  region: string;
  recovered: number;
  cases: number;
}

interface RegionalMapProps {
  data: RegionData[];
}

export function RegionalMap({ data }: RegionalMapProps) {
  const maxRecovered = Math.max(...data.map((d) => d.recovered));

  const getIntensity = (value: number) => {
    const ratio = value / maxRecovered;
    if (ratio > 0.8) return "bg-primary/90";
    if (ratio > 0.6) return "bg-primary/70";
    if (ratio > 0.4) return "bg-primary/50";
    if (ratio > 0.2) return "bg-primary/30";
    return "bg-primary/10";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recovery by Region</CardTitle>
        <CardDescription>
          Geographic distribution of recovered assets across Sierra Leone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {data.map((region) => (
            <div
              key={region.region}
              className={`p-3 rounded-lg ${getIntensity(region.recovered)} transition-colors overflow-hidden`}
            >
              <p className="text-xs font-medium truncate" title={region.region}>
                {region.region}
              </p>
              <p className="text-sm font-bold mt-1 truncate" title={formatCurrency(region.recovered)}>
                {formatCurrency(region.recovered)}
              </p>
              <p className="text-xs text-muted-foreground">
                {region.cases} cases
              </p>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <span className="text-xs text-muted-foreground">Low</span>
          <div className="flex gap-1">
            <div className="h-3 w-6 rounded bg-primary/10" />
            <div className="h-3 w-6 rounded bg-primary/30" />
            <div className="h-3 w-6 rounded bg-primary/50" />
            <div className="h-3 w-6 rounded bg-primary/70" />
            <div className="h-3 w-6 rounded bg-primary/90" />
          </div>
          <span className="text-xs text-muted-foreground">High</span>
        </div>
      </CardContent>
    </Card>
  );
}

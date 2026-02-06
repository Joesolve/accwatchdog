"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROPERTY_TYPES, PROPERTY_STATUSES, SIERRA_LEONE_REGIONS } from "@/lib/utils";

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset to page 1 when filters change
      if (!updates.hasOwnProperty("page")) {
        params.delete("page");
      }

      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = (key: string, value: string | null) => {
    const queryString = createQueryString({ [key]: value });
    router.push(`/properties${queryString ? `?${queryString}` : ""}`);
  };

  const clearFilters = () => {
    router.push("/properties");
  };

  const hasActiveFilters =
    searchParams.has("type") ||
    searchParams.has("status") ||
    searchParams.has("region") ||
    searchParams.has("search");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-9"
            defaultValue={searchParams.get("search") || ""}
            onChange={(e) => {
              const value = e.target.value;
              // Debounce search
              const timeoutId = setTimeout(() => {
                updateFilter("search", value || null);
              }, 300);
              return () => clearTimeout(timeoutId);
            }}
          />
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2">
          <Select
            defaultValue={searchParams.get("type") || "all"}
            onValueChange={(value) => updateFilter("type", value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type.toUpperCase()}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue={searchParams.get("status") || "all"}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {PROPERTY_STATUSES.map((status) => (
                <SelectItem key={status} value={status.toUpperCase().replace(" ", "_")}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            defaultValue={searchParams.get("region") || "all"}
            onValueChange={(value) => updateFilter("region", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Regions</SelectItem>
              {SIERRA_LEONE_REGIONS.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Active filters:
          </span>
          {searchParams.get("type") && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 gap-1"
              onClick={() => updateFilter("type", null)}
            >
              Type: {searchParams.get("type")}
              <X className="h-3 w-3" />
            </Button>
          )}
          {searchParams.get("status") && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 gap-1"
              onClick={() => updateFilter("status", null)}
            >
              Status: {searchParams.get("status")?.replace("_", " ")}
              <X className="h-3 w-3" />
            </Button>
          )}
          {searchParams.get("region") && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 gap-1"
              onClick={() => updateFilter("region", null)}
            >
              Region: {searchParams.get("region")}
              <X className="h-3 w-3" />
            </Button>
          )}
          {searchParams.get("search") && (
            <Button
              variant="secondary"
              size="sm"
              className="h-7 gap-1"
              onClick={() => updateFilter("search", null)}
            >
              Search: "{searchParams.get("search")}"
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

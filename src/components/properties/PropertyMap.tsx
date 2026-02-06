"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  title: string;
}

export function PropertyMap({ latitude, longitude, address, title }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    // Only render map if coordinates are provided
    if (!latitude || !longitude || !mapRef.current) return;

    // Dynamic import of Leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      // Fix default marker icon
      delete (L.Icon.Default.prototype as { _getIconUrl?: () => void })._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Clean up existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      // Create map
      const map = L.map(mapRef.current!, {
        center: [latitude, longitude],
        zoom: 15,
        scrollWheelZoom: false,
      });

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Add marker
      const marker = L.marker([latitude, longitude]).addTo(map);
      marker.bindPopup(`<strong>${title}</strong>${address ? `<br/>${address}` : ""}`);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, address, title]);

  if (!latitude || !longitude) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-100 rounded-lg p-8 text-center">
            <MapPin className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">Map location not available</p>
            {address && <p className="text-sm text-slate-600 mt-2">{address}</p>}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Location
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="h-[300px] rounded-lg overflow-hidden border"
        />
        {address && (
          <p className="text-sm text-muted-foreground mt-3">{address}</p>
        )}
      </CardContent>
    </Card>
  );
}

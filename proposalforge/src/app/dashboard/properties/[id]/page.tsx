"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Star, Bed, DoorOpen, UtensilsCrossed } from "lucide-react";
import { AUTH_DISABLED } from "@/lib/auth-config";
import {
  DEMO_PROPERTY,
  DEMO_ROOM_TYPES,
  DEMO_FUNCTION_SPACES,
  DEMO_CATERING_PACKAGES,
} from "@/lib/demo-data";
import { formatCurrency } from "@/lib/utils";

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [property, setProperty] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [roomTypes, setRoomTypes] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [spaces, setSpaces] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [catering, setCatering] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (AUTH_DISABLED && String(params.id).startsWith("demo-")) {
        setProperty(DEMO_PROPERTY);
        setRoomTypes(DEMO_ROOM_TYPES);
        setSpaces(DEMO_FUNCTION_SPACES);
        setCatering(DEMO_CATERING_PACKAGES);
        return;
      }
      const [{ data: p }, { data: rt }, { data: fs }, { data: cp }] = await Promise.all([
        supabase.from("properties").select("*").eq("id", params.id).single(),
        supabase.from("room_types").select("*").eq("property_id", params.id as string).order("sort_order"),
        supabase.from("function_spaces").select("*").eq("property_id", params.id as string).order("sort_order"),
        supabase.from("catering_packages").select("*").eq("property_id", params.id as string),
      ]);
      setProperty(p);
      setRoomTypes(rt ?? []);
      setSpaces(fs ?? []);
      setCatering(cp ?? []);
    }
    fetchData();
  }, [params.id, supabase]);

  if (!property) return <div className="text-[#666]">Loading...</div>;

  const address = property.address as Record<string, string> | null;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-[#888] hover:text-[#444] cursor-pointer">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-[22px] font-bold tracking-tight text-[#111]">{property.name}</h1>
          {address?.city && (
            <div className="flex items-center gap-1 text-sm text-[#666] mt-0.5">
              <MapPin className="h-3.5 w-3.5" />
              {[address.street, address.city, address.country].filter(Boolean).join(", ")}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {property.star_rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-[#D97706] fill-[#D97706]" />
              <span className="text-sm font-medium text-[#666]">{property.star_rating}-Star</span>
            </div>
          )}
          {property.total_rooms && (
            <Badge variant="secondary">{property.total_rooms} rooms</Badge>
          )}
        </div>
      </div>

      {property.description && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p className="text-[14px] leading-relaxed text-[#444]">{property.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Room Types */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-2">
          <Bed className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Room Types ({roomTypes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {roomTypes.length === 0 ? (
            <p className="text-sm text-[#666]">No room types configured yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f0f0f0] text-left text-[#888]">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium">Bed Config</th>
                    <th className="pb-2 font-medium text-center">Max Occ.</th>
                    <th className="pb-2 font-medium text-right">Rack Rate</th>
                    <th className="pb-2 font-medium text-right">Group Rate</th>
                    <th className="pb-2 font-medium text-right">Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {roomTypes.map((rt) => (
                    <tr key={rt.id} className="border-b border-[#f0f0f0] last:border-0">
                      <td className="py-3 font-medium text-[#111]">{rt.name}</td>
                      <td className="py-3 text-[#444]">{rt.bed_configuration}</td>
                      <td className="py-3 text-center text-[#444]">{rt.max_occupancy}</td>
                      <td className="py-3 text-right text-[#666]">{formatCurrency(rt.rack_rate)}</td>
                      <td className="py-3 text-right font-medium text-[#059669]">{formatCurrency(rt.group_rate)}</td>
                      <td className="py-3 text-right text-[#059669]">
                        {Math.round(((rt.rack_rate - rt.group_rate) / rt.rack_rate) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Function Spaces */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-2">
          <DoorOpen className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Function Spaces ({spaces.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {spaces.length === 0 ? (
            <p className="text-sm text-[#666]">No function spaces configured yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#f0f0f0] text-left text-[#888]">
                    <th className="pb-2 font-medium">Name</th>
                    <th className="pb-2 font-medium text-center">Size</th>
                    <th className="pb-2 font-medium text-center">Theater</th>
                    <th className="pb-2 font-medium text-center">Banquet</th>
                    <th className="pb-2 font-medium text-right">Full Day</th>
                    <th className="pb-2 font-medium text-right">Half Day</th>
                  </tr>
                </thead>
                <tbody>
                  {spaces.map((fs) => (
                    <tr key={fs.id} className="border-b border-[#f0f0f0] last:border-0">
                      <td className="py-3 font-medium text-[#111]">{fs.name}</td>
                      <td className="py-3 text-center text-[#444]">{fs.size_sqm} m²</td>
                      <td className="py-3 text-center text-[#444]">{fs.max_capacity_theater}</td>
                      <td className="py-3 text-center text-[#444]">{fs.max_capacity_banquet}</td>
                      <td className="py-3 text-right font-medium text-[#111]">{formatCurrency(fs.full_day_rate)}</td>
                      <td className="py-3 text-right text-[#666]">{formatCurrency(fs.half_day_rate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Catering */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center gap-2">
          <UtensilsCrossed className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Catering Packages ({catering.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {catering.length === 0 ? (
            <p className="text-sm text-[#666]">No catering packages configured yet.</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {catering.map((cp) => (
                <div key={cp.id} className="rounded-md border border-[#eee] p-4">
                  <p className="font-medium text-[#111]">{cp.name}</p>
                  <p className="text-xs text-[#888] capitalize mt-0.5">{cp.type}</p>
                  <p className="text-lg font-bold text-primary mt-2">
                    {formatCurrency(cp.price_per_person)}
                    <span className="text-xs font-normal text-[#666]"> /person</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Properties
        </Button>
      </div>
    </div>
  );
}

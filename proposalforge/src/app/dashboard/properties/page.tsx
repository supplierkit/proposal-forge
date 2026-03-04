import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, MapPin, Star } from "lucide-react";
import { AUTH_DISABLED, DEMO_PROFILE } from "@/lib/auth-config";
import { DEMO_PROPERTY } from "@/lib/demo-data";

export default async function PropertiesPage() {
  const supabase = await createServerSupabaseClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let properties: any[] | null = null;

  if (AUTH_DISABLED) {
    properties = [DEMO_PROPERTY];
  } else {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
      .from("users")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile) redirect("/login");

    const { data } = await supabase
      .from("properties")
      .select("*, room_types(count), function_spaces(count)")
      .eq("organization_id", profile.organization_id)
      .order("created_at", { ascending: false });
    properties = data;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#111]">Properties</h1>
          <p className="text-[14px] leading-relaxed text-[#444] mt-1">Manage your hotel properties and their offerings.</p>
        </div>
        <Link href="/dashboard/properties/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {!properties || properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-[#888] mb-4" />
            <h3 className="text-lg font-medium text-[#111] mb-2">No properties yet</h3>
            <p className="text-[14px] leading-relaxed text-[#444] mb-4 text-center max-w-md">
              Add your first hotel property to start creating proposals. Include room types,
              function spaces, and catering packages.
            </p>
            <Link href="/dashboard/properties/new">
              <Button>
                <Plus className="h-4 w-4" />
                Add your first property
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => {
            const address = property.address as Record<string, string> | null;
            return (
              <Link key={property.id} href={`/dashboard/properties/${property.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{property.name}</CardTitle>
                      {property.star_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-[#D97706] fill-[#D97706]" />
                          <span className="text-sm text-[#666]">{property.star_rating}</span>
                        </div>
                      )}
                    </div>
                    {address?.city && (
                      <div className="flex items-center gap-1 text-sm text-[#666]">
                        <MapPin className="h-3.5 w-3.5" />
                        {[address.city, address.country].filter(Boolean).join(", ")}
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {property.total_rooms && (
                        <Badge variant="secondary">{property.total_rooms} rooms</Badge>
                      )}
                      <Badge variant="secondary">
                        {(property.room_types as unknown as { count: number }[])?.[0]?.count ?? 0} room types
                      </Badge>
                      <Badge variant="secondary">
                        {(property.function_spaces as unknown as { count: number }[])?.[0]?.count ?? 0} spaces
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

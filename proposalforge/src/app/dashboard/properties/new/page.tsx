"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPropertyPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Get user's org
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: profile } = await supabase
      .from("users")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile) { setError("User profile not found"); setLoading(false); return; }

    const { error: insertError } = await supabase.from("properties").insert({
      organization_id: profile.organization_id,
      name: formData.get("name") as string,
      description: formData.get("description") as string || null,
      star_rating: formData.get("star_rating") ? Number(formData.get("star_rating")) : null,
      total_rooms: formData.get("total_rooms") ? Number(formData.get("total_rooms")) : null,
      contact_email: formData.get("contact_email") as string || null,
      contact_phone: formData.get("contact_phone") as string || null,
      address: {
        street: formData.get("street") as string || "",
        city: formData.get("city") as string || "",
        state: formData.get("state") as string || "",
        country: formData.get("country") as string || "",
        postal_code: formData.get("postal_code") as string || "",
      },
      currency: formData.get("currency") as string || "USD",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard/properties");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-bold tracking-tight text-[#111] mb-6">Add New Property</h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-[#DC2626]/10 p-3 text-sm text-[#DC2626] mb-4">
            {error}
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name *</Label>
              <Input id="name" name="name" placeholder="Grand Hotel Berlin" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="A luxury 5-star hotel in the heart of Berlin..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="star_rating">Star Rating</Label>
                <Input id="star_rating" name="star_rating" type="number" min={1} max={5} placeholder="5" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_rooms">Total Rooms</Label>
                <Input id="total_rooms" name="total_rooms" type="number" min={1} placeholder="200" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" name="currency" defaultValue="USD" placeholder="USD" />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Input id="street" name="street" placeholder="123 Hotel Street" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" placeholder="Berlin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State / Region</Label>
                <Input id="state" name="state" placeholder="Berlin" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" placeholder="Germany" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input id="postal_code" name="postal_code" placeholder="10115" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact_email">Email</Label>
              <Input id="contact_email" name="contact_email" type="email" placeholder="sales@grandhotel.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_phone">Phone</Label>
              <Input id="contact_phone" name="contact_phone" placeholder="+49 30 1234567" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Property"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Property {
  id: string;
  name: string;
}

export default function NewLeadPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    async function fetchProperties() {
      const { data } = await supabase
        .from("properties")
        .select("id, name")
        .order("name");
      if (data) setProperties(data);
    }
    fetchProperties();
  }, [supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const propertyId = formData.get("property_id") as string;

    if (!propertyId) {
      setError("Please select a property");
      setLoading(false);
      return;
    }

    // Create contact if provided
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    const { data: profile } = await supabase
      .from("users")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile) { setError("Profile not found"); setLoading(false); return; }

    let contactId: string | null = null;
    const contactFirstName = formData.get("contact_first_name") as string;
    const contactLastName = formData.get("contact_last_name") as string;

    if (contactFirstName && contactLastName) {
      const { data: contact, error: contactError } = await supabase
        .from("contacts")
        .insert({
          organization_id: profile.organization_id,
          first_name: contactFirstName,
          last_name: contactLastName,
          email: formData.get("contact_email") as string || null,
          company_name: formData.get("contact_company") as string || null,
          phone: formData.get("contact_phone") as string || null,
        })
        .select()
        .single();

      if (contactError) { setError(contactError.message); setLoading(false); return; }
      contactId = contact.id;
    }

    const { error: leadError } = await supabase.from("leads").insert({
      property_id: propertyId,
      contact_id: contactId,
      assigned_to: user.id,
      event_name: formData.get("event_name") as string,
      event_type: (formData.get("event_type") as string) || "other",
      event_start_date: formData.get("event_start_date") as string || null,
      event_end_date: formData.get("event_end_date") as string || null,
      estimated_attendees: formData.get("estimated_attendees") ? Number(formData.get("estimated_attendees")) : null,
      estimated_room_nights: formData.get("estimated_room_nights") ? Number(formData.get("estimated_room_nights")) : null,
      estimated_value: formData.get("estimated_value") ? Number(formData.get("estimated_value")) : null,
      requirements: formData.get("requirements") as string || null,
      source: "manual",
      status: "new",
    });

    if (leadError) { setError(leadError.message); setLoading(false); return; }

    router.push("/dashboard/leads");
    router.refresh();
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-bold tracking-tight text-[#111] mb-6">New Lead</h1>

      <form onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-[#DC2626]/10 p-3 text-sm text-[#DC2626] mb-4">{error}</div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property_id">Property *</Label>
              <select
                id="property_id"
                name="property_id"
                className="flex h-10 w-full rounded-md border border-[#eee] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a property</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_name">Event Name *</Label>
              <Input id="event_name" name="event_name" placeholder="Annual Sales Conference 2026" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event_type">Event Type</Label>
              <select
                id="event_type"
                name="event_type"
                className="flex h-10 w-full rounded-md border border-[#eee] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="conference">Conference</option>
                <option value="meeting">Meeting</option>
                <option value="wedding">Wedding</option>
                <option value="incentive">Incentive</option>
                <option value="exhibition">Exhibition</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event_start_date">Start Date</Label>
                <Input id="event_start_date" name="event_start_date" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_end_date">End Date</Label>
                <Input id="event_end_date" name="event_end_date" type="date" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimated_attendees">Attendees</Label>
                <Input id="estimated_attendees" name="estimated_attendees" type="number" min={1} placeholder="150" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_room_nights">Room Nights</Label>
                <Input id="estimated_room_nights" name="estimated_room_nights" type="number" min={1} placeholder="300" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimated_value">Est. Value ($)</Label>
                <Input id="estimated_value" name="estimated_value" type="number" min={0} placeholder="50000" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="Describe the event requirements: room setup, AV needs, catering preferences..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Contact (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_first_name">First Name</Label>
                <Input id="contact_first_name" name="contact_first_name" placeholder="Sarah" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_last_name">Last Name</Label>
                <Input id="contact_last_name" name="contact_last_name" placeholder="Johnson" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_company">Company</Label>
              <Input id="contact_company" name="contact_company" placeholder="Acme Corp" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email</Label>
                <Input id="contact_email" name="contact_email" type="email" placeholder="sarah@acme.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_phone">Phone</Label>
                <Input id="contact_phone" name="contact_phone" placeholder="+1 555 0123" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Lead"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

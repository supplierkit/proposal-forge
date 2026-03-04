"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STEPS = ["Property", "First Room", "Done"] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<string | null>(null);

  async function handleCreateProperty(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); setSaving(false); return; }

    const { data: profile } = await supabase
      .from("users")
      .select("organization_id")
      .eq("id", user.id)
      .single();

    if (!profile) { setError("Profile not found"); setSaving(false); return; }

    const { data: property, error: propError } = await supabase
      .from("properties")
      .insert({
        organization_id: profile.organization_id,
        name: formData.get("name") as string,
        description: formData.get("description") as string || null,
        star_rating: Number(formData.get("star_rating")) || null,
        total_rooms: Number(formData.get("total_rooms")) || null,
        address: {
          city: formData.get("city") as string || "",
          country: formData.get("country") as string || "",
        },
      })
      .select()
      .single();

    if (propError) {
      setError(propError.message);
      setSaving(false);
      return;
    }

    setPropertyId(property.id);
    setSaving(false);
    setStep(1);
  }

  async function handleCreateRoom(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const { error: roomError } = await supabase.from("room_types").insert({
      property_id: propertyId,
      name: formData.get("name") as string,
      max_occupancy: Number(formData.get("max_occupancy")) || 2,
      rack_rate: Number(formData.get("rack_rate")) || 0,
      group_rate: Number(formData.get("group_rate")) || 0,
      bed_configuration: formData.get("bed_configuration") as string || "King",
      sort_order: 0,
    });

    if (roomError) {
      setError(roomError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setStep(2);
  }

  return (
    <div className="min-h-screen bg-[#F6F7F8] flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i <= step
                    ? "bg-primary text-white"
                    : "bg-[#eee] text-[#666]"
                }`}
              >
                {i + 1}
              </div>
              <span className="text-sm text-[#444] hidden sm:inline">{label}</span>
              {i < STEPS.length - 1 && (
                <div className="w-8 h-0.5 bg-[#eee]" />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="rounded-md bg-[#DC2626]/5 p-3 text-sm text-[#DC2626] mb-4">{error}</div>
        )}

        {/* Step 1: Create Property */}
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Add Your First Property</CardTitle>
              <p className="text-sm text-[#666] mt-1">
                Let&apos;s set up your first hotel or venue to start creating proposals.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProperty} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Property Name *</Label>
                  <Input id="name" name="name" required placeholder="e.g. Grand Hotel Berlin" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" rows={2} placeholder="Brief description of your property" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="star_rating">Star Rating</Label>
                    <Input id="star_rating" name="star_rating" type="number" min="1" max="5" placeholder="4" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="total_rooms">Total Rooms</Label>
                    <Input id="total_rooms" name="total_rooms" type="number" placeholder="200" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" placeholder="Berlin" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" name="country" placeholder="Germany" />
                  </div>
                </div>
                <Button type="submit" disabled={saving} className="w-full">
                  {saving ? "Creating..." : "Create Property & Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Add a Room Type */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Add a Room Type</CardTitle>
              <p className="text-sm text-[#666] mt-1">
                Add at least one room type so AI can generate accurate proposals.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Room Name *</Label>
                  <Input id="name" name="name" required placeholder="e.g. Deluxe King" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="bed_configuration">Bed Configuration</Label>
                  <Input id="bed_configuration" name="bed_configuration" placeholder="King" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="max_occupancy">Max Occupancy</Label>
                    <Input id="max_occupancy" name="max_occupancy" type="number" defaultValue={2} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="rack_rate">Rack Rate ($)</Label>
                    <Input id="rack_rate" name="rack_rate" type="number" placeholder="250" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="group_rate">Group Rate ($)</Label>
                    <Input id="group_rate" name="group_rate" type="number" placeholder="189" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? "Saving..." : "Add Room & Finish"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setStep(2)}>
                    Skip
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Done */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>You&apos;re All Set!</CardTitle>
              <p className="text-sm text-[#666] mt-1">
                Your property is ready. Now you can create leads and generate AI-powered proposals.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm text-primary">
                <p className="font-medium mb-2">Quick Start Guide:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to <strong>Leads</strong> and create a new lead with event details</li>
                  <li>Click <strong>Generate AI Proposal</strong> on the lead page</li>
                  <li>Review and send the proposal to your client</li>
                </ol>
              </div>
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AUTH_DISABLED, DEMO_USER, DEMO_PROFILE } from "@/lib/auth-config";
import { DEMO_PROPERTY } from "@/lib/demo-data";
import {
  FileSearch,
  PenLine,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface Property {
  id: string;
  name: string;
}

type InputMode = "manual" | "rfp";

interface ExtractedData {
  event_name?: string;
  event_type?: string;
  organization_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_title?: string;
  event_start_date?: string;
  event_end_date?: string;
  estimated_attendees?: number;
  estimated_room_nights?: number;
  special_requests?: string[];
  budget_indication?: string;
  decision_timeline?: string;
  competing_venues?: string[];
  confidence_score?: number;
}

export default function NewLeadPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [inputMode, setInputMode] = useState<InputMode>("rfp");
  const [rfpText, setRfpText] = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [selectedProperty, setSelectedProperty] = useState("");

  useEffect(() => {
    async function fetchProperties() {
      if (AUTH_DISABLED) {
        setProperties([{ id: DEMO_PROPERTY.id, name: DEMO_PROPERTY.name }]);
        setSelectedProperty(DEMO_PROPERTY.id);
        return;
      }
      const { data } = await supabase
        .from("properties")
        .select("id, name")
        .order("name");
      if (data) setProperties(data);
    }
    fetchProperties();
  }, [supabase]);

  async function handleExtractRfp() {
    if (!rfpText.trim() || !selectedProperty) return;
    setExtracting(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/agents/rfp-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          raw_text: rfpText,
          source: "manual",
          property_id: selectedProperty,
        }),
      });
      const data = await res.json();

      if (data.data?.extraction) {
        setExtracted(data.data.extraction);
        // If the agent auto-created a lead, go directly to it
        if (data.data.created_lead_id) {
          router.push(`/dashboard/leads/${data.data.created_lead_id}`);
          return;
        }
      } else {
        setError("Could not extract details from this text. Try adding more event information.");
      }
    } catch {
      setError("Failed to process RFP. Please try again.");
    }
    setExtracting(false);
  }

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

    let userId = DEMO_USER.id;
    let orgId = DEMO_PROFILE.organization_id;

    if (!AUTH_DISABLED) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profile } = await supabase
        .from("users")
        .select("organization_id")
        .eq("id", user.id)
        .single();

      if (!profile) { setError("Profile not found"); setLoading(false); return; }
      userId = user.id;
      orgId = profile.organization_id;
    }

    let contactId: string | null = null;
    const contactFirstName = formData.get("contact_first_name") as string;
    const contactLastName = formData.get("contact_last_name") as string;

    if (contactFirstName && contactLastName) {
      const { data: contact, error: contactError } = await supabase
        .from("contacts")
        .insert({
          organization_id: orgId,
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

    const { data: lead, error: leadError } = await supabase.from("leads").insert({
      property_id: propertyId,
      contact_id: contactId,
      assigned_to: userId,
      event_name: formData.get("event_name") as string,
      event_type: (formData.get("event_type") as string) || "other",
      event_start_date: formData.get("event_start_date") as string || null,
      event_end_date: formData.get("event_end_date") as string || null,
      estimated_attendees: formData.get("estimated_attendees") ? Number(formData.get("estimated_attendees")) : null,
      estimated_room_nights: formData.get("estimated_room_nights") ? Number(formData.get("estimated_room_nights")) : null,
      estimated_value: formData.get("estimated_value") ? Number(formData.get("estimated_value")) : null,
      requirements: formData.get("requirements") as string || null,
      source: extracted ? "email" : "manual",
      status: "new",
    }).select("id").single();

    if (leadError) { setError(leadError.message); setLoading(false); return; }

    // Navigate directly to the new lead — not the list
    router.push(`/dashboard/leads/${lead?.id}`);
    router.refresh();
  }

  // Parse extracted contact name
  const extractedFirstName = extracted?.contact_name?.split(" ")[0] ?? "";
  const extractedLastName = extracted?.contact_name?.split(" ").slice(1).join(" ") ?? "";

  // Build requirements text from extracted data
  const extractedRequirements = extracted ? [
    ...(extracted.special_requests ?? []),
    extracted.budget_indication ? `Budget: ${extracted.budget_indication}` : null,
    extracted.decision_timeline ? `Decision timeline: ${extracted.decision_timeline}` : null,
    extracted.competing_venues?.length ? `Competing venues: ${extracted.competing_venues.join(", ")}` : null,
  ].filter(Boolean).join("\n") : "";

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-bold tracking-tight text-[#111] mb-2">New Lead</h1>
      <p className="text-[14px] text-[#666] mb-6">
        Paste an RFP to auto-extract details, or enter them manually.
      </p>

      {/* Input Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setInputMode("rfp")}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[14px] font-medium transition-colors cursor-pointer ${
            inputMode === "rfp"
              ? "border-primary bg-primary/5 text-primary"
              : "border-[#eee] text-[#666] hover:border-[#ccc]"
          }`}
        >
          <FileSearch className="h-4 w-4" />
          Paste an RFP
          <Badge variant="secondary" className="text-[10px] ml-1">AI</Badge>
        </button>
        <button
          onClick={() => setInputMode("manual")}
          className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-[14px] font-medium transition-colors cursor-pointer ${
            inputMode === "manual"
              ? "border-primary bg-primary/5 text-primary"
              : "border-[#eee] text-[#666] hover:border-[#ccc]"
          }`}
        >
          <PenLine className="h-4 w-4" />
          Enter Manually
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-[#DC2626]/10 p-3 text-sm text-[#DC2626] mb-4">{error}</div>
      )}

      {/* RFP Intake Mode */}
      {inputMode === "rfp" && !extracted && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Paste your RFP</CardTitle>
            </div>
            <p className="text-[13px] text-[#666]">
              Paste an email, RFP document, or event inquiry. Our AI will extract all the details automatically.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="property_select">Property *</Label>
              <select
                id="property_select"
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="flex h-10 w-full rounded-md border border-[#eee] bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select a property</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <Textarea
              value={rfpText}
              onChange={(e) => setRfpText(e.target.value)}
              rows={12}
              placeholder="Paste the RFP email, document text, or event inquiry here..."
              className="font-mono text-[13px]"
            />
            <Button
              onClick={handleExtractRfp}
              disabled={extracting || !rfpText.trim() || !selectedProperty}
              className="w-full"
              size="lg"
            >
              {extracting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting requirements...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Extract & Create Lead
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Extracted Data Success → Pre-filled Form */}
      {inputMode === "rfp" && extracted && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="py-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-[14px] font-medium text-primary">
                Extracted {extracted.confidence_score}% confidence
              </span>
              <span className="text-[13px] text-[#666] ml-2">Review the details below, then save.</span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-[13px]"
                onClick={() => { setExtracted(null); setRfpText(""); }}
              >
                Start over
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Form (shown always in manual mode, or after RFP extraction with pre-filled values) */}
      {(inputMode === "manual" || extracted) && (
        <form onSubmit={handleSubmit}>
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
                  defaultValue={selectedProperty}
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
                <Input
                  id="event_name"
                  name="event_name"
                  defaultValue={extracted?.event_name ?? ""}
                  placeholder="Annual Sales Conference 2026"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event_type">Event Type</Label>
                <select
                  id="event_type"
                  name="event_type"
                  defaultValue={extracted?.event_type ?? "conference"}
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
                  <Input
                    id="event_start_date"
                    name="event_start_date"
                    type="date"
                    defaultValue={extracted?.event_start_date ?? ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="event_end_date">End Date</Label>
                  <Input
                    id="event_end_date"
                    name="event_end_date"
                    type="date"
                    defaultValue={extracted?.event_end_date ?? ""}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_attendees">Attendees</Label>
                  <Input
                    id="estimated_attendees"
                    name="estimated_attendees"
                    type="number"
                    min={1}
                    defaultValue={extracted?.estimated_attendees ?? ""}
                    placeholder="150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estimated_room_nights">Room Nights</Label>
                  <Input
                    id="estimated_room_nights"
                    name="estimated_room_nights"
                    type="number"
                    min={1}
                    defaultValue={extracted?.estimated_room_nights ?? ""}
                    placeholder="300"
                  />
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
                  defaultValue={extractedRequirements}
                  placeholder="Describe the event requirements: room setup, AV needs, catering preferences..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Contact {!extracted && "(Optional)"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_first_name">First Name</Label>
                  <Input
                    id="contact_first_name"
                    name="contact_first_name"
                    defaultValue={extractedFirstName}
                    placeholder="Sarah"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_last_name">Last Name</Label>
                  <Input
                    id="contact_last_name"
                    name="contact_last_name"
                    defaultValue={extractedLastName}
                    placeholder="Johnson"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_company">Company</Label>
                <Input
                  id="contact_company"
                  name="contact_company"
                  defaultValue={extracted?.organization_name ?? ""}
                  placeholder="Acme Corp"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email">Email</Label>
                  <Input
                    id="contact_email"
                    name="contact_email"
                    type="email"
                    defaultValue={extracted?.contact_email ?? ""}
                    placeholder="sarah@acme.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone">Phone</Label>
                  <Input
                    id="contact_phone"
                    name="contact_phone"
                    defaultValue={extracted?.contact_phone ?? ""}
                    placeholder="+1 555 0123"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} size="lg" className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Save Lead
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

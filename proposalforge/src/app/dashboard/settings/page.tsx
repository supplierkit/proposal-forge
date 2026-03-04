"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AUTH_DISABLED, DEMO_PROFILE } from "@/lib/auth-config";

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="text-[#666]">Loading...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

function SettingsContent() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subscription, setSubscription] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [billingMessage, setBillingMessage] = useState<string | null>(null);

  useEffect(() => {
    const billing = searchParams.get("billing");
    if (billing === "success") setBillingMessage("Subscription activated successfully!");
    if (billing === "canceled") setBillingMessage("Checkout was canceled.");
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      if (AUTH_DISABLED) {
        setProfile(DEMO_PROFILE);
        setSubscription({ plan: "professional", status: "active", property_limit: 50, user_limit: 10 });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userData } = await supabase
        .from("users")
        .select("*, organizations(name, slug)")
        .eq("id", user.id)
        .single();

      setProfile(userData);

      if (userData?.organization_id) {
        const { data: subData } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("organization_id", userData.organization_id)
          .single();
        setSubscription(subData);
      }
    }
    fetchData();
  }, [supabase]);

  async function handleSaveProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);

    await supabase
      .from("users")
      .update({ full_name: formData.get("full_name") as string })
      .eq("id", profile.id);

    setSaving(false);
  }

  async function handleUpgrade(priceKey: string) {
    const res = await fetch("/api/v1/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceKey }),
    });
    const data = await res.json();
    if (data.data?.url) {
      window.location.href = data.data.url;
    }
  }

  if (!profile) return <div className="text-[#666]">Loading...</div>;

  const orgs = profile.organizations as unknown as { name: string; slug: string }[] | null;
  const org = Array.isArray(orgs) ? orgs[0] : orgs;

  return (
    <div className="max-w-2xl">
      <h1 className="text-[22px] font-bold tracking-tight text-[#111] mb-6">Settings</h1>

      {billingMessage && (
        <div className="rounded-md bg-secondary p-3 text-sm text-primary mb-4">
          {billingMessage}
        </div>
      )}

      {/* Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={profile.full_name ?? ""}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input value={profile.email ?? ""} disabled />
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <Input value={profile.role ?? ""} disabled />
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Organization */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#666]">Name</span>
            <span>{org?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666]">Slug</span>
            <span className="text-[#888]">{org?.slug}</span>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#666]">Plan</span>
                <Badge variant="default">{subscription.plan}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Status</span>
                <Badge
                  variant={
                    subscription.status === "active"
                      ? "success"
                      : subscription.status === "trialing"
                        ? "warning"
                        : "secondary"
                  }
                >
                  {subscription.status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">Property Limit</span>
                <span>{subscription.property_limit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666]">User Limit</span>
                <span>{subscription.user_limit}</span>
              </div>
            </div>
          )}

          {(!subscription || subscription.plan === "starter") && (
            <div className="pt-4 border-t border-[#f0f0f0] space-y-2">
              <p className="text-sm text-[#666]">Upgrade your plan to unlock more features.</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpgrade("professional_monthly")}
                  size="sm"
                >
                  Upgrade to Professional
                </Button>
                <Button
                  onClick={() => handleUpgrade("enterprise_monthly")}
                  variant="outline"
                  size="sm"
                >
                  Enterprise
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

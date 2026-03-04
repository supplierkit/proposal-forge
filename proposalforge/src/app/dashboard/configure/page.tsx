"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plug,
  FileEdit,
  Bot,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "integrations" | "templates" | "kit-actions";

const TABS: { id: Tab; label: string; icon: typeof Plug }[] = [
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "templates", label: "Templates", icon: FileEdit },
  { id: "kit-actions", label: "Kit Actions", icon: Bot },
];

const INTEGRATIONS = [
  {
    name: "Opera PMS",
    category: "Property Management",
    description: "Syncing room inventory, rates & availability in real-time",
    status: "connected" as const,
    lastSync: "2 min ago",
    direction: "inbound" as const,
  },
  {
    name: "Salesforce CRM",
    category: "Customer Relationship",
    description: "Syncing contacts, leads & opportunity data",
    status: "connected" as const,
    lastSync: "5 min ago",
    direction: "both" as const,
  },
  {
    name: "Website Lead Form",
    category: "Inbound Lead Source",
    description: "Auto-capturing new group booking inquiries",
    status: "connected" as const,
    lastSync: "12 min ago",
    direction: "inbound" as const,
  },
  {
    name: "Gmail",
    category: "Email Delivery",
    description: "Sending proposals, confirmations & follow-ups",
    status: "connected" as const,
    lastSync: "1 min ago",
    direction: "outbound" as const,
  },
  {
    name: "ITB Berlin API",
    category: "Event Lead Source",
    description: "Importing exhibitor inquiries & meeting requests",
    status: "syncing" as const,
    lastSync: "1 hr ago",
    direction: "inbound" as const,
  },
  {
    name: "HubSpot",
    category: "Marketing Automation",
    description: "Connect to sync campaign data & nurture sequences",
    status: "disconnected" as const,
    lastSync: null,
    direction: "both" as const,
  },
];

const KIT_ACTIONS = [
  {
    id: "confirm-details",
    name: "Confirm Details with Submitter",
    description:
      "When a new lead comes in, Kit sends a confirmation email to the submitter to verify event requirements before generating a proposal.",
    trigger: "New lead received",
    timing: "Immediate",
    enabled: true,
  },
  {
    id: "flag-out-of-policy",
    name: "Flag Out-of-Policy Proposals",
    description:
      "Kit flags proposals where pricing deviates from your configured guidance, routing them for manual review before sending.",
    trigger: "Proposal generated",
    timing: "Threshold: >5% deviation",
    enabled: true,
  },
  {
    id: "send-nudges",
    name: "Send Follow-up Nudges",
    description:
      "Kit sends friendly follow-ups on proposals that haven't been viewed or responded to, keeping the conversation alive.",
    trigger: "Proposal unviewed",
    timing: "3 days, 7 days, 14 days after send",
    enabled: true,
  },
  {
    id: "keep-warm",
    name: "Keep Communication Warm",
    description:
      "Kit sends periodic updates with property news, availability changes, and seasonal offers to maintain engagement on pending proposals.",
    trigger: "Proposal pending",
    timing: "Every 2 weeks",
    enabled: true,
  },
  {
    id: "auto-accept",
    name: "Auto-Accept Small Events",
    description:
      "Automatically confirm proposals under a certain value threshold without manual review.",
    trigger: "Proposal accepted",
    timing: "Threshold: <\u20AC5,000",
    enabled: false,
  },
];

export default function ConfigurePage() {
  const [activeTab, setActiveTab] = useState<Tab>("integrations");
  const [actions, setActions] = useState(KIT_ACTIONS);

  function toggleAction(id: string) {
    setActions((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-[#111]">
          Configure
        </h1>
        <p className="text-[#666] mt-1">
          Set up integrations, templates, and automated actions for your
          SupplierKit workflow.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-[#eee]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors cursor-pointer",
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-[#666] hover:text-[#444] hover:border-[#ddd]"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "integrations" && <IntegrationsTab />}
      {activeTab === "templates" && <TemplatesTab />}
      {activeTab === "kit-actions" && (
        <KitActionsTab actions={actions} onToggle={toggleAction} />
      )}
    </div>
  );
}

/* ── Integrations Tab ─────────────────────────────────────────────── */

function IntegrationsTab() {
  return (
    <div>
      {/* Data flow diagram */}
      <Card className="mb-6 bg-[#FAFFFE] border-[#d1fae5]">
        <CardContent className="py-4">
          <div className="flex items-center justify-center gap-3 text-sm">
            <div className="text-center">
              <div className="font-medium text-[#059669]">Inbound</div>
              <div className="text-[#666] text-xs">PMS, Website, ITB</div>
            </div>
            <ArrowRight className="h-4 w-4 text-[#059669]" />
            <div className="text-center px-4 py-1.5 bg-[#059669] text-white rounded-md font-medium">
              Kit AI
            </div>
            <ArrowRight className="h-4 w-4 text-[#059669]" />
            <div className="text-center">
              <div className="font-medium text-[#059669]">Outbound</div>
              <div className="text-[#666] text-xs">Email, CRM</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INTEGRATIONS.map((integration) => (
          <Card key={integration.name}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-[#111]">
                    {integration.name}
                  </h3>
                  <p className="text-xs text-[#888]">{integration.category}</p>
                </div>
                <StatusBadge status={integration.status} />
              </div>
              <p className="text-sm text-[#666] mb-3">
                {integration.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <DirectionBadge direction={integration.direction} />
                {integration.lastSync ? (
                  <span className="text-[#888] flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {integration.lastSync}
                  </span>
                ) : (
                  <span className="text-[#888]">Not connected</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: "connected" | "syncing" | "disconnected";
}) {
  if (status === "connected") {
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        Connected
      </Badge>
    );
  }
  if (status === "syncing") {
    return (
      <Badge variant="warning" className="gap-1">
        <Clock className="h-3 w-3" />
        Syncing
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1">
      <AlertCircle className="h-3 w-3" />
      Not Connected
    </Badge>
  );
}

function DirectionBadge({
  direction,
}: {
  direction: "inbound" | "outbound" | "both";
}) {
  const labels = { inbound: "Inbound", outbound: "Outbound", both: "Bi-directional" };
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#f4f4f5] rounded text-[#666]">
      {direction === "inbound" && <ArrowRight className="h-3 w-3 rotate-180" />}
      {direction === "outbound" && <ArrowRight className="h-3 w-3" />}
      {direction === "both" && (
        <>
          <ArrowRight className="h-3 w-3 rotate-180" />
          <ArrowRight className="h-3 w-3" />
        </>
      )}
      {labels[direction]}
    </span>
  );
}

/* ── Templates Tab ────────────────────────────────────────────────── */

function TemplatesTab() {
  return (
    <div className="space-y-6">
      {/* Proposal Template */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Proposal Template</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <span className="text-[#666] block">Brand</span>
              <span className="font-medium">Grand Hotel Berlin</span>
            </div>
            <div className="space-y-1">
              <span className="text-[#666] block">Currency</span>
              <span className="font-medium">EUR (\u20AC)</span>
            </div>
            <div className="space-y-1">
              <span className="text-[#666] block">Default Validity</span>
              <span className="font-medium">60 days</span>
            </div>
            <div className="space-y-1">
              <span className="text-[#666] block">Language</span>
              <span className="font-medium">English (DE fallback)</span>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f0f0f0]">
            <span className="text-[#666] text-sm block mb-2">
              Default Sections
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                "Cover",
                "Introduction",
                "Accommodation",
                "Meeting Spaces",
                "Dining & Catering",
                "Investment Summary",
                "Terms & Conditions",
              ].map((s) => (
                <Badge key={s} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pricing Guidance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pricing Guidance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-[#f0f0f0]">
              <div>
                <span className="text-[#666]">Group Rate Discount Range</span>
              </div>
              <span className="font-medium">15% \u2013 35% off rack rate</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#f0f0f0]">
              <div>
                <span className="text-[#666]">Minimum F&B per Person</span>
              </div>
              <span className="font-medium">\u20AC45</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#f0f0f0]">
              <div>
                <span className="text-[#666]">
                  Complimentary Upgrade Threshold
                </span>
              </div>
              <span className="font-medium">&gt;200 room nights</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <div>
                <span className="text-[#666]">Peak Season Surcharge</span>
              </div>
              <span className="font-medium">+15% (Jun\u2013Sep)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inclusions Defaults */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Default Inclusions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            {[
              {
                item: "High-Speed WiFi",
                rule: "Always included",
                active: true,
              },
              {
                item: "Breakfast Buffet",
                rule: "Included for groups >50 rooms",
                active: true,
              },
              {
                item: "Airport Transfers",
                rule: "Included for VIP contacts",
                active: true,
              },
              {
                item: "AV Equipment",
                rule: "Standard package included",
                active: true,
              },
              {
                item: "Welcome Amenity",
                rule: "Included for groups >100 rooms",
                active: true,
              },
              {
                item: "Late Checkout",
                rule: "Subject to availability",
                active: false,
              },
            ].map((inc) => (
              <div
                key={inc.item}
                className="flex items-center justify-between py-2 border-b border-[#f0f0f0] last:border-0"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle
                    className={cn(
                      "h-4 w-4",
                      inc.active ? "text-[#059669]" : "text-[#ccc]"
                    )}
                  />
                  <span className="font-medium">{inc.item}</span>
                </div>
                <span className="text-[#666]">{inc.rule}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ── Kit Actions Tab ──────────────────────────────────────────────── */

function KitActionsTab({
  actions,
  onToggle,
}: {
  actions: typeof KIT_ACTIONS;
  onToggle: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-sm text-[#666] mb-4">
        Define the automated actions that Kit takes during the proposal
        workflow. Toggle actions on or off to control Kit&apos;s behavior.
      </p>

      <div className="space-y-4">
        {actions.map((action) => (
          <Card
            key={action.id}
            className={cn(
              "transition-colors",
              !action.enabled && "opacity-60"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-[#111]">{action.name}</h3>
                    {action.enabled ? (
                      <Badge variant="success" className="text-xs">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Disabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-[#666] mb-3">
                    {action.description}
                  </p>
                  <div className="flex gap-4 text-xs text-[#888]">
                    <span>
                      Trigger: <strong className="text-[#666]">{action.trigger}</strong>
                    </span>
                    <span>
                      Timing: <strong className="text-[#666]">{action.timing}</strong>
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onToggle(action.id)}
                  className="mt-1 cursor-pointer text-[#666] hover:text-[#111] transition-colors"
                  title={action.enabled ? "Disable action" : "Enable action"}
                >
                  {action.enabled ? (
                    <ToggleRight className="h-7 w-7 text-[#059669]" />
                  ) : (
                    <ToggleLeft className="h-7 w-7" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

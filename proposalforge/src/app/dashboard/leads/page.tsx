"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Target } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { LeadStatus } from "@/types/database";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { DEMO_LEADS } from "@/lib/demo-data";

const STATUS_COLUMNS: { status: LeadStatus; label: string; color: "default" | "warning" | "success" | "destructive" | "secondary" }[] = [
  { status: "new", label: "New", color: "default" },
  { status: "qualified", label: "Qualified", color: "warning" },
  { status: "proposal_sent", label: "Proposal Sent", color: "secondary" },
  { status: "negotiating", label: "Negotiating", color: "warning" },
  { status: "won", label: "Won", color: "success" },
  { status: "lost", label: "Lost", color: "destructive" },
];

interface Lead {
  id: string;
  event_name: string;
  event_type: string;
  status: LeadStatus;
  estimated_value: number | null;
  estimated_attendees: number | null;
  event_start_date: string | null;
  created_at: string;
  properties: { name: string } | null;
  contacts: { first_name: string; last_name: string; company_name: string | null } | null;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [view, setView] = useState<"board" | "list">("board");
  const supabase = createClient();

  useEffect(() => {
    async function fetchLeads() {
      if (AUTH_DISABLED) {
        setLeads(DEMO_LEADS as unknown as Lead[]);
        return;
      }
      const { data } = await supabase
        .from("leads")
        .select("*, properties(name), contacts(first_name, last_name, company_name)")
        .order("created_at", { ascending: false });
      if (data) setLeads(data as unknown as Lead[]);
    }
    fetchLeads();
  }, [supabase]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-[#111]">Leads</h1>
          <p className="text-[14px] leading-relaxed text-[#444] mt-1">Track and manage your group sales pipeline.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex rounded-md border border-[#eee] overflow-hidden">
            <button
              className={`px-3 py-1.5 text-sm ${view === "board" ? "bg-secondary text-primary" : "bg-white text-[#444]"}`}
              onClick={() => setView("board")}
            >
              Board
            </button>
            <button
              className={`px-3 py-1.5 text-sm ${view === "list" ? "bg-secondary text-primary" : "bg-white text-[#444]"}`}
              onClick={() => setView("list")}
            >
              List
            </button>
          </div>
          <Link href="/dashboard/leads/new">
            <Button>
              <Plus className="h-4 w-4" />
              New Lead
            </Button>
          </Link>
        </div>
      </div>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-[#888] mb-4" />
            <h3 className="text-lg font-medium text-[#111] mb-2">No leads yet</h3>
            <p className="text-[14px] leading-relaxed text-[#444] mb-4 text-center max-w-md">
              Create your first lead to start tracking group inquiries and RFPs.
            </p>
            <Link href="/dashboard/leads/new">
              <Button>
                <Plus className="h-4 w-4" />
                Create first lead
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : view === "board" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((col) => {
            const columnLeads = leads.filter((l) => l.status === col.status);
            return (
              <div key={col.status} className="flex-shrink-0 w-72">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={col.color}>{col.label}</Badge>
                  <span className="text-sm text-[#666]">{columnLeads.length}</span>
                </div>
                <div className="space-y-3">
                  {columnLeads.map((lead) => (
                    <Link key={lead.id} href={`/dashboard/leads/${lead.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <h4 className="font-medium text-sm mb-1">{lead.event_name}</h4>
                          {lead.contacts && (
                            <p className="text-xs text-[#666]">
                              {lead.contacts.first_name} {lead.contacts.last_name}
                              {lead.contacts.company_name && ` - ${lead.contacts.company_name}`}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            {lead.estimated_value && (
                              <span className="text-xs font-medium text-[#059669]">
                                {formatCurrency(lead.estimated_value)}
                              </span>
                            )}
                            {lead.estimated_attendees && (
                              <span className="text-xs text-[#666]">
                                {lead.estimated_attendees} guests
                              </span>
                            )}
                          </div>
                          {lead.event_start_date && (
                            <p className="text-xs text-[#888] mt-1">
                              {formatDate(lead.event_start_date)}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#eee]">
                  <th className="text-left p-3 font-medium text-[#666]">Event</th>
                  <th className="text-left p-3 font-medium text-[#666]">Contact</th>
                  <th className="text-left p-3 font-medium text-[#666]">Status</th>
                  <th className="text-left p-3 font-medium text-[#666]">Value</th>
                  <th className="text-left p-3 font-medium text-[#666]">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-[#f0f0f0] hover:bg-[#FAFAFA]">
                    <td className="p-3">
                      <Link href={`/dashboard/leads/${lead.id}`} className="font-medium text-primary hover:underline">
                        {lead.event_name}
                      </Link>
                    </td>
                    <td className="p-3 text-[#444]">
                      {lead.contacts ? `${lead.contacts.first_name} ${lead.contacts.last_name}` : "—"}
                    </td>
                    <td className="p-3">
                      <Badge variant={STATUS_COLUMNS.find(c => c.status === lead.status)?.color ?? "secondary"}>
                        {STATUS_COLUMNS.find(c => c.status === lead.status)?.label ?? lead.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-[#444]">
                      {lead.estimated_value ? formatCurrency(lead.estimated_value) : "—"}
                    </td>
                    <td className="p-3 text-[#666]">
                      {lead.event_start_date ? formatDate(lead.event_start_date) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

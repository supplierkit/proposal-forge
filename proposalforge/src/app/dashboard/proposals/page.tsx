"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, Clock } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { ProposalStatus } from "@/types/database";

const STATUS_BADGE: Record<ProposalStatus, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" }> = {
  draft: { label: "Draft", variant: "secondary" },
  sent: { label: "Sent", variant: "default" },
  viewed: { label: "Viewed", variant: "warning" },
  accepted: { label: "Accepted", variant: "success" },
  declined: { label: "Declined", variant: "destructive" },
  expired: { label: "Expired", variant: "secondary" },
};

interface Proposal {
  id: string;
  title: string;
  status: ProposalStatus;
  total_value: number | null;
  public_token: string;
  created_at: string;
  sent_at: string | null;
  viewed_at: string | null;
  leads: { event_name: string; contacts: { first_name: string; last_name: string } | null } | null;
  properties: { name: string } | null;
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchProposals() {
      const { data } = await supabase
        .from("proposals")
        .select("*, leads(event_name, contacts(first_name, last_name)), properties(name)")
        .order("created_at", { ascending: false });
      if (data) setProposals(data as unknown as Proposal[]);
    }
    fetchProposals();
  }, [supabase]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Proposals</h1>
          <p className="text-gray-500 mt-1">Manage and track your group sales proposals.</p>
        </div>
      </div>

      {proposals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No proposals yet</h3>
            <p className="text-gray-500 mb-4 text-center max-w-md">
              Create a lead first, then generate an AI-powered proposal for it.
            </p>
            <Link href="/dashboard/leads/new">
              <Button>Create a Lead</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {proposals.map((proposal) => {
            const status = STATUS_BADGE[proposal.status];
            return (
              <Link key={proposal.id} href={`/dashboard/proposals/${proposal.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium">{proposal.title}</h3>
                        <p className="text-sm text-gray-500">
                          {proposal.properties?.name}
                          {proposal.leads?.contacts && (
                            <> &middot; {proposal.leads.contacts.first_name} {proposal.leads.contacts.last_name}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {proposal.total_value && (
                        <span className="text-sm font-medium text-gray-700">
                          {formatCurrency(proposal.total_value)}
                        </span>
                      )}
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        {proposal.viewed_at ? (
                          <><Eye className="h-3.5 w-3.5" /> Viewed</>
                        ) : (
                          <><Clock className="h-3.5 w-3.5" /> {formatDate(proposal.created_at)}</>
                        )}
                      </div>
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

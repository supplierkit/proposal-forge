"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function ContactsPage() {
  const supabase = createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchContacts() {
      const { data } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });
      setContacts(data ?? []);
    }
    fetchContacts();
  }, [supabase]);

  const filtered = contacts.filter((c) => {
    const term = search.toLowerCase();
    return (
      !term ||
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(term) ||
      c.email?.toLowerCase().includes(term) ||
      c.company_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            All Contacts ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">
              No contacts found. Contacts are created automatically when you add leads.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {contact.first_name} {contact.last_name}
                    </p>
                    {contact.company_name && (
                      <p className="text-sm text-gray-500">
                        {contact.company_name}
                        {contact.title ? ` — ${contact.title}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    {contact.email && (
                      <Link
                        href={`mailto:${contact.email}`}
                        className="text-blue-600 hover:underline block"
                      >
                        {contact.email}
                      </Link>
                    )}
                    {contact.phone && (
                      <p className="text-gray-500">{contact.phone}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

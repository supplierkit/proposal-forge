"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AUTH_DISABLED } from "@/lib/auth-config";
import { SupplierKitLogo } from "@/components/ui/supplierkit-logo";
import {
  Building2,
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  SlidersHorizontal,
  LogOut,
  Target,
  Bot,
  ClipboardCheck,
  BookOpen,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Leads", href: "/dashboard/leads", icon: Target },
  { name: "Proposals", href: "/dashboard/proposals", icon: FileText },
  { name: "Contacts", href: "/dashboard/contacts", icon: Users },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

const secondaryNavigation = [
  { name: "AI Activity", href: "/dashboard/agents", icon: Bot },
  { name: "Obligations", href: "/dashboard/obligations", icon: ClipboardCheck },
  { name: "Playbooks", href: "/dashboard/playbooks", icon: BookOpen },
  { name: "Configure", href: "/dashboard/configure", icon: SlidersHorizontal },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-[#eee] bg-white">
      <div className="flex h-16 items-center border-b border-[#eee] px-6">
        <SupplierKitLogo />
      </div>

      <nav className="flex-1 overflow-auto px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-colors",
                  isActive
                    ? "bg-secondary text-primary"
                    : "text-[#444] hover:bg-[#FAFAFA] hover:text-[#111]"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-[#eee]">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-primary"
                      : "text-[#444] hover:bg-[#FAFAFA] hover:text-[#111]"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {!AUTH_DISABLED && (
        <div className="border-t border-[#eee] p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[14px] font-medium text-[#444] hover:bg-[#FAFAFA] hover:text-[#111] transition-colors cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

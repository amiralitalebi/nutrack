"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  UserRound,
  Settings,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/log", label: "Log", icon: PlusCircle },
  { href: "/history", label: "History", icon: History },
  { href: "/profile", label: "Profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          <Card className="h-fit rounded-2xl border-zinc-200/60 bg-white/70 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold tracking-tight">Nutrack</div>
                <div className="text-xs text-muted-foreground">Daily nutrition log</div>
              </div>
              <Button size="sm" className="rounded-xl">
                New
              </Button>
            </div>

            <Separator className="my-4" />

            <nav className="grid gap-1">
              {nav.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
                      active
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-700 hover:bg-zinc-100"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", active ? "text-white" : "text-zinc-500")} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <Separator className="my-4" />

            <div className="rounded-2xl border border-zinc-200/60 bg-white p-3">
              <div className="text-xs text-muted-foreground">Tip</div>
              <div className="mt-1 text-sm">
                Keep it simple: log meals first, add AI later.
              </div>
            </div>
          </Card>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ListChecks,
  PenLine,
  BarChart3,
  Users,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/plan", label: "План дня", icon: ListChecks },
  { href: "/drafts", label: "Черновики", icon: PenLine },
  { href: "/analytics", label: "Аналитика", icon: BarChart3 },
  { href: "/leads", label: "Лиды", icon: Users },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          PipelineHQ
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "w-full justify-start gap-3 px-3 h-10 text-sm font-medium",
                isActive
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link href={item.href}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="border-t px-3 py-4">
        <Button
          variant="ghost"
          asChild
          className="w-full justify-start gap-3 px-3 h-10 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Link href="/strategy">
            <Settings className="h-4 w-4" />
            Стратегия
          </Link>
        </Button>
      </div>
    </div>
  );
}

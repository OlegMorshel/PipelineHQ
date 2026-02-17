"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ListChecks, PenLine, BarChart3, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/plan", label: "План", icon: ListChecks },
  { href: "/drafts", label: "Посты", icon: PenLine },
  { href: "/analytics", label: "Статы", icon: BarChart3 },
  { href: "/leads", label: "Лиды", icon: Users },
];

export function BottomTabBar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 border-t bg-background/80 backdrop-blur-lg z-50",
        className
      )}
    >
      <nav className="mx-auto flex max-w-[600px] justify-around py-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition-colors",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

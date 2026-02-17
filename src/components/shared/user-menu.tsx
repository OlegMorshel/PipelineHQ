"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "@/lib/auth-client";

export function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-3 px-3 py-2">
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-1">
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          <div className="h-2 w-28 rounded bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex items-center gap-3 px-3 py-2">
      {/* Avatar */}
      {session.user.image ? (
        <img
          src={session.user.image}
          alt={session.user.name}
          className="h-8 w-8 rounded-full object-cover"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {/* Name & Email */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{session.user.name}</p>
        <p className="truncate text-[11px] text-muted-foreground">
          {session.user.email}
        </p>
      </div>

      {/* Sign Out */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
        onClick={handleSignOut}
        title="Выйти"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

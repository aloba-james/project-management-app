"use client";

import React, { useState } from "react";
import { Menu, Moon, Search, Settings, Sun, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useClerk, useUser } from "@clerk/nextjs";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

const clerkEnabled = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

const Navbar = () => {
  if (clerkEnabled) {
    return <ClerkNavbarShell />;
  }
  return <NextAuthNavbarShell />;
};

function NavbarChrome({
  displayName,
  avatarUrl,
  onSignOut,
}: {
  displayName: string;
  avatarUrl?: string | null;
  onSignOut: () => void;
}) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchValue.trim();
    router.push(query ? `/search?q=${encodeURIComponent(query)}` : "/search");
  };

  const initials = displayName
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between border-b bg-card px-4 py-3">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </Button>

        <form
          className="relative hidden w-[220px] sm:block"
          onSubmit={handleSearchSubmit}
        >
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="bg-muted/50 pl-8"
            type="search"
            placeholder="Search everything…"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>

      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Link>
        </Button>

        <Separator orientation="vertical" className="mx-2 hidden h-6 md:block" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="hidden gap-2 px-2 md:flex"
              aria-label="Account menu"
            >
              <Avatar className="h-8 w-8">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt={displayName} />
                ) : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="max-w-[10rem] truncate text-sm font-medium">
                {displayName}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function NextAuthNavbarShell() {
  const { data: session } = useSession();
  const displayName =
    session?.user?.username ||
    session?.user?.name ||
    session?.user?.email ||
    "User";
  return (
    <NavbarChrome
      displayName={displayName}
      avatarUrl={session?.user?.image}
      onSignOut={() => void signOut({ callbackUrl: "/login" })}
    />
  );
}

function ClerkNavbarShell() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const displayName =
    user?.fullName ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress ||
    "User";
  return (
    <NavbarChrome
      displayName={displayName}
      avatarUrl={user?.imageUrl}
      onSignOut={() => void signOut({ redirectUrl: "/login" })}
    />
  );
}

export default Navbar;

"use client";

import Header from "@/components/Header";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const Settings = () => {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  return (
    <div className="p-8">
      <Header name="Settings" />
      <Card className="max-w-xl">
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-1">
            <Label>Username</Label>
            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              {session?.user?.username || session?.user?.name || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              {session?.user?.email || "—"}
            </p>
          </div>
          <div className="space-y-1">
            <Label>Signed in with</Label>
            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              {session?.user?.provider
                ? session.user.provider.charAt(0).toUpperCase() +
                  session.user.provider.slice(1)
                : "—"}
            </p>
          </div>
          <div className="space-y-1">
            <Label>User ID</Label>
            <p className="rounded-md border bg-muted/40 px-3 py-2 text-sm">
              {session?.user?.appUserId ?? "Pending sync"}
            </p>
          </div>
          <Separator />
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
            >
              {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
              }
            >
              {isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sign out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;

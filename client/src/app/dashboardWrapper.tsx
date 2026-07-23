"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { GoalBar } from "@/components/flox/GoalBar";
import StoreProvider, { useAppSelector } from "./redux";
import { AppProviders } from "@/components/Providers";
import { usePathname } from "next/navigation";
import { useWorkspaceStore } from "@/stores/workspace-store";

const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isHome = pathname === "/";
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <Sidebar />
      <main
        className={`flex w-full flex-col bg-background ${
          isSidebarCollapsed ? "" : "md:pl-64"
        }`}
      >
        <Navbar />
        <div className={isHome ? "" : "pb-24"}>{children}</div>
        {!isHome && <GoalBar workspaceId={activeWorkspaceId} />}
      </main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <AppProviders clerkEnabled={clerkEnabled}>
      <StoreProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </StoreProvider>
    </AppProviders>
  );
};

export default DashboardWrapper;

"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/nextjs";
import { SessionProvider } from "next-auth/react";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
      },
    },
  });
}

type Props = {
  children: React.ReactNode;
  clerkEnabled: boolean;
};

export function AppProviders({ children, clerkEnabled }: Props) {
  const [queryClient] = useState(() => makeQueryClient());

  const withQuery = (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  if (clerkEnabled) {
    return <ClerkProvider>{withQuery}</ClerkProvider>;
  }

  return <SessionProvider>{withQuery}</SessionProvider>;
}

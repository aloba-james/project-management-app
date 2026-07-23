"use client";

import { SignIn } from "@clerk/nextjs";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);

type ProvidersMap = Record<string, { id: string; name: string }>;

const ClerkLogin = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted via-background to-accent px-4">
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">AKList</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to continue to your workspace
        </p>
      </div>
      <SignIn
        routing="hash"
        fallbackRedirectUrl="/"
        signUpFallbackRedirectUrl="/"
      />
    </div>
  </div>
);

const NextAuthLogin = () => {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [providers, setProviders] = useState<ProvidersMap | null>(null);
  const [providersError, setProvidersError] = useState(false);
  const authError = searchParams.get("error");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/providers")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load providers");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setProviders(data || {});
          setProvidersError(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProviders({});
          setProvidersError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading" || status === "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const googleReady = Boolean(providers?.google);
  const githubReady = Boolean(providers?.github);
  const anyReady = googleReady || githubReady;
  const checking = providers === null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-muted via-background to-accent px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">AKList</CardTitle>
          <CardDescription>
            Sign in to continue to your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {authError && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Sign-in failed ({authError}). Check OAuth redirect URIs match
              exactly:
              <div className="mt-2 break-all text-xs">
                http://localhost:3000/api/auth/callback/google
                <br />
                http://localhost:3000/api/auth/callback/github
              </div>
            </div>
          )}

          {!checking && !anyReady && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
              {providersError
                ? "Could not load auth providers. Restart the client and try again."
                : "No OAuth providers detected. Add credentials to client/.env and restart pnpm run dev."}
            </div>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full gap-3"
            disabled={checking || !googleReady}
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            Continue with Google
          </Button>

          <Button
            type="button"
            className="w-full gap-3 bg-foreground text-background hover:bg-foreground/90"
            disabled={checking || !githubReady}
            onClick={() => signIn("github", { callbackUrl: "/" })}
          >
            Continue with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const LoginPage = () => (
  <Suspense
    fallback={
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    }
  >
    {clerkEnabled ? <ClerkLogin /> : <NextAuthLogin />}
  </Suspense>
);

export default LoginPage;

import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import type { User as AppUser } from "@/state/api";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

async function syncUserWithApi(params: {
  provider: string;
  providerAccountId: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}): Promise<AppUser | null> {
  if (!apiBaseUrl) return null;

  const oauthId = `${params.provider}:${params.providerAccountId}`;
  const username =
    params.name?.replace(/\s+/g, "") ||
    params.email?.split("@")[0] ||
    `${params.provider}_${params.providerAccountId.slice(0, 8)}`;

  try {
    const response = await fetch(`${apiBaseUrl}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cognitoId: oauthId,
        username,
        profilePictureUrl: params.image || undefined,
      }),
    });

    if (!response.ok) return null;
    return (await response.json()) as AppUser;
  } catch {
    return null;
  }
}

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account && user) {
        const appUser = await syncUserWithApi({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          name: user.name,
          email: user.email,
          image: user.image,
        });

        token.oauthId = `${account.provider}:${account.providerAccountId}`;
        token.provider = account.provider;
        token.appUserId = appUser?.userId;
        token.username = appUser?.username || user.name || user.email || "User";
        token.picture = appUser?.profilePictureUrl || user.image;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.oauthId = token.oauthId as string | undefined;
        session.user.provider = token.provider as string | undefined;
        session.user.appUserId = token.appUserId as number | undefined;
        session.user.username = token.username as string | undefined;
        session.user.image = (token.picture as string | undefined) || session.user.image;
        session.user.email = (token.email as string | undefined) || session.user.email;
      }
      return session;
    },
  },
  secret:
    process.env.NEXTAUTH_SECRET ||
    (process.env.NODE_ENV === "production"
      ? undefined
      : "local-dev-secret-change-me-before-production"),
};

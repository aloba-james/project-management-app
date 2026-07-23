import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import withAuth from "next-auth/middleware";

const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY,
);

const isProtected = createRouteMatcher([
  "/",
  "/workspaces(.*)",
  "/brain(.*)",
  "/planner(.*)",
  "/projects(.*)",
  "/priority(.*)",
  "/search",
  "/settings",
  "/users",
  "/teams",
  "/timeline",
  "/calendar",
]);

const clerkMw = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) {
    await auth.protect();
  }
});

const nextAuthMw = withAuth({
  pages: { signIn: "/login" },
});

// Dual auth: Clerk when configured, otherwise NextAuth (existing OAuth).
const middleware = clerkEnabled ? clerkMw : nextAuthMw;

export default middleware;

export const config = {
  matcher: [
    "/",
    "/workspaces/:path*",
    "/brain",
    "/brain/:path*",
    "/planner",
    "/planner/:path*",
    "/projects/:path*",
    "/priority/:path*",
    "/search",
    "/settings",
    "/users",
    "/teams",
    "/timeline",
    "/calendar",
  ],
};

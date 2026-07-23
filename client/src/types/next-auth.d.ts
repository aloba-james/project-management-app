import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      oauthId?: string;
      provider?: string;
      appUserId?: number;
      username?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    oauthId?: string;
    provider?: string;
    appUserId?: number;
    username?: string;
    picture?: string | null;
    email?: string | null;
  }
}

import { config as loadEnv } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Next only auto-loads client/.env — pull DATABASE_URL from server when missing/empty.
if (!process.env.DATABASE_URL?.trim()) {
  loadEnv({
    path: path.resolve(__dirname, "../server/.env"),
    override: false,
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: import.meta.dirname,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;

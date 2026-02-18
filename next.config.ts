import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* your other Next.js config options */

  // 👇 Add this block to explicitly allow development origins
  allowedDevOrigins: [
    "localhost",          // always allow localhost
    "127.0.0.1",          // loopback
    "10.62.237.96",       // your LAN IP (adjust if different)
    // you can add more hostnames or IPs here if needed
  ],
};

export default withSentryConfig(nextConfig, {
  org: "personal-organization-ga",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // tunnelRoute: "/monitoring", // optional
  webpack: {
    automaticVercelMonitors: true,
    treeshake: {
      removeDebugLogging: true,
    },
  },
});

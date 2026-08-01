/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow iPhone / LAN access during `next dev` (e.g. http://192.168.x.x:3000)
  allowedDevOrigins: [
    "192.168.0.187",
    "127.0.0.1",
    "localhost",
    ...(process.env.ALLOWED_DEV_ORIGINS?.split(",").map((s) => s.trim()).filter(Boolean) ?? []),
  ],
};

export default nextConfig;

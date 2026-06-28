/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow cross-origin dev requests from any host on the local network
  // (e.g. testing the dev server from a phone at 192.168.x.x).
  allowedDevOrigins: [
    "*",
    "192.168.0.151",
    "192.168.0.*",
    "192.168.*.*",
    "10.0.*.*",
    "172.16.*.*",
  ],
};

export default nextConfig;

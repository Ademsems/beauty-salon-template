/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Instagram CDN images (used in InstagramGrid)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
      },
    ],
  },

  // Strict mode for catching bugs early
  reactStrictMode: true,
};

module.exports = nextConfig;

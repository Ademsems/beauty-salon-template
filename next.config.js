/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Unsplash placeholder images and any IG CDN
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
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

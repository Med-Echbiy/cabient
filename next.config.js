/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "cdn.sanity.io",
      },
    ],
  },
  compiler: {
    removeConsole: true,
  },
};

module.exports = nextConfig;

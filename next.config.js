/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  basePath: isProd ? "" : "",
  assetPrefix: isProd ? "/" : "/",
  images: {
      unoptimized: true, // tắt Image Optimization
      domains: [
        "scontent.fsgn5-15.fna.fbcdn.net",
        "scontent.xx.fbcdn.net",
        "cdn.pixabay.com",
        "images.unsplash.com"
      ],
    },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: "",
  assetPrefix: "",
  images: {
    // nếu muốn dùng next/image chuẩn thì bỏ dòng dưới
    unoptimized: true,
  },
};

module.exports = nextConfig;

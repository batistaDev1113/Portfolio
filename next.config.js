/** @type {import('next').NextConfig} */

const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
    });
    return config;
  },
  images: {
    domains: ["flowbite.com"],
  },
  reactStrictMode: true,
  swcMinify: true,
};

// const nextConfig = {}

module.exports = nextConfig;

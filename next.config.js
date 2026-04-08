/** @type {import('next').NextConfig} */

const nextConfig = {
  // Source maps for production debugging and Lighthouse insights
  productionBrowserSourceMaps: true,

  // Performance optimizations
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['framer-motion', 'react-icons'],
    turbopackFileSystemCacheForDev: true,
    optimizeCss: true,
  },

  // Turbopack configuration
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimizations
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    qualities: [75, 90],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Bundle optimization
  webpack: (config) => {
    // PDF file handling
    config.module.rules.push({
      test: /\.pdf$/,
      use: {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    });

    return config;
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://vitals.vercel-insights.com https://vercel.live wss://ws-us3.pusher.com https://*.sentry.io; worker-src blob:; frame-ancestors 'self'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
    ];
  },

  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  compress: true,
};

// const nextConfig = {}

module.exports = nextConfig;

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'software-engineer-dn',
    project: 'portfolio-nextjs',

    // Source map configuration
    sourcemaps: {
      disable: process.env.NODE_ENV === 'development',
      deleteSourcemapsAfterUpload: true,
    },

    // Error handling for API timeouts
    errorHandler: (err) => {
      console.warn('Sentry CLI warning:', err);
      // Don't fail the build on Sentry API errors
      return false;
    },

    // Release configuration to prevent timeouts
    release: {
      finalize: false,
    },

    // Deploy configuration
    deploy: {
      env: process.env.NODE_ENV,
    },
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);

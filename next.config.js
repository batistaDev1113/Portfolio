/** @type {import('next').NextConfig} */

const nextConfig = {
  // Source maps are uploaded to Sentry via withSentryConfig below; keep them
  // out of the browser bundle to reduce TBT and per-chunk transfer on both
  // mobile and desktop.
  productionBrowserSourceMaps: false,

  // Performance optimizations
  reactCompiler: true,
  experimental: {
    optimizePackageImports: ['react-icons'],
    turbopackFileSystemCacheForDev: true,
    optimizeCss: true,
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Image optimizations (Next.js handles SVG assets natively; no extra loader needed)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    qualities: [75, 80, 90],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

// Sentry v11: withSentryConfig now lives in '@sentry/nextjs/config'
// and takes a single options object.
const { withSentryConfig } = require('@sentry/nextjs/config');

module.exports = withSentryConfig(module.exports, {
  // Suppresses source map uploading logs during build
  silent: true,
  org: 'software-engineer-dn',
  project: 'portfolio-nextjs',

  // Source maps are uploaded, then deleted so they never ship to the browser
  sourcemaps: {
    disable: process.env.NODE_ENV === 'development',
    deleteSourcemapsAfterUpload: true,
  },

  // Don't fail the build on Sentry API errors
  errorHandler: (err) => {
    console.warn('Sentry CLI warning:', err);
    return false;
  },

  // Release configuration to prevent timeouts
  release: {
    finalize: false,
    deploy: {
      env: process.env.NODE_ENV,
    },
  },

  // Routes browser requests to Sentry through a Next.js rewrite to get past ad-blockers
  tunnelRoute: '/monitoring',

  webpack: {
    // Tree-shake Sentry debug logging (was disableLogger)
    treeshake: {
      removeDebugLogging: true,
    },
    // Vercel Cron Monitors instrumentation (was automaticVercelMonitors)
    automaticVercelMonitors: true,
  },
});

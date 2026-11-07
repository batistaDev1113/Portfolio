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

// @sentry/nextjs v11 moved the Next.js build wrapper to the `./config`
// subpath export and collapsed its options into a single object.
// See: https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs/config');

module.exports = withSentryConfig(nextConfig, {
  // Suppresses source map uploading logs during build
  silent: true,
  org: 'software-engineer-dn',
  project: 'portfolio-nextjs',

  // Routes browser requests to Sentry through a Next.js rewrite to circumvent
  // ad-blockers (increases server load)
  tunnelRoute: '/monitoring',

  // Source map configuration
  sourcemaps: {
    disable: process.env.NODE_ENV === 'development',
    deleteSourcemapsAfterUpload: true,
  },

  // Don't fail the build on Sentry API errors
  errorHandler: (err) => {
    console.warn('Sentry CLI warning:', err);
  },

  // Release configuration to prevent timeouts
  release: {
    finalize: false,
  },

  // Deploy configuration
  deploy: {
    env: process.env.NODE_ENV,
  },

  // Enables automatic instrumentation of Vercel Cron Monitors.
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  webpack: {
    automaticVercelMonitors: true,
  },

  // Tree-shake Sentry debug logging to reduce bundle size
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },
});

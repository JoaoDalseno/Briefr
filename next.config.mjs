/** @type {import('next').NextConfig} */

// Content Security Policy
// - 'unsafe-inline' and 'unsafe-eval' are required by Next.js 14 dev mode and
//   client-side hydration. For production hardening, replace with nonces.
// - Extend connect-src when adding third-party APIs (Stripe.js, etc.)
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data: https:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.anthropic.com https://api.stripe.com",
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join('; ')

const securityHeaders = [
  // Blocks the page from being embedded in iframes — prevents clickjacking
  { key: 'X-Frame-Options', value: 'DENY' },

  // Prevents browsers from MIME-sniffing a response away from the declared content-type
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Forces HTTPS for 2 years, includes subdomains, eligible for preload list
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },

  // Controls how much referrer info is sent with requests
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // Restricts browser features — disable those not needed by this app
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },

  // Content Security Policy
  { key: 'Content-Security-Policy', value: csp },
]

const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig;

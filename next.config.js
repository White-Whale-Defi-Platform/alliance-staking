/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

/**
 * @0xFable - Suppress errant recoil errors which seem to occur due to hot reloading
 * When using the app there is constant recoil warnings in the logs that users could see which indicate
 * almost fatal issues with the state.
 * Rather than this meaning an issue, on multiple SSR based frameworks there is an issue noted with seeing this on refreshes
 * possible because the state/pages are being loaded with hot module replacement
 * For more info go here: https://github.com/facebookexperimental/Recoil/issues/733
 */
const intercept = require('intercept-stdout');

// safely ignore recoil stdout warning messages
function interceptStdout(text) {
  if (text.includes('Duplicate atom key')) {
    return '';
  }
  return text;
}

// Intercept in dev and prod
intercept(interceptStdout);

module.exports = nextConfig;

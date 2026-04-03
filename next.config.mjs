const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverComponentsExternalPackages: ["@heygen/streaming-avatar", "@vapi-ai/web", "openai", "puppeteer", "pdf-parse"],
  },
};

export default nextConfig;

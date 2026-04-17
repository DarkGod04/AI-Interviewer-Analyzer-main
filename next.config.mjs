const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["@heygen/streaming-avatar", "@vapi-ai/web", "openai", "puppeteer", "pdf-parse"],
};

export default nextConfig;

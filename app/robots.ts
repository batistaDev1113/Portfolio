import { MetadataRoute } from 'next';

// Cloudflare Content Signals Policy: declare how crawlers may use site content.
// search = search indexing, ai-input = RAG/grounding, ai-train = model training.
// See https://content-signals.org/
const contentSignal = {
  other: {
    'Content-Signal': 'search=yes, ai-train=no, ai-input=yes',
  },
};

const allowAll = { allow: '/' as const, ...contentSignal };

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', ...allowAll },
      { userAgent: 'GPTBot', ...allowAll },
      { userAgent: 'ChatGPT-User', ...allowAll },
      { userAgent: 'ClaudeBot', ...allowAll },
      { userAgent: 'Claude-Web', ...allowAll },
      { userAgent: 'PerplexityBot', ...allowAll },
      { userAgent: 'Google-Extended', ...allowAll },
      { userAgent: 'Applebot-Extended', ...allowAll },
      { userAgent: 'Bytespider', ...allowAll },
      { userAgent: 'Amazonbot', ...allowAll },
      { userAgent: 'CCBot', ...allowAll },
      { userAgent: 'meta-externalagent', ...allowAll },
      { userAgent: 'cohere-ai', ...allowAll },
      { userAgent: 'Diffbot', ...allowAll },
    ],
    sitemap: 'https://www.yuniorbatista.com/sitemap.xml',
    host: 'https://www.yuniorbatista.com',
  };
}

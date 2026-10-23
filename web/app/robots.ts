import type { MetadataRoute } from 'next';
import { absoluteUrl } from '../lib/site';

export const dynamic = 'force-static';

/** 允许全站抓取，并指向 sitemap。 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}
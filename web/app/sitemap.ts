import type { MetadataRoute } from 'next';
import { getItems } from '../lib/content';
import { absoluteUrl } from '../lib/site';

// output: 'export' 下 sitemap 也是静态路由，须显式声明。
export const dynamic = 'force-static';

/** 站点地图：首页、速查表、关于，以及全部术语详情页。 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPaths = ['/', '/learn', '/reference', '/about'];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : 0.6,
  }));

  for (const item of getItems()) {
    entries.push({
      url: absoluteUrl(`/term/${item.id}`),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  }

  return entries;
}
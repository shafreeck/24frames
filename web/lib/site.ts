// 站点绝对地址。构建时可用 SITE_URL 覆盖，默认取用户已购域名。
// 只影响 metadataBase、canonical、sitemap、robots 里的绝对 URL，不影响本地预览。
const raw = (process.env.SITE_URL || 'https://24frames.art').trim();

/** 去掉末尾斜杠，保证拼接 URL 时不会出现双斜杠。 */
export const SITE_URL = raw.replace(/\/+$/, '');

/** 相对路径转绝对 URL；传入已带协议的地址原样返回。 */
export function absoluteUrl(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(path)) return path;
  return SITE_URL + (path.startsWith('/') ? path : '/' + path);
}
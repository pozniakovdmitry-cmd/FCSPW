import type { APIRequestContext } from '@playwright/test';

const TIMEOUT_MS = 10_000;

export function isSameOrigin(href: string, origin: string): boolean {
  try {
    const u = new URL(href, origin);
    return u.origin === origin;
  } catch {
    return false;
  }
}

export function normalize(href: string, origin: string): string | null {
  try {
    const u = new URL(href, origin);
    if (!/^https?:$/.test(u.protocol)) return null;
    u.hash = '';
    return u.toString();
  } catch {
    return null;
  }
}

export async function probe(request: APIRequestContext, url: string): Promise<number> {
  try {
    const head = await request.head(url, { timeout: TIMEOUT_MS, maxRedirects: 5 });
    if (head.status() < 400) return head.status();
    const get = await request.get(url, { timeout: TIMEOUT_MS, maxRedirects: 5 });
    return get.status();
  } catch {
    return 599;
  }
}

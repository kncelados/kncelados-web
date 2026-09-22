import type { APIRoute } from "astro";
import { episodes, generateSlug } from "@/lib/utils";

const SITE = "https://www.kncelados.com";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const GET: APIRoute = () => {
  const items = [...episodes]
    .filter((ep) => ep.createdAt)
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .map((ep) => {
      const link = `${SITE}/podcast/${generateSlug(ep.title)}`;
      return `    <item>
      <title>${esc(ep.name ?? ep.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${esc(ep.description)}</description>
      <pubDate>${new Date(ep.createdAt!).toUTCString()}</pubDate>
      <image><url>${esc(ep.image)}</url><title>${esc(ep.name ?? ep.title)}</title><link>${link}</link></image>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>KNCELADOS</title>
    <link>${SITE}/podcast</link>
    <description>El podcast de humor sin filtros. Nuevos episodios cada lunes a las 20:00 h.</description>
    <language>es-es</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
};

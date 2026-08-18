import "core-js/actual/object/group-by";
import type { Metadata, Episode } from "./types";
import slugify from "slugify";

const episodes_obj: Record<string, Episode> = import.meta.glob('./episodes/*.json', { import: 'default', eager: true });
const sortedEpisodes = Object.values(episodes_obj).sort((a, b) => b.episode - a.episode);
const TITLE_RE = /KNC\s+\d+x\d+/;

function extractName(title: string): string | undefined {
  const parts = title.split(' | ');
  if (parts.length === 1) return undefined;
  if (TITLE_RE.test(parts[0])) return parts.slice(1).join(' | ');
  return parts[0];
}

export const episodes = sortedEpisodes.map((episode) => ({
  ...episode,
  name: extractName(episode.title),
}));

const seasons_object = Object.groupBy(episodes, ({ season }) => season);
export const seasons = Object.values(seasons_object).reverse();

export const lastEpisode = seasons[0][0];

const collections_obj: Record<string, Metadata> = import.meta.glob('./collections/*.json', { import: 'default', eager: true });
export const collections = Object.values(collections_obj).reverse();

const shorts_obj: Record<string, Metadata> = import.meta.glob('./shorts/*.json', { import: 'default', eager: true });
export const shorts = Object.values(shorts_obj);

const allVideos = [...episodes, ...shorts, ...collections];
const titles = allVideos.map(({ title }) => generateSlug(title));

export function generateSlug(title: string) {
  return slugify(title, { strict: true, lower: true });
}

export function getCurrentEpisode(slug: string) {
  const ind = titles.findIndex((title) => title === slug);
  return allVideos[ind];
}

export function getCurrentEpisodeById(id: string) {
  return allVideos.find((episode) => episode.id === id);
}
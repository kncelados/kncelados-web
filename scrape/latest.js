import { readFile, writeFile, readdir } from "node:fs/promises";
import { remakeDescription } from "./remake.js";

const EPISODES_DIR = new URL("../src/lib/episodes/", import.meta.url);
const EPISODES_JS = new URL("./episodes.js", import.meta.url);
const WATCH_URL = "https://www.youtube.com/watch?v=";
const TITLE_RE = /KNC\s+(\d+)x(\d+)/;
const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.error("Error: YOUTUBE_API_KEY no está definida en el entorno.");
  process.exit(1);
}

async function api(endpoint, params) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  url.searchParams.set("key", API_KEY);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function getUploadsPlaylistId() {
  const data = await api("channels", {
    part: "contentDetails",
    forHandle: "@kncelados",
  });
  const uploadsId = data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) throw new Error("No se pudo obtener el uploads playlist ID del canal");
  return uploadsId;
}

async function getLatestVideo() {
  const uploadsId = await getUploadsPlaylistId();
  const data = await api("playlistItems", {
    part: "snippet",
    playlistId: uploadsId,
    maxResults: "1",
  });
  const item = data.items?.[0];
  if (!item) throw new Error("No se encontraron videos en el canal");
  return { id: item.snippet.resourceId.videoId, title: item.snippet.title };
}

async function getVideoMeta(id) {
  const data = await api("videos", {
    part: "snippet,contentDetails",
    id,
  });
  const item = data.items?.[0];
  if (!item) throw new Error(`No se encontraron metadatos para ${id}`);
  return item;
}

async function episodeExists(id) {
  const files = await readdir(EPISODES_DIR);
  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    const data = JSON.parse(await readFile(new URL(file, EPISODES_DIR), "utf-8"));
    if (data.id === id) return true;
  }
  return false;
}

function parseTitle(title) {
  const match = title.match(TITLE_RE);
  if (!match) return null;
  return { season: Number(match[1]), episode: Number(match[2]) };
}

function seasonEpisodeKey(season, episode) {
  return `${season}x${episode}`;
}

function seasonEpisodeFile(season, episode) {
  return `${seasonEpisodeKey(season, episode)}.json`;
}

async function getExistingEpisodeData(season, episode) {
  try {
    const raw = await readFile(new URL(seasonEpisodeFile(season, episode), EPISODES_DIR), "utf-8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function prependEpisodesJs(entry) {
  const raw = await readFile(EPISODES_JS, "utf-8");
  const objectEntry = `  {
    episode: ${entry.episode},
    season: ${entry.season},
    id: "${entry.id}",
  },`;
  const updated = raw.replace(/export const episodes = \[\n/, `export const episodes = [\n${objectEntry}\n`);
  await writeFile(EPISODES_JS, updated, "utf-8");
}

function bestThumbnail(thumbnails) {
  if (!thumbnails) return null;
  return (
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url
  );
}

async function main() {
  console.log("Buscando último video del canal...");
  const latest = await getLatestVideo();
  console.log(`Último video: "${latest.title}" (id: ${latest.id})`);

  if (await episodeExists(latest.id)) {
    console.log("Episodio ya scrapeado. Sin cambios.");
    process.exit(0);
  }

  const parsed = parseTitle(latest.title);
  if (!parsed) {
    console.error(`Error: el título "${latest.title}" no coincide con el patrón KNC SxE. No se puede determinar número de episodio.`);
    process.exit(1);
  }

  const { season, episode } = parsed;
  console.log(`Detectado: Temporada ${season}, Episodio ${episode}`);

  const existing = await getExistingEpisodeData(season, episode);
  if (existing && existing.id !== latest.id) {
    console.error(`Error: ya existe ${seasonEpisodeKey(season, episode)}.json con id "${existing.id}", pero el nuevo tiene id "${latest.id}". Colisión detectada — no se sobreescribe.`);
    process.exit(1);
  }

  console.log("Obteniendo metadatos via YouTube Data API...");
  const meta = await getVideoMeta(latest.id);
  const { title, description, thumbnails } = meta.snippet;
  const image = bestThumbnail(thumbnails) || `https://i.ytimg.com/vi/${latest.id}/maxresdefault.jpg`;

  const desc = description || "";
  const spotifyMatch = desc.match(/https:\/\/open\.spotify\.com\/episode\/\S+/);
  const spotifyUrl = spotifyMatch ? spotifyMatch[0].split("?")[0] : null;
  if (spotifyUrl) console.log(`Spotify link encontrado: ${spotifyUrl}`);

  console.log("Reescribiendo descripción con Cohere...");
  const rewritten = await remakeDescription(desc);

  const createdAt = new Date().toISOString();

  const data = {
    createdAt,
    episode,
    season,
    id: latest.id,
    title,
    description: rewritten,
    image,
    url: WATCH_URL + latest.id,
    spotifyUrl,
  };

  const filename = seasonEpisodeFile(season, episode);
  const filepath = new URL(filename, EPISODES_DIR);
  await writeFile(filepath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Escrito ${filename}`);

  console.log("Añadiendo a scrape/episodes.js...");
  await prependEpisodesJs({ episode, season, id: latest.id });
  console.log("Actualizado scrape/episodes.js");

  console.log("Hecho.");
}

main().catch((err) => {
  console.error("Error inesperado:", err);
  process.exit(1);
});

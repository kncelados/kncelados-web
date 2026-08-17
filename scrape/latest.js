import { readFile, writeFile, readdir } from "node:fs/promises";
import { remakeDescription } from "./remake.js";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const EPISODES_DIR = new URL("../src/lib/episodes/", import.meta.url);
const EPISODES_JS = new URL("./episodes.js", import.meta.url);
const CHANNEL_VIDEOS = "https://www.youtube.com/@kncelados/videos";
const WATCH_URL = "https://www.youtube.com/watch?v=";
const TITLE_RE = /KNC\s+(\d+)x(\d+)/;

async function ytDlpJson(url, extraArgs = []) {
  try {
    const { stdout } = await execFileAsync("yt-dlp", [
      "-J",
      "--no-warnings",
      ...extraArgs,
      url,
    ]);
    return JSON.parse(stdout);
  } catch (err) {
    const stderr = err.stderr || "";
    if (stderr.includes("members-only content") || stderr.includes("This video is available to this channel's members")) {
      console.error("Error: el episodio sigue siendo members-only. La action debe ejecutarse después de las 19:00 cuando sea público.");
      process.exit(1);
    }
    throw err;
  }
}

async function getLatestVideo() {
  const playlist = await ytDlpJson(CHANNEL_VIDEOS, ["--flat-playlist", "--playlist-end", "1"]);
  const entry = playlist.entries?.[0];
  if (!entry) throw new Error("No se encontraron videos en el canal");
  return { id: entry.id, title: entry.title };
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

async function fileExistsForSeasonEpisode(season, episode) {
  try {
    await readFile(new URL(seasonEpisodeFile(season, episode), EPISODES_DIR));
    return true;
  } catch {
    return false;
  }
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

  console.log("Obteniendo metadatos completos...");
  const meta = await ytDlpJson(WATCH_URL + latest.id);
  const { title, description, view_count, duration, upload_date, thumbnails } = meta;

  const thumbnailUrl = `https://i.ytimg.com/vi/${latest.id}/maxresdefault.jpg`;

  console.log("Reescribiendo descripción con Cohere...");
  const rewritten = await remakeDescription(description || "");

  const createdAt = new Date().toISOString();

  const data = {
    createdAt,
    episode,
    season,
    id: latest.id,
    title,
    description: rewritten,
    image: thumbnailUrl,
    url: WATCH_URL + latest.id,
    duration,
    viewCount: view_count,
    uploadDate: upload_date,
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

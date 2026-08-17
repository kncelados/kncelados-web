import { readFile, writeFile, readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const EPISODES_DIR = new URL("../src/lib/episodes/", import.meta.url);
const SPOTIFY_RE = /https:\/\/open\.spotify\.com\/episode\/\S+/;
const LIMIT = Number(process.env.SPOTIFY_BACKFILL_LIMIT) || 5;

async function ytDlpDescription(url) {
  try {
    const { stdout } = await execFileAsync("yt-dlp", [
      "--skip-download",
      "--no-warnings",
      "--print", "description",
      url,
    ]);
    return stdout;
  } catch (err) {
    const stderr = err.stderr || "";
    if (stderr.includes("members-only content")) {
      return null;
    }
    throw err;
  }
}

async function main() {
  const files = (await readdir(EPISODES_DIR)).filter((f) => f.endsWith(".json"));
  const pending = [];

  for (const file of files) {
    const raw = await readFile(new URL(file, EPISODES_DIR), "utf-8");
    const data = JSON.parse(raw);
    if (data.spotifyUrl) continue;
    pending.push({ file, data });
  }

  console.log(`Episodes sin spotifyUrl: ${pending.length}`);
  if (pending.length === 0) {
    console.log("Nada que hacer.");
    return;
  }

  const batch = pending.slice(0, LIMIT);
  console.log(`Procesando ${batch.length} episodios (límite: ${LIMIT})...`);

  let updated = 0;
  let skipped = 0;

  for (const { file, data } of batch) {
    const url = data.url || `https://www.youtube.com/watch?v=${data.id}`;
    console.log(`  ${file} (${data.id})...`);
    const description = await ytDlpDescription(url);
    if (description === null) {
      console.log(`    → members-only, saltando`);
      skipped++;
      continue;
    }
    const match = description.match(SPOTIFY_RE);
    if (!match) {
      console.log(`    → sin Spotify link`);
      skipped++;
      continue;
    }
    const spotifyUrl = match[0].split("?")[0];
    data.spotifyUrl = spotifyUrl;
    await writeFile(new URL(file, EPISODES_DIR), JSON.stringify(data, null, 2), "utf-8");
    console.log(`    → ${spotifyUrl}`);
    updated++;
  }

  console.log(`Actualizados: ${updated}, saltados: ${skipped}, quedan: ${pending.length - batch.length}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

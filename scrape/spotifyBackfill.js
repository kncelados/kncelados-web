import { readFile, writeFile, readdir } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const EPISODES_DIR = new URL("../src/lib/episodes/", import.meta.url);
const SPOTIFY_RE = /https:\/\/open\.spotify\.com\/episode\/\S+/;

const args = process.argv.slice(2);
const idArg = args.find((a) => a.startsWith("--id="))?.split("=")[1];
const all = args.includes("--all");
const limitArg = args.find((a) => a.startsWith("--limit="))?.split("=")[1];
const limit = all ? Infinity : Number(limitArg) || 1;
const dryRun = args.includes("--dry-run");

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

async function loadPending() {
  const files = (await readdir(EPISODES_DIR)).filter((f) => f.endsWith(".json"));
  const pending = [];
  for (const file of files) {
    const raw = await readFile(new URL(file, EPISODES_DIR), "utf-8");
    const data = JSON.parse(raw);
    if (data.spotifyUrl) continue;
    pending.push({ file, data });
  }
  return pending;
}

function selectBatch(pending) {
  if (idArg) {
    const match = pending.find((p) => p.data.id === idArg);
    return match ? [match] : [];
  }
  const sorted = pending.toSorted((a, b) => {
    const sa = a.data.season ?? 0;
    const sb = b.data.season ?? 0;
    if (sa !== sb) return sb - sa;
    return (b.data.episode ?? 0) - (a.data.episode ?? 0);
  });
  return sorted.slice(0, limit);
}

async function main() {
  const pending = await loadPending();
  console.log(`Episodes sin spotifyUrl: ${pending.length}`);

  const batch = selectBatch(pending);
  if (batch.length === 0) {
    if (idArg) console.log(`No se encontró ningún episodio con id "${idArg}" sin spotifyUrl.`);
    else console.log("Nada que hacer.");
    return;
  }

  const mode = all ? "ALL" : idArg ? `id=${idArg}` : `limit=${limit}`;
  const dry = dryRun ? " (dry-run)" : "";
  console.log(`Procesando ${batch.length} episodio(s) [${mode}]${dry}...`);

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
    if (dryRun) {
      console.log(`    -> [dry-run] añadiría: ${spotifyUrl}`);
      updated++;
      continue;
    }
    data.spotifyUrl = spotifyUrl;
    await writeFile(new URL(file, EPISODES_DIR), JSON.stringify(data, null, 2), "utf-8");
    console.log(`    → ${spotifyUrl}`);
    updated++;
  }

  const remaining = pending.length - batch.length;
  console.log(`Actualizados: ${updated}, saltados: ${skipped}${remaining > 0 ? `, quedan: ${remaining}` : ""}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});

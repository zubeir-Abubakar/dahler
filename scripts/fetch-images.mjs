/**
 * Downloads licence-clear photography from Wikimedia Commons into public/images.
 * The original Dähler Früchte photos are not cleared for reuse, so every image here
 * is a free-licensed substitute. Attribution is written to public/images/CREDITS.md
 * and public/images/credits.json at the same time.
 *
 * Run: node scripts/fetch-images.mjs
 */
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const USER_AGENT =
  "DaehlerFruechteRedesign/1.0 (website redesign prototype)";
const API = "https://commons.wikimedia.org/w/api.php";
const ROOT = path.resolve(process.cwd(), "public/images");

const products = {
  ananas: "pineapple fruit whole",
  "baby-ananas": "baby pineapple fruit",
  avocados: "avocado",
  bananenblaetter: "banana leaf green",
  chilischoten: "red chilli peppers",
  granataepfel: "pomegranate fruit whole",
  granadillas: "granadilla passion fruit",
  guaven: "guava fruit",
  ingwer: "ginger root",
  kaki: "persimmon fruit",
  kaktusfeigen: "prickly pear cactus fruit",
  karambolen: "carambola starfruit",
  "kiwi-gruen": "kiwifruit green",
  "kiwi-gold": "golden kiwifruit",
  kokosnuesse: "coconut fruit",
  limesblaetter: "kaffir lime leaves",
  litschis: "lychee fruit",
  mango: "mango fruit whole",
  mangostan: "mangosteen fruit",
  maracuja: "passion fruit whole",
  "mini-mais": "baby corn vegetable",
  okra: "okra vegetable",
  passionsfruechte: "passion fruit halved",
  physalis: "physalis cape gooseberry",
  pitahaya: "dragon fruit pitaya",
  papayas: "papaya fruit whole",
  formosa: "papaya fruit sliced",
  rambutan: "rambutan fruit",
  suesskartoffel: "sweet potato",
  tamarillos: "tamarillo fruit",
  tamarinden: "tamarind pods",
  zitronen: "lemon fruit",
  zitronengras: "lemongrass stalks",
  orangensaft: "orange juice glass",
  "orangen-tafel": "oranges table fruit",
  trauben: "grapes bunch",
  "melonen-galia": "galia melon",
  honigmelonen: "honeydew melon",
  wassermelonen: "watermelon sliced",
  "ananas-crownless": "pineapple fruit",
  "mango-xl": "mango fruit ripe",
  "melonen-xl": "melon fruit market",
};

const hero = {
  "hero-market": "tropical fruit market stall",
  "hero-fruit": "exotic fruit assortment",
};

const services = {
  "service-sourcing": "fruit plantation harvest",
  "service-import": "cargo ship containers port",
  "service-ripening": "fruit ripening storage",
  "service-packing": "fruit packing boxes",
  "service-logistics": "refrigerated truck transport",
  "service-quality": "fruit quality inspection",
};

const gallery = {
  "gallery-01": "passion fruit cut open",
  "gallery-02": "mango slices",
  "gallery-03": "pineapple plantation",
  "gallery-04": "fruit crates warehouse",
  "gallery-05": "avocado tree fruit",
  "gallery-06": "citrus fruit basket",
  "gallery-07": "papaya market",
  "gallery-08": "limes green fruit",
};

const groups = [
  { dir: "products", items: products, file: (slug, i) => `${slug}` },
  { dir: "hero", items: hero, file: (slug) => `${slug}` },
  { dir: "logistics", items: services, file: (slug) => `${slug}` },
  { dir: "gallery", items: gallery, file: (slug) => `${slug}` },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function stripHtml(value = "") {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function search(query, attempt = 0) {
  const url =
    `${API}?action=query&format=json&formatversion=2` +
    `&generator=search&gsrsearch=${encodeURIComponent(`filetype:bitmap ${query}`)}` +
    `&gsrnamespace=6&gsrlimit=4` +
    `&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1400`;
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (res.status === 429 && attempt < 4) {
    const retryAfter = Number(res.headers.get("retry-after")) || 5;
    await sleep((retryAfter + attempt * 5) * 1000);
    return search(query, attempt + 1);
  }
  if (!res.ok) throw new Error(`search ${res.status} for "${query}"`);
  const json = await res.json();
  const pages = json.query?.pages ?? [];
  return pages
    .map((p) => ({ info: p.imageinfo?.[0], title: p.title }))
    .filter(({ info }) => info && (info.width ?? 0) >= 900)
    .map(({ info, title }) => ({
      title,
      url: info.thumburl ?? info.url,
      page: info.descriptionurl,
      meta: info.extmetadata ?? {},
      width: info.width,
      height: info.height,
    }));
}

async function download(url, target, attempt = 0) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (res.status === 429 && attempt < 4) {
    await sleep((6 + attempt * 6) * 1000);
    return download(url, target, attempt + 1);
  }
  if (!res.ok) throw new Error(`download ${res.status}`);
  const type = res.headers.get("content-type") ?? "";
  if (!type.startsWith("image/")) throw new Error(`not an image: ${type}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 12_000) throw new Error(`file too small (${buf.length}b)`);
  await writeFile(target, buf);
  return buf.length;
}

const credits = [];
const failures = [];
const cached = new Map();
try {
  const raw = await readFile(path.join(ROOT, "credits.json"), "utf8");
  for (const entry of JSON.parse(raw)) cached.set(entry.file, entry);
} catch {
  // first run
}

for (const group of groups) {
  const dir = path.join(ROOT, group.dir);
  await mkdir(dir, { recursive: true });

  for (const [slug, query] of Object.entries(group.items)) {
    const target = path.join(dir, `${group.file(slug)}.jpg`);
    const publicPath = `/images/${group.dir}/${group.file(slug)}.jpg`;
    try {
      await access(target);
      const known = cached.get(publicPath);
      if (known) credits.push(known);
      console.log(`skip ${group.dir}/${slug} (already downloaded)`);
      continue;
    } catch {
      // not downloaded yet — fall through
    }
    try {
      const results = await search(query);
      const pick = results[0];
      if (!pick) throw new Error("no results");
      const bytes = await download(pick.url, target);
      credits.push({
        file: `/images/${group.dir}/${group.file(slug)}.jpg`,
        source: pick.page,
        title: pick.title,
        author: stripHtml(pick.meta.Artist?.value) || "Unknown",
        licence: stripHtml(pick.meta.LicenseShortName?.value) || "See source",
        licenceUrl: pick.meta.LicenseUrl?.value ?? pick.page,
        query,
      });
      console.log(`ok   ${group.dir}/${slug} (${Math.round(bytes / 1024)}kb)`);
    } catch (error) {
      failures.push(`${group.dir}/${slug}: ${error.message}`);
      console.log(`FAIL ${group.dir}/${slug} — ${error.message}`);
    }
    await sleep(1300);
  }
}

const header = `# Image credits

The photographs on the original daehler-fruechte.ch site were **not** downloaded or reused:
no reuse authorisation was available. Every image in this project is a free-licensed
substitute sourced from Wikimedia Commons, with the licence recorded per file below.
Replace any file with an authorised original of the same path — no code changes needed.

`;
const rows = credits
  .map(
    (c) =>
      `- \`${c.file}\` — ${c.title} · ${c.author} · ${c.licence} · [source](${c.source})`,
  )
  .join("\n");

await writeFile(path.join(ROOT, "credits.json"), JSON.stringify(credits, null, 2));
await writeFile(path.join(ROOT, "CREDITS.md"), header + rows + "\n");

console.log(`\n${credits.length} images downloaded, ${failures.length} failed.`);
if (failures.length) console.log(failures.join("\n"));

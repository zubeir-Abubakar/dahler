/**
 * Focused retry for the handful of images that hit Wikimedia's rate limiter.
 * Slower cadence and smaller thumbnails; safe to re-run.
 */
import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const UA = "DaehlerFruechteRedesign/1.0 (website redesign prototype)";
const DOWNLOAD_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const API = "https://commons.wikimedia.org/w/api.php";
const ROOT = path.resolve(process.cwd(), "public/images");

const targets = [
  ["products/avocados", "avocado halved fruit"],
  ["products/melonen-xl", "melon fruit whole"],
  ["gallery/gallery-01", "passion fruit sliced"],
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const strip = (value = "") => value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

const creditsPath = path.join(ROOT, "credits.json");
let credits = [];
try {
  credits = JSON.parse(await readFile(creditsPath, "utf8"));
} catch {
  credits = [];
}

for (const [slug, query] of targets) {
  const target = path.join(ROOT, `${slug}.jpg`);
  try {
    await access(target);
    console.log(`skip ${slug}`);
    continue;
  } catch {
    // missing, download it
  }

  const url =
    `${API}?action=query&format=json&formatversion=2` +
    `&generator=search&gsrsearch=${encodeURIComponent(`filetype:bitmap ${query}`)}` +
    `&gsrnamespace=6&gsrlimit=3&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1000`;

  try {
    const search = await fetch(url, { headers: { "User-Agent": UA } });
    if (!search.ok) throw new Error(`search ${search.status}`);
    const json = await search.json();
    const pages = (json.query?.pages ?? []).filter((page) => page.imageinfo?.[0]?.thumburl);
    const pick = pages[0];
    if (!pick) throw new Error("no result");

    const info = pick.imageinfo[0];
    await sleep(4000);

    const image = await fetch(info.thumburl, {
      headers: {
        "User-Agent": DOWNLOAD_UA,
        Accept: "image/avif,image/webp,image/jpeg,*/*",
        Referer: "https://commons.wikimedia.org/",
      },
    });
    if (!image.ok) throw new Error(`download ${image.status}`);
    const buffer = Buffer.from(await image.arrayBuffer());
    if (buffer.length < 10000) throw new Error("too small");
    await writeFile(target, buffer);

    credits = credits.filter((entry) => entry.file !== `/images/${slug}.jpg`);
    credits.push({
      file: `/images/${slug}.jpg`,
      source: info.descriptionurl,
      title: pick.title,
      author: strip(info.extmetadata?.Artist?.value) || "Unknown",
      licence: strip(info.extmetadata?.LicenseShortName?.value) || "See source",
      licenceUrl: info.extmetadata?.LicenseUrl?.value ?? info.descriptionurl,
      query,
    });
    console.log(`ok   ${slug} (${Math.round(buffer.length / 1024)}kb)`);
  } catch (error) {
    console.log(`FAIL ${slug} — ${error.message}`);
  }

  await sleep(20000);
}

await writeFile(creditsPath, JSON.stringify(credits, null, 2));
console.log(`credits: ${credits.length} entries`);

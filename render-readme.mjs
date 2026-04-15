import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HERO_START_MARKER = "<!-- HERO:START -->";
const HERO_END_MARKER = "<!-- HERO:END -->";
const START_MARKER = "<!-- PROJECTS:START -->";
const END_MARKER = "<!-- PROJECTS:END -->";
const HERO_ASSET_PATH = path.join(__dirname, "assets", "led-ticker.svg");

const heroSignals = [
  {
    key: "cta",
    project: "ChiTrack",
    value: "CTA 02 MIN",
    href: "https://www.chitrack.com/",
  },
  {
    key: "heart-rate",
    project: "Surgent",
    value: "HR 142 BPM",
    href: "https://www.surgent.run",
  },
  {
    key: "pace",
    project: "Race Time Calculator",
    value: "PACE 6:18 / MI",
    href: "https://apps.apple.com/us/app/race-time-calculator/id6478423515",
  },
  {
    key: "invoice",
    project: "Construction Procurement",
    value: "-$1,240 CAUGHT",
    href: "https://gravelbox.xyz/case-study",
  },
  {
    key: "now-playing",
    project: "Magic Record Player",
    value: "NOW PLAYING",
    href: "https://github.com/declankra/raspberryPiRecordPlayer",
    icon: "music",
  },
];

const sectionConfig = [
  {
    status: "current",
    heading: "Currently building",
    intro:
      "Work I'm actively shipping, refining, or pushing into the world right now.",
  },
  {
    status: "shipped",
    heading: "Shipped",
    intro:
      "A few things I've actually finished and put in front of users, customers, or real workflows.",
  },
  {
    status: "archive",
    heading: "Archive",
    intro:
      "Older builds that are funny to revisit now. I like keeping a few of them around because progress should be visible, and I expect today's work to feel equally charming in a few years.",
  },
];

function formatProjectBullet(project) {
  const label = project.primaryUrl
    ? `**[${project.name}](${project.primaryUrl})**`
    : `**${project.name}**`;
  const repoSuffix =
    project.repoUrl && project.repoUrl !== project.primaryUrl
      ? ` ([repo](${project.repoUrl}))`
      : "";

  return `- ${label} — ${project.oneLiner}${repoSuffix}`;
}

function buildProjectsSections(projects) {
  const visibleProjects = projects.filter((project) => project.includeInReadme);

  return sectionConfig
    .flatMap((section) => {
      const items = visibleProjects.filter((project) => project.status === section.status);

      if (items.length === 0) {
        return [];
      }

      return [
        `## ${section.heading}`,
        section.intro,
        "",
        ...items.map(formatProjectBullet),
        "",
      ];
    })
    .join("\n")
    .trim();
}

function replaceGeneratedBlock(readme, startMarker, endMarker, generatedContent) {
  const pattern = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, "m");

  if (!pattern.test(readme)) {
    throw new Error(`README is missing managed markers: ${startMarker}`);
  }

  return readme.replace(
    pattern,
    `${startMarker}\n${generatedContent}\n${endMarker}`,
  );
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderMusicIcon(x, y) {
  return [
    `<g transform="translate(${x} ${y})" fill="#ff8a1a" stroke="#ff8a1a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">`,
    '<line x1="22" y1="8" x2="22" y2="56" />',
    '<line x1="48" y1="4" x2="48" y2="52" />',
    '<line x1="22" y1="8" x2="48" y2="4" />',
    '<ellipse cx="20" cy="64" rx="12" ry="9" />',
    '<ellipse cx="46" cy="60" rx="12" ry="9" />',
    "</g>",
  ].join("");
}

function renderTickerSvg(signals) {
  const width = 1200;
  const height = 160;
  const gap = 16;
  const padding = 18;
  const cardWidth = (width - padding * 2 - gap * (signals.length - 1)) / signals.length;

  const cards = signals.map((signal, index) => {
    const x = padding + index * (cardWidth + gap);
    const valueX = signal.icon === "music" ? x + 94 : x + 22;
    const icon = signal.icon === "music" ? renderMusicIcon(x + 14, 38) : "";

    return [
      `<g>`,
      `<rect x="${x}" y="22" width="${cardWidth}" height="116" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.10)" />`,
      `<circle cx="${x + 18}" cy="42" r="4" fill="#ff8a1a" />`,
      `<text x="${x + 30}" y="46" fill="#98a2b3" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace" font-size="14" letter-spacing="1.4">${escapeXml(signal.project.toUpperCase())}</text>`,
      icon,
      `<text x="${valueX}" y="100" fill="#ff8a1a" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace" font-size="${signal.icon === "music" ? 24 : 28}" font-weight="700" letter-spacing="1">${escapeXml(signal.value)}</text>`,
      `</g>`,
    ].join("");
  });

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">`,
    "<title id=\"title\">Declan builder signal ticker</title>",
    "<desc id=\"desc\">A slim LED-style ticker showing CTA 02 MIN, HR 142 BPM, PACE 6:18 / MI, minus 1240 dollars caught, and NOW PLAYING.</desc>",
    "<defs>",
    '<linearGradient id="panelGradient" x1="0%" y1="0%" x2="100%" y2="100%">',
    '<stop offset="0%" stop-color="#0b0f17" />',
    '<stop offset="100%" stop-color="#111827" />',
    "</linearGradient>",
    '<filter id="glow" x="-20%" y="-20%" width="140%" height="140%">',
    '<feGaussianBlur stdDeviation="6" result="blur" />',
    '<feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>',
    "</filter>",
    "</defs>",
    '<rect x="0.5" y="0.5" width="1199" height="159" rx="24" fill="url(#panelGradient)" stroke="rgba(255,255,255,0.12)" />',
    '<text x="24" y="18" fill="#667085" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace" font-size="12" letter-spacing="2">LIVE SIGNALS FROM PROJECTS I COULDN&apos;T LEAVE ALONE</text>',
    `<g filter="url(#glow)">${cards.join("")}</g>`,
    "</svg>",
  ].join("");
}

function buildHeroBlock(signals) {
  const chips = signals
    .map(
      (signal) =>
        `<a href="${signal.href}"><code>${signal.value}</code></a>`,
    )
    .join(" · ");

  return [
    '<p align="center">',
    '  <img src="./assets/led-ticker.svg" alt="Declan builder signal ticker" />',
    "</p>",
    '<p align="center">',
    `  ${chips}`,
    "</p>",
  ].join("\n");
}

const catalogPath = path.join(__dirname, "projects.catalog.json");
const readmePath = path.join(__dirname, "README.md");

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const readme = await readFile(readmePath, "utf8");
const heroSvg = renderTickerSvg(heroSignals);

await mkdir(path.dirname(HERO_ASSET_PATH), { recursive: true });
await writeFile(HERO_ASSET_PATH, `${heroSvg}\n`);

const withHero = replaceGeneratedBlock(
  readme,
  HERO_START_MARKER,
  HERO_END_MARKER,
  buildHeroBlock(heroSignals),
);
const rendered = replaceGeneratedBlock(
  withHero,
  START_MARKER,
  END_MARKER,
  buildProjectsSections(catalog.projects),
);

await writeFile(readmePath, rendered);

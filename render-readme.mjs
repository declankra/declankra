import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const START_MARKER = "<!-- PROJECTS:START -->";
const END_MARKER = "<!-- PROJECTS:END -->";

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

function replaceGeneratedBlock(readme, generatedContent) {
  const pattern = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`, "m");

  if (!pattern.test(readme)) {
    throw new Error("README is missing managed project markers.");
  }

  return readme.replace(
    pattern,
    `${START_MARKER}\n${generatedContent}\n${END_MARKER}`,
  );
}

const catalogPath = path.join(__dirname, "projects.catalog.json");
const readmePath = path.join(__dirname, "README.md");

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const readme = await readFile(readmePath, "utf8");
const rendered = replaceGeneratedBlock(
  readme,
  buildProjectsSections(catalog.projects),
);

await writeFile(readmePath, rendered);

// Runs semantic-release with the versions pinned in this folder and the shared config next to it, on the repository
// in the current directory.
// With --preview <file> it only works out what merging the pull request would publish, and writes it to <file> as Markdown.
import { appendFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import semanticRelease from "semantic-release";

const [flag, previewFile] = process.argv.slice(2);
const preview = flag === "--preview";
const options = { extends: fileURLToPath(new URL("config.js", import.meta.url)) };

// In a pull request the checkout's local main is main plus the pull request. The preview presents itself as a push
// to main so that semantic-release analyses that branch instead of skipping the pull request.
const result = preview
  ? await semanticRelease(
      { ...options, dryRun: true, ci: false },
      { env: { ...process.env, GITHUB_EVENT_NAME: "push", GITHUB_REF: "refs/heads/main" } },
    )
  : await semanticRelease(options);

if (preview) {
  const body = result
    ? `**Merging publishes version ${result.nextRelease.version}**` +
      (result.lastRelease.version ? ` (currently ${result.lastRelease.version}).` : ".") +
      `\n\n${result.nextRelease.notes}`
    : "**Merging publishes no new version:** there is no feat, fix, perf or content commit.";
  writeFileSync(previewFile, `${body}\n`);
} else if (result && process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `version=${result.nextRelease.version}\n`);
}

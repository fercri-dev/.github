// Shared semantic-release config for every fercri-dev repository. A repository can still override any option with
// its own .releaserc.json.
export default {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        // Content changes on the websites are visible changes, so they publish a patch like a fix.
        releaseRules: [{ type: "content", release: "patch" }],
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        presetConfig: {
          types: [
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "content", section: "Content" },
            { type: "perf", section: "Performance Improvements" },
            { type: "revert", section: "Reverts" },
            { type: "refactor", section: "Code Refactoring" },
            { type: "test", section: "Tests" },
            { type: "docs", section: "Documentation", hidden: true },
            { type: "chore", section: "Miscellaneous Chores", hidden: true },
            { type: "build", section: "Build System", hidden: true },
            { type: "ci", section: "Continuous Integration", hidden: true },
            { type: "style", section: "Styles", hidden: true },
          ],
        },
      },
    ],
    ["@semantic-release/github", { successComment: false, releasedLabels: false }],
  ],
};

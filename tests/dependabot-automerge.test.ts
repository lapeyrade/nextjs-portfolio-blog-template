import { expect, test } from "bun:test";
import { createRequire } from "node:module";

const { candidate, run } = createRequire(import.meta.url)(
  "../.github/scripts/dependabot-automerge.cjs",
);
const sha = "a".repeat(40);
const repo = () => ({
  id: 1034311696,
  full_name: "lapeyrade/nextjs-portfolio-blog-template",
  fork: false,
});
const pr = () => ({
  number: 1,
  node_id: "PR_synthetic",
  state: "open",
  draft: false,
  merged: false,
  user: { id: 49699333, login: "dependabot[bot]", type: "Bot" },
  head: { ref: "dependabot/bun/dependencies", sha, repo: repo() },
  base: { ref: "main", repo: repo() },
  auto_merge: null as unknown,
});
const context = () => ({
  repo: { owner: "lapeyrade", repo: "nextjs-portfolio-blog-template" },
  eventName: "pull_request_target",
  payload: {
    action: "opened",
    number: 1,
    repository: repo(),
    pull_request: pr(),
  },
});
function mock(current: unknown = pr()) {
  const calls: { query: string; variables: unknown }[] = [];
  return {
    calls,
    rest: {
      repos: {
        get: async () => ({ data: { ...repo(), allow_auto_merge: true } }),
      },
      pulls: { get: async () => ({ data: current }), list: () => {} },
    },
    paginate: async () => [pr()],
    graphql: async (query: string, variables: unknown) => {
      calls.push({ query, variables });
      return {
        enablePullRequestAutoMerge: {
          pullRequest: {
            id: "PR_synthetic",
            headRefOid: sha,
            merged: false,
            autoMergeRequest: { mergeMethod: "SQUASH" },
          },
        },
      };
    },
  };
}

test("only official Dependabot PRs from this repository and branch are eligible", () => {
  expect(candidate(pr())).toEqual({ number: 1, sha });
  for (const patch of [
    { number: 0 },
    { number: 1.5 },
    { state: "closed" },
    { draft: true },
    { merged: true },
    { merged: undefined },
    { node_id: "" },
    { node_id: undefined },
    { node_id: 123 },
    { user: { ...pr().user, id: 1 } },
    { user: { ...pr().user, login: "someone" } },
    { head: { ...pr().head, ref: "main" } },
    { head: { ...pr().head, sha: "invalid" } },
    { head: { ...pr().head, repo: { ...repo(), fork: true } } },
    { base: { ...pr().base, ref: "other" } },
    { base: { ...pr().base, repo: { ...repo(), id: 1 } } },
  ])
    expect(candidate({ ...pr(), ...patch })).toBeNull();
});

test("the helper only queues squash auto-merge at the freshly verified exact head", async () => {
  const github = mock();
  expect(await run({ github, context: context() })).toBe("enabled");
  expect(github.calls).toHaveLength(1);
  expect(github.calls[0]!.variables).toEqual({ id: "PR_synthetic", head: sha });
  expect(github.calls[0]!.query).toContain("enablePullRequestAutoMerge");
  expect(github.calls[0]!.query).toContain("expectedHeadOid: $head");
  expect(github.calls[0]!.query).not.toContain("mergePullRequest(");
});

test("stale heads, changed authors, drafts and duplicate deliveries cannot merge directly", async () => {
  for (const changed of [
    { ...pr(), head: { ...pr().head, sha: "b".repeat(40) } },
    { ...pr(), user: { ...pr().user, id: 1 } },
    { ...pr(), draft: true },
  ]) {
    const github = mock(changed);
    expect(await run({ github, context: context() })).toBe("ignored");
    expect(github.calls).toEqual([]);
  }
  const github = mock({ ...pr(), auto_merge: { merge_method: "squash" } });
  expect(await run({ github, context: context() })).toBe("already-enabled");
  expect(github.calls).toEqual([]);
});

test("manual recovery re-reads each candidate and rejects an unexpected repository", async () => {
  const github = mock();
  expect(
    await run({
      github,
      context: { ...context(), eventName: "workflow_dispatch" },
    }),
  ).toEqual({ inspected: 1 });
  expect(github.calls).toHaveLength(1);
  await expect(
    run({
      github,
      context: { ...context(), repo: { owner: "someone", repo: "fork" } },
    }),
  ).rejects.toThrow("Unexpected repository");
  const wrong = context();
  wrong.payload.repository.id = 1;
  github.calls.length = 0;
  expect(await run({ github, context: wrong })).toBe("ignored");
  expect(github.calls).toEqual([]);
});

test("the write-token helper never checks out or executes untrusted PR code", async () => {
  const text = await Bun.file(
    ".github/workflows/dependabot-auto-merge.yml",
  ).text();
  const config = Bun.YAML.parse(text) as {
    permissions: unknown;
    on: Record<string, unknown>;
    jobs: {
      "auto-merge": {
        permissions: unknown;
        steps: { uses: string; with?: Record<string, unknown> }[];
      };
    };
  };
  expect(config.on).toHaveProperty("pull_request_target");
  expect(config.on).toHaveProperty("workflow_dispatch");
  expect(config.permissions).toEqual({ contents: "read" });
  expect(config.jobs["auto-merge"].permissions).toEqual({
    contents: "write",
    "pull-requests": "write",
  });
  const steps = config.jobs["auto-merge"].steps;
  expect(steps).toHaveLength(2);
  expect(steps[0]!.with).toEqual({
    ref: "refs/heads/main",
    "persist-credentials": false,
  });
  for (const step of steps) expect(step.uses).toMatch(/@[a-f0-9]{40}$/);
  expect(text).not.toContain("bun install");
  expect(text).not.toContain("GITHUB_AUTOMERGE_TOKEN");
  expect(text).not.toContain("secrets.");
});

test("disabled repository settings and unconfirmed mutations fail closed", async () => {
  const disabled = mock();
  disabled.rest.repos.get = async () => ({
    data: { ...repo(), allow_auto_merge: false },
  });
  await expect(run({ github: disabled, context: context() })).rejects.toThrow(
    "not configured",
  );
  expect(disabled.calls).toEqual([]);
  const invalid = mock();
  invalid.graphql = async () => ({
    enablePullRequestAutoMerge: {
      pullRequest: {
        id: "other",
        headRefOid: sha,
        merged: false,
        autoMergeRequest: { mergeMethod: "SQUASH" },
      },
    },
  });
  await expect(run({ github: invalid, context: context() })).rejects.toThrow(
    "did not confirm",
  );
});

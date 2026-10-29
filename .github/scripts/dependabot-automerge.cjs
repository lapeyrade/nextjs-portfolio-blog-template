const repositoryId = 1034311696;
const repositoryName = "lapeyrade/nextjs-portfolio-blog-template";
const actions = new Set([
  "opened",
  "reopened",
  "synchronize",
  "ready_for_review",
]);

function candidate(pr) {
  const sameRepository = (repo) =>
    repo?.id === repositoryId &&
    repo.full_name === repositoryName &&
    repo.fork === false;
  if (
    !Number.isSafeInteger(pr?.number) ||
    pr.number < 1 ||
    pr.state !== "open" ||
    pr.draft !== false ||
    pr.merged !== false ||
    pr.user?.id !== 49699333 ||
    pr.user.login !== "dependabot[bot]" ||
    pr.user.type !== "Bot" ||
    !sameRepository(pr.head?.repo) ||
    !sameRepository(pr.base?.repo) ||
    pr.base.ref !== "main" ||
    typeof pr.head.ref !== "string" ||
    !pr.head.ref.startsWith("dependabot/") ||
    pr.head.ref.length <= 11 ||
    !/^[a-f0-9]{40}$/.test(pr.head.sha) ||
    typeof pr.node_id !== "string" ||
    !/^[A-Za-z0-9_=-]{1,200}$/.test(pr.node_id)
  )
    return null;
  return { number: pr.number, sha: pr.head.sha };
}

async function run({ github, context }) {
  if (`${context.repo.owner}/${context.repo.repo}` !== repositoryName)
    throw new Error("Unexpected repository");
  const { data: repo } = await github.rest.repos.get(context.repo);
  if (
    repo.id !== repositoryId ||
    repo.full_name !== repositoryName ||
    repo.allow_auto_merge !== true
  )
    throw new Error("Repository auto-merge is not configured");

  async function queue(expected) {
    const { data: pr } = await github.rest.pulls.get({
      ...context.repo,
      pull_number: expected.number,
    });
    const current = candidate(pr);
    if (
      !current ||
      current.number !== expected.number ||
      current.sha !== expected.sha
    )
      return "ignored";
    if (pr.auto_merge != null) return "already-enabled";
    const result = await github.graphql(
      `mutation($id: ID!, $head: GitObjectID!) {
      enablePullRequestAutoMerge(input: {pullRequestId: $id, expectedHeadOid: $head, mergeMethod: SQUASH}) {
        pullRequest { id headRefOid merged autoMergeRequest { mergeMethod } }
      }
    }`,
      { id: pr.node_id, head: current.sha },
    );
    const queued = result?.enablePullRequestAutoMerge?.pullRequest;
    if (
      queued?.id !== pr.node_id ||
      queued.headRefOid !== current.sha ||
      (queued.merged !== true &&
        queued.autoMergeRequest?.mergeMethod !== "SQUASH")
    )
      throw new Error("GitHub did not confirm auto-merge");
    return "enabled";
  }

  if (context.eventName === "pull_request_target") {
    const payload = context.payload;
    if (
      !actions.has(payload.action) ||
      payload.repository?.id !== repositoryId ||
      payload.repository?.full_name !== repositoryName
    )
      return "ignored";
    const expected = candidate(payload.pull_request);
    if (!expected || expected.number !== payload.number) return "ignored";
    return await queue(expected);
  }
  if (context.eventName !== "workflow_dispatch")
    throw new Error("Unexpected trigger");
  const rows = await github.paginate(github.rest.pulls.list, {
    ...context.repo,
    state: "open",
    base: "main",
    per_page: 100,
  });
  let count = 0;
  for (const pr of rows) {
    if (
      pr.user?.id !== 49699333 ||
      pr.user?.login !== "dependabot[bot]" ||
      pr.user?.type !== "Bot" ||
      !Number.isSafeInteger(pr.number) ||
      pr.number < 1 ||
      !/^[a-f0-9]{40}$/.test(pr.head?.sha)
    )
      continue;
    if (++count > 20)
      throw new Error("Dependabot recovery needs operator review");
    await queue({ number: pr.number, sha: pr.head.sha });
  }
  return { inspected: count };
}

module.exports = { candidate, run };

import { expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isolatedEnvironment } from "../ci/shared";

test("free public GitHub CI runs every source check without application or write credentials", async () => {
  const source = await Bun.file(".github/workflows/ci.yml").text();
  const config = Bun.YAML.parse(source) as {
    permissions: Record<string, string>;
    concurrency: Record<string, unknown>;
    jobs: {
      ci: { "runs-on": string; steps: { uses?: string; run?: string }[] };
    };
  };
  expect(config.permissions).toEqual({ contents: "read" });
  expect(config.concurrency["cancel-in-progress"]).toBe(true);
  expect(config.jobs.ci["runs-on"]).toBe("ubuntu-latest");
  expect(source).not.toContain("secrets.");
  expect(config.jobs.ci.steps.at(-1)!.run).toBe("bun run ci:quality");
  expect(
    config.jobs.ci.steps.some((step: { run?: string }) =>
      step.run?.includes("--frozen-lockfile"),
    ),
  ).toBe(true);
  for (const step of config.jobs.ci.steps)
    if (step.uses) expect(step.uses).toMatch(/@[a-f0-9]{40}$/);
  const pkg = await Bun.file("package.json").json();
  expect(pkg.scripts["ci:quality"]).toBe(
    "bun --no-env-file scripts/ci/quality.ts",
  );
  expect(pkg.scripts["test:unit"]).toContain("scripts/qa/ci-policy.test.ts");
  expect(pkg.scripts.build).toContain("bun run typecheck");
  const quality = await Bun.file("scripts/ci/quality.ts").text();
  for (const command of ["format:check", "lint", "test:unit", "build"])
    expect(quality).toContain(`"${command}"`);
  expect(quality).toContain('"audit"');
});

test("the application environment strips inherited credentials and rejects dotenv files", () => {
  const dir = mkdtempSync(join(tmpdir(), "website-ci-"));
  try {
    const env = isolatedEnvironment(
      {
        PATH: "/usr/bin",
        HOME: "/tmp",
        VERCEL: "1",
        VERCEL_OIDC_TOKEN: "synthetic-private-value",
        RESEND_API_KEY: "synthetic-private-value",
        GITHUB_AUTOMERGE_TOKEN: "synthetic-private-value",
        CONTACT_EMAIL: "not-for-tests@example.com",
      },
      dir,
    );
    expect(env).toEqual({
      CI: "true",
      NEXT_TELEMETRY_DISABLED: "1",
      PATH: "/usr/bin",
      HOME: "/tmp",
    });
    writeFileSync(join(dir, ".env.local"), "SYNTHETIC=true");
    expect(() => isolatedEnvironment({}, dir)).toThrow(
      "CI refuses local environment files",
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

import { expect, test } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { isolatedEnvironment } from "../ci/shared";

test("Vercel quality runs every source check without application or write credentials", async () => {
  const config = await Bun.file("turbo.json").json();
  const task = config.tasks["ci:quality"];
  expect(task.tags).toContain("ci");
  expect(task.tags).toContain("ci:oidc:none");
  expect(task.tags).toContain("ci:os:ubuntu");
  expect(task.cache).toBe(false);
  expect(task.env).toBeUndefined();
  expect(task.passThroughEnv).toBeUndefined();
  const vercel = await Bun.file("vercel.json").json();
  expect(vercel.ci.bootstrapping.installCommand).toContain("--frozen-lockfile");
  expect(vercel.ci.bootstrapping.installEnv).toEqual({});
  const pkg = await Bun.file("package.json").json();
  expect(pkg.scripts["ci:quality"]).toBe(
    "bun --no-env-file scripts/ci/quality.ts",
  );
  expect(pkg.scripts["test:unit"]).toContain("scripts/qa/vercel-ci.test.ts");
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

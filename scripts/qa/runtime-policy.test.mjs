import { expect, spyOn, test } from "bun:test";
import { readFileSync } from "node:fs";
import { register } from "../../src/instrumentation.ts";
import { verifyBunVersion } from "../verify-bun.mjs";

const root = new URL("../../", import.meta.url);

test("outdated or absent Bun versions fail closed before installation and build", () => {
  for (const version of [undefined, "", "invalid", "1.3.14", "1.4.3"]) {
    expect(() => verifyBunVersion(version)).toThrow(
      "Bun 1.4.4 or newer is required",
    );
  }
  for (const version of ["1.4.4", "1.4.5", "1.5.0", "2.0.0"]) {
    expect(verifyBunVersion(version)).toBe(version);
  }
  expect(verifyBunVersion(process.versions.bun)).toBe(Bun.version);
  const next = JSON.parse(
    readFileSync(new URL("node_modules/next/package.json", root), "utf8"),
  );
  expect(Bun.semver.satisfies(next.version, ">=16.4.2")).toBe(true);
});

test("Vercel and Next.js explicitly select the maintained Bun runtime", () => {
  const config = JSON.parse(readFileSync(new URL("vercel.json", root), "utf8"));
  const { scripts } = JSON.parse(
    readFileSync(new URL("package.json", root), "utf8"),
  );
  expect(config.bunVersion).toBe("1.4.x");
  expect(config.buildCommand).toContain(
    "bun run scripts/verify-bun.mjs && bun run ",
  );
  expect(config.installCommand).toBe(
    "bun run scripts/verify-bun.mjs && bun install --frozen-lockfile",
  );
  expect(config.installCommand).toContain("--frozen-lockfile");
  for (const [name, command] of [
    ["dev", "dev"],
    ["build", "build"],
    ["start", "start"],
    ["typecheck", "typegen"],
  ])
    expect(scripts[name]).toContain("bun run --bun next " + command);
  expect(
    Object.values(scripts).some(
      (command) =>
        command.includes("bun test") &&
        command.includes("runtime-policy.test.mjs"),
    ),
  ).toBe(true);
});

test("formatting uses native Bun without an Oxfmt dependency", () => {
  const { scripts, dependencies, devDependencies } = JSON.parse(
    readFileSync(new URL("package.json", root), "utf8"),
  );
  expect(scripts.format).toBe("bun fmt");
  expect(scripts["format:check"]).toBe("bun fmt --check");
  expect(dependencies?.oxfmt).toBeUndefined();
  expect(devDependencies?.oxfmt).toBeUndefined();
  const result = Bun.spawnSync(
    [process.execPath, "run", "format", "--stdin-filepath", "sample.ts"],
    {
      cwd: root.pathname,
      stdin: new TextEncoder().encode("const value={ok:true};\n"),
    },
  );
  expect(result.exitCode).toBe(0);
  expect(result.stdout.toString()).toBe("const value = { ok: true };\n");
});

test("runtime startup logs only the actual engine and version, never credentials", async () => {
  const previous = {
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,
    VERCEL: process.env.VERCEL,
  };
  const write = spyOn(process.stdout, "write").mockReturnValue(true);
  try {
    process.env.NEXT_RUNTIME = "nodejs";
    process.env.VERCEL = "1";
    await register();
    expect(write).toHaveBeenCalledTimes(1);
    expect(JSON.parse(write.mock.calls[0][0])).toEqual({
      event: "runtime-version",
      runtime: process.versions.bun ? "bun" : "node",
      version: process.versions.bun || process.versions.node,
    });
    write.mockClear();
    process.env.NEXT_RUNTIME = "edge";
    await register();
    expect(write).not.toHaveBeenCalled();
    process.env.NEXT_RUNTIME = "nodejs";
    delete process.env.VERCEL;
    await register();
    expect(write).not.toHaveBeenCalled();
  } finally {
    write.mockRestore();
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});

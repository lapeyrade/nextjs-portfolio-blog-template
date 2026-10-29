import { readdirSync } from "node:fs";

export function isolatedEnvironment(
  source: Record<string, string | undefined> = process.env,
  directory = ".",
): Record<string, string> {
  if (
    readdirSync(directory).some(
      (name) => name.startsWith(".env") && name !== ".env.example",
    )
  )
    throw new Error("CI refuses local environment files");
  const env: Record<string, string> = {
    CI: "true",
    NEXT_TELEMETRY_DISABLED: "1",
  };
  for (const key of [
    "PATH",
    "HOME",
    "TMPDIR",
    "TMP",
    "TEMP",
    "PLAYWRIGHT_BROWSERS_PATH",
  ])
    if (source[key]) env[key] = source[key]!;
  return env;
}

export async function run(args: string[], env: Record<string, string>) {
  console.log(`CI: ${args.join(" ")}`);
  const child = Bun.spawn(args, { env, stdout: "inherit", stderr: "inherit" });
  if ((await child.exited) !== 0)
    throw new Error(`CI command failed: ${args[0]}`);
}

export function bunScript(name: string) {
  return [process.execPath, "--no-env-file", "run", name];
}

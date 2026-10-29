import { bunScript, isolatedEnvironment, run } from "./shared";

const env = isolatedEnvironment();
for (const script of ["format:check", "lint", "test:unit"])
  await run(bunScript(script), env);
await run([process.execPath, "audit"], env);
await run(bunScript("build"), env);

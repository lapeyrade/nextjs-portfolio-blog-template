export function logRuntimeVersion() {
  const bun = process.versions.bun;
  process.stdout.write(
    JSON.stringify({
      event: "runtime-version",
      runtime: bun ? "bun" : "node",
      version: bun || process.versions.node,
    }) + "\n",
  );
}

export function verifyBunVersion(version) {
  if (
    typeof version !== "string" ||
    !Bun.semver.satisfies(version, ">=1.4.4")
  ) {
    throw new Error(
      "Bun 1.4.4 or newer is required: update the runtime before deploying.",
    );
  }
  return version;
}

if (import.meta.main) {
  console.log("Bun " + verifyBunVersion(process.versions.bun));
}

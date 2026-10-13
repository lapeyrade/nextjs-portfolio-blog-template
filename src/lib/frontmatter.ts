import { VFile } from "vfile";
import { matter } from "vfile-matter";

export function parseFrontmatter(source: string) {
  const file = new VFile(source.replace(/^\uFEFF/, ""));
  // Match the previous parser's YAML dates and merge keys without its legacy dependencies.
  matter(file, { strip: true, yaml: { customTags: ["timestamp"], merge: true } });
  const data = file.data.matter;
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new TypeError("Article frontmatter must be a YAML mapping");
  }
  return { data: data as Record<string, unknown>, content: String(file) };
}

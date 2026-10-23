import assert from "node:assert/strict";
import { test } from "node:test";
import { parseFrontmatter } from "../src/lib/frontmatter.ts";

test("preserves YAML metadata and MDX body exactly", () => {
  const content = '\n# An article\n\n<Component value="---" />\n\n---\n';
  const result = parseFrontmatter(`---
title: "A title: with punctuation"
description: >-
  A multiline
  description.
date: "2025-01-15"
updated: 2025-01-16
tags: [Next.js, React]
---
${content}`);
  assert.deepEqual(result.data, {
    title: "A title: with punctuation",
    description: "A multiline description.",
    date: "2025-01-15",
    updated: new Date("2025-01-16"),
    tags: ["Next.js", "React"],
  });
  assert.equal(result.content, content);
});

test("supports BOM, Windows line endings and empty or absent metadata", () => {
  assert.deepEqual(
    parseFrontmatter("\uFEFF---\r\ntitle: Test\r\n---\r\nBody\r\n"),
    {
      data: { title: "Test" },
      content: "Body\r\n",
    },
  );
  assert.deepEqual(parseFrontmatter("---\n---\nBody"), {
    data: {},
    content: "Body",
  });
  assert.deepEqual(parseFrontmatter("# Body\n\n---\n"), {
    data: {},
    content: "# Body\n\n---\n",
  });
});

test("rejects invalid YAML and non-mapping metadata", () => {
  assert.throws(() => parseFrontmatter("---\ntags: [broken\n---\nBody"));
  assert.throws(() => parseFrontmatter("---\n- title\n---\nBody"), /mapping/);
  assert.throws(() => parseFrontmatter("---\na string\n---\nBody"), /mapping/);
});

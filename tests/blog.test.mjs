import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { getAllBlogPosts, getBlogPost, getPostsByTag } from "../src/lib/blog.ts";

for (const locale of ["en", "fr"]) {
  test(`all ${locale} articles retain metadata, body, ordering and tag lookup`, async () => {
    const posts = await getAllBlogPosts(locale);
    assert.equal(posts.length, 3);
    const dates = posts.map((post) => post.date);
    assert.deepEqual(dates, [...dates].sort().reverse());
    for (const post of posts) {
      assert.deepEqual(await getBlogPost(post.slug, locale), post);
      assert.notEqual(post.title, "Untitled");
      assert.ok(post.description);
      assert.notEqual(post.author, "Anonymous");
      assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(post.wordCount > 0);
      assert.ok(post.readingTimeMinutes >= 1);
      const source = await readFile(
        `src/content/blog/${locale === "en" ? "" : `${locale}/`}${post.slug}.mdx`,
        "utf8",
      );
      const bodyStart = source.indexOf("\n---\n") + "\n---\n".length;
      assert.equal(post.content, source.slice(bodyStart));
      assert.ok(post.tags.length > 0);
      const tagged = await getPostsByTag(post.tags[0], locale);
      assert.ok(tagged.some((match) => match.slug === post.slug));
    }
  });
}

test("missing articles remain unavailable", async () => {
  assert.equal(await getBlogPost("does-not-exist"), null);
});

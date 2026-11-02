import test from "node:test"
import assert from "node:assert/strict"
import { h } from "preact"
import { render } from "preact-render-to-string"
import HomepageRecentUpdates from "./HomepageRecentUpdates"
import { QuartzComponentProps } from "./types"
import { QuartzPluginData } from "../plugins/vfile"

function article(slug: string, modified = "2026-11-01T12:00:00Z", extra = {}) {
  return {
    slug,
    relativePath: `${slug}.md`,
    filePath: `/fixture/content/${slug}.md`,
    frontmatter: { title: `Длинное название 中文 ${slug}`, tags: ["hidden-tag"] },
    defaultDateType: "created",
    dates: {
      created: new Date("2030-01-01"),
      modified: new Date(modified),
      published: new Date("2031-01-01"),
    },
    ...extra,
  } as QuartzPluginData
}

function renderList(allFiles: QuartzPluginData[], slug = "index") {
  const props = {
    cfg: { locale: "ru-RU" },
    fileData: { slug },
    allFiles,
  } as QuartzComponentProps
  return render(h(HomepageRecentUpdates(), props))
}

test("homepage only; hide empty and fully excluded lists", () => {
  const page = article("Notes/中文")
  assert.equal(renderList([]), "")
  assert.equal(renderList([article("Hubs/中文")]), "")
  for (const slug of ["Notes/中文", "Hubs/中文", "Notes/index", "tags/中文", "404"]) {
    assert.equal(renderList([page], slug), "")
  }
  assert.match(renderList([page]), /homepage-recent-updates/)
})

test("exclude unpublished, unlisted, virtual, index, alias-only and undated metadata", () => {
  const excluded = [
    article("index"),
    article("Hubs/中文"),
    article("tags/中文"),
    article("Notes/index"),
    article("Notes/_index"),
    article("Notes/subfolder/index"),
    article("Notes/draft", undefined, { frontmatter: { draft: true } }),
    article("Notes/private", undefined, { frontmatter: { publish: false } }),
    article("Notes/unlisted", undefined, { unlisted: true }),
    article("Notes/unlisted-fm", undefined, { frontmatter: { unlisted: true } }),
    article("Notes/virtual", undefined, { filePath: undefined }),
    article("Notes/alias", undefined, { relativePath: undefined }),
    article("Notes/missing-date", undefined, { dates: undefined }),
    article("Notes/invalid-date", "invalid"),
  ]
  const html = renderList([...excluded, article("Milestones/中文")])
  assert.equal((html.match(/class="recent-li"/g) ?? []).length, 1)
  assert.match(html, /href="\.\/Milestones\/中文"/)
  assert.doesNotMatch(html, /href="\.\/Notes\//)
})

test("sort by modification timestamp, then slug, and limit to ten without mutating input", () => {
  const pages = [
    article("Notes/z", "2026-11-02T12:00:00Z"),
    article("Notes/a", "2026-11-02T12:00:00Z"),
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => article(`Notes/older-${n}`)),
  ]
  const before = JSON.stringify(pages)
  const html = renderList(pages)
  const links = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1])
  assert.deepEqual(links, [
    "./Notes/a",
    "./Notes/z",
    "./Notes/older-1",
    "./Notes/older-2",
    "./Notes/older-3",
    "./Notes/older-4",
    "./Notes/older-5",
    "./Notes/older-6",
    "./Notes/older-7",
    "./Notes/older-8",
  ])
  assert.equal(JSON.stringify(pages), before)
  assert.match(html, /datetime="2026-11-02T12:00:00.000Z"/)
  assert.doesNotMatch(html, /2030|2031|hidden-tag|class="tags"/)
  assert.equal((html.match(/<section/g) ?? []).length, 1)
  assert.match(html, /Длинное название 中文/)
  assert.match(html, /<h3>Последние обновления<\/h3>/)
  assert.match(html, /aria-label="Последние обновления"/)
})

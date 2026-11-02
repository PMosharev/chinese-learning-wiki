import { RecentNotes } from "@quartz-community/recent-notes"
import { QuartzPluginData } from "../plugins/vfile"
import { QuartzComponent } from "./types"
import ConditionalRender from "./ConditionalRender"

export function isRecentArticle(page: QuartzPluginData): boolean {
  const fm = page.frontmatter
  const source = page.relativePath
  return Boolean(
    page.filePath &&
    source &&
    /^(Notes|Milestones)\/.+\.md$/.test(source) &&
    !/(^|\/)_?index\.md$/i.test(source) &&
    page.slug &&
    page.slug !== "index" &&
    !/^(tags|hubs)(\/|$)/i.test(page.slug) &&
    !/(^|\/)index$/.test(page.slug) &&
    fm?.draft !== true &&
    fm?.publish !== false &&
    fm?.unlisted !== true &&
    page.unlisted !== true &&
    page.dates?.modified &&
    Number.isFinite(page.dates.modified.getTime()),
  )
}

const Recent = RecentNotes({
  title: "Последние обновления",
  limit: 10,
  showTags: false,
  linkToMore: false,
  hideTagPages: true,
  hideFolderPages: true,
  // The plugin's default comparator returns zero for equal dated entries.
  sort: (a, b) =>
    b.dates!.modified.getTime() - a.dates!.modified.getTime() ||
    (a.slug! < b.slug! ? -1 : a.slug! > b.slug! ? 1 : 0),
}) as QuartzComponent

const HomepageRecentUpdates: QuartzComponent = (props) => (
  <section class="homepage-recent-updates" aria-label="Последние обновления">
    <Recent
      {...props}
      allFiles={props.allFiles
        .filter(isRecentArticle)
        .map((page) => ({ ...page, defaultDateType: "modified" }))}
    />
  </section>
)
HomepageRecentUpdates.css = Recent.css

export default () =>
  ConditionalRender({
    component: HomepageRecentUpdates,
    condition: ({ fileData, allFiles }) =>
      fileData.slug === "index" && allFiles.some(isRecentArticle),
  })

import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import { componentRegistry } from "./quartz/components/registry"
import type { RecentNotesOptions } from "@quartz-community/recent-notes"

// Recent Notes already excludes unlisted pages; RemoveDrafts filters drafts globally.
// Keep explicitly unpublished notes out of this list without changing publishing rules.
// Register directly: the installed npm index generator omits component re-exports.
componentRegistry.setOptionOverrides("@quartz-community/recent-notes", {
  filter: (file) => file.frontmatter?.publish !== false && file.frontmatter?.publish !== "false",
} satisfies Partial<RecentNotesOptions>)

const config = await loadQuartzConfig()
export default config
export const layout = await loadQuartzLayout()

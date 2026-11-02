import { loadQuartzConfig, loadQuartzLayout } from "./quartz/plugins/loader/config-loader"
import HomepageRecentUpdates from "./quartz/components/HomepageRecentUpdates"
import { PageTypeDispatcher } from "./quartz/plugins/pageTypes"

const config = await loadQuartzConfig()
export default config
const baseLayout = await loadQuartzLayout()
export const layout = {
  ...baseLayout,
  byPageType: {
    ...baseLayout.byPageType,
    content: {
      ...baseLayout.byPageType.content,
      afterBody: [
        ...(baseLayout.byPageType.content?.afterBody ?? baseLayout.defaults.afterBody ?? []),
        HomepageRecentUpdates(),
      ],
    },
  },
}

// The YAML loader creates its dispatcher before these TS layout overrides exist.
// Give that emitter the extended layout as well as exporting it for tooling.
config.plugins.emitters = config.plugins.emitters.map((emitter) =>
  emitter.name === "PageTypeDispatcher" ? PageTypeDispatcher(layout) : emitter,
)

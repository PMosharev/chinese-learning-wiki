import test from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import vm from "node:vm"

// Exercise the actual native integration without importing the emitter's CSS dependencies.
const emitter = readFileSync(new URL("./componentResources.ts", import.meta.url), "utf8")
const branch = emitter
  .split('cfg.analytics?.provider === "goatcounter"')[1]
  .split('} else if (cfg.analytics?.provider === "posthog")')[0]
const template = branch.slice(branch.indexOf("push(`") + 6, branch.lastIndexOf("`)"))
const script = new Function("cfg", "return `" + template + "`")({
  analytics: { websiteId: "pmosharevcw" },
}) as string

function fixture() {
  const document = new EventTarget() as EventTarget & Record<string, any>
  const appended: any[] = []
  const calls: string[] = []
  const context: any = { document, location: { pathname: "/chinese-learning-wiki/" } }
  context.window = context
  vm.createContext(context)
  document.createElement = () => ({
    setAttribute(this: Record<string, string>, name: string, value: string) {
      this[name] = value
    },
  })
  document.head = {
    appendChild(el: any) {
      appended.push(el)
      if (el.textContent) vm.runInContext(el.textContent, context)
    },
  }
  vm.runInContext(script, context)
  const tracker = appended.find((el) => el.src)
  return {
    calls,
    appended,
    tracker,
    context,
    load() {
      assert.equal(
        context.goatcounter.no_onload,
        true,
        "native loader must suppress automatic counting",
      )
      context.goatcounter.count = ({ path }: { path: string }) => calls.push(path)
      tracker.onload()
    },
    nav(path?: string) {
      if (path) context.location.pathname = path
      document.dispatchEvent(new Event("nav"))
    },
  }
}

for (const order of ["tracker-first", "router-first"] as const) {
  test(`GoatCounter counts initial load once and SPA/back navigation once: ${order}`, () => {
    const f = fixture()
    assert.equal(f.appended.filter((el) => el.src).length, 1)
    assert.equal(f.tracker.src, "https://gc.zgo.at/count.js")
    assert.equal(f.tracker["data-goatcounter"], "https://pmosharevcw.goatcounter.com/count")
    if (order === "tracker-first") {
      f.load()
      f.nav()
    } else {
      f.nav()
      f.load()
    }
    assert.deepEqual(f.calls, ["/chinese-learning-wiki/"])
    f.nav("/chinese-learning-wiki/n/example")
    f.nav("/chinese-learning-wiki/")
    assert.deepEqual(f.calls, [
      "/chinese-learning-wiki/",
      "/chinese-learning-wiki/n/example",
      "/chinese-learning-wiki/",
    ])
  })
}

test("late tracker counts the current page and remains attached across navigation", () => {
  const f = fixture()
  f.nav()
  f.nav("/chinese-learning-wiki/n/current")
  f.load()
  assert.deepEqual(f.calls, ["/chinese-learning-wiki/n/current"])
  f.nav("/chinese-learning-wiki/n/next")
  assert.equal(f.calls.length, 2)
  assert.equal(f.context.goatcounter.endpoint, "https://pmosharevcw.goatcounter.com/count")
})

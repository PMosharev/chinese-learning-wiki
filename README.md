# Chinese Learning Wiki

A personal collection of interconnected notes from learning Chinese: idioms, vocabulary, grammar, expressions encountered in films and TV dramas, and learning milestones.

**Website:** https://pmosharev.github.io/chinese-learning-wiki/  
**Source repository:** https://github.com/PMosharev/chinese-learning-wiki  
**Production branch:** `v5`

The site is built with [Quartz 5](https://quartz.jzhao.xyz/) and hosted on GitHub Pages.

## Architecture

- **Authoring:** Notes are written and maintained in Obsidian using Markdown, internal wiki links, and image attachments.
- **Publishing:** [Quartz Syncer](https://github.com/saberzero1/quartz-syncer) copies selected notes and attachments into this repository's `content/` directory. The Obsidian originals remain the source of truth.
- **Rendering:** Quartz builds a static website with search, backlinks, and navigation between linked notes.
- **Deployment:** GitHub Actions runs `.github/workflows/deploy.yml` after changes are pushed to `v5` and publishes the generated site to GitHub Pages.

Only selected notes are published. This repository is **not** a complete backup of the author's Obsidian vault.

## Publishing and updating notes

1. Create or edit a note in Obsidian. Images can be pasted directly into the note.
2. Set the note's Boolean/checkbox property `publish` to `true`.
3. Open **Quartz Syncer → Publication Center**, review the changes, and publish the intended notes and attachments.
4. After the GitHub Actions deployment completes, verify the page, images, and internal links on the public site.

To update an existing article—for example, to add another occurrence of an idiom—edit its **original Obsidian note** and publish the revision. Keep established filenames and permalinks stable where possible, especially after sharing links externally.

**Publication safety:** Review proposed deletions separately from ordinary note updates. Some files maintained only in the website repository, including the homepage, are intentionally absent from the Obsidian vault and should be preserved.

## Website development

Website layout, Quartz configuration, and deployment automation are maintained in this repository. Changes to published learning notes should normally be made in Obsidian, not directly in GitHub.

Before development, synchronize with updates published by Quartz Syncer and check the working tree:

```bash
git status
git pull --ff-only origin v5  # use with a clean working tree
```

For a local build, use the project's supported Node.js environment and lockfiles:

```bash
npm ci
npx quartz plugin install
npx quartz build
npx quartz build --serve
```

The preview server normally uses port `8080`. Site changes should be reviewed and built locally before they are committed and pushed. Check deployment status in [GitHub Actions](https://github.com/PMosharev/chinese-learning-wiki/actions).

For repository-specific development and safety rules, see [`AGENTS.md`](AGENTS.md).

### Homepage recent updates

The homepage's **Последние обновления** section is rendered at build time in the content layout's
`afterBody` slot, using Quartz's `ConditionalRender` and the installed Recent Notes component
(`@quartz-community/recent-notes` 1.0.0). The YAML Recent Notes sidebar remains disabled.
No homepage Markdown or Syncer workflow changes are needed as notes are published.
`quartz.ts` passes its extended layout to the existing Page Type Dispatcher factory, replacing
the instance that the YAML loader creates before TypeScript layout overrides are available.

The list includes at most ten real Markdown articles from `Notes/` and `Milestones/`, excluding
index pages, hubs, tags, drafts, `publish: false`, and unlisted notes. Virtual folder/tag indexes
have no eligible article source path; generated alias/permalink redirects are not article metadata
and are never listed. Links use Quartz's relative URL handling and point to the actual article,
leaving permanent redirect URLs intact. Empty lists are hidden.

Ordering and displayed dates use `dates.modified`, newest first, with a case-sensitive slug
comparison for equal timestamps. The existing Created Modified Date plugin (1.0.0) uses frontmatter,
then Git's latest file modification date, then filesystem mtime. Note Properties (1.0.0) first
normalizes `modified`/`lastmod`/`updated`/`last-modified`, and falls back to `created`/`date` if none
exists. Consequently, accurate revision ordering requires an explicit modification property:
imported publication dates, batch Git imports, and checkout filesystem timestamps may otherwise
misrepresent revision history. The list preserves that existing date pipeline and does not infer
new dates. Invalid date inputs may also be replaced by build time by the date plugin. Dates use
Quartz's compact `ru-RU` formatter and the build environment's timezone; sorting uses full timestamps.

Styles are scoped to `.homepage-recent-updates`, except for sharing the existing article-link
rules with that class. Titles wrap in a flexible grid column; dates occupy a separate column.
The original article link colors and hover colors are reused in both themes, with transparent
backgrounds and inherited body typography.

## Maintenance and recovery

- Protect existing published notes, attachments, permalinks, and `content/index.md` from accidental deletion.
- Avoid force-pushing, rewriting production history, or changing site dependencies without verifying the result.
- Do not commit secrets, private drafts, or local authentication and application state to this public repository.
- If a deployment fails, inspect the GitHub Actions logs and correct the problem before deploying again. The generated site can be rebuilt from the tracked source files.
- Maintain independent backups of the original notes and media; published content and Git history are not substitutes for a complete backup.

## Credits and content rights

Built with [Quartz](https://github.com/jackyzha0/quartz); see its [documentation](https://quartz.jzhao.xyz/) and the applicable license files in this repository. Original learning notes and media are not offered for unrestricted reuse merely because the website source is public. Third-party screenshots and excerpts retain their respective rights.

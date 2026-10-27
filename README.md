# Chinese Learning Wiki — public website

A personal, interconnected collection of Chinese-learning notes: idioms, vocabulary, grammar, excerpts from dramas, and learning milestones.

**Live site:** https://pmosharev.github.io/chinese-learning-wiki/  
**Repository:** https://github.com/PMosharev/chinese-learning-wiki  
**Production branch:** `v5`  
**Framework:** [Quartz 5](https://quartz.jzhao.xyz/), deployed to GitHub Pages with GitHub Actions.

## How the pieces fit together

- **Authoritative content:** a separate **Windows Obsidian vault**, including unpublished notes and original images.
- **Publication:** the Obsidian **Quartz Syncer** plugin sends selected notes and their media into this public repository (normally under `content/`). Publication is one-way: **do not edit the GitHub copies as if they were the original notes**.
- **Site development:** the Quartz checkout is maintained in WSL at `~/chinese-wiki-site` using Codex when needed.
- **Deployment:** a push to `v5` triggers `.github/workflows/deploy.yml`, which builds the static site and deploys it to GitHub Pages.
- **Backup:** the complete vault will be backed up separately in a **private** GitHub repository, `chinese-learning-vault` (to be created). Publication to this public repository is not a backup of the full vault.

## Everyday publishing (no terminal required)

1. Write or update a note in Obsidian; paste images into the note as usual.
2. Set its **checkbox** property `publish` to `true` (not a `publish` tag).
3. Open **Quartz Syncer → Publication Center** and review the selected changes.
4. Publish only the intended notes. Quartz Syncer updates GitHub; GitHub Actions rebuilds the site.
5. Check the deployed page, including images, internal links, and backlinks.

**Known exception:** this repository contains `content/index.md` as the site's landing page, but that file does not exist in the Obsidian vault. Quartz Syncer may consequently show `index.md` in **DELETED**. **Do not select it for deletion.** Preserve the homepage unless deliberately replacing it with a reviewed alternative.

For a previously published note, edit the **Obsidian original** and republish the change. Avoid renaming files or changing permalinks casually once their URLs have been shared on Telegram.

## Local development in WSL

The working checkout is `~/chinese-wiki-site`. Before making changes, check for new commits made by Quartz Syncer:

```bash
cd ~/chinese-wiki-site
git status
git fetch origin v5
git pull --ff-only origin v5   # only with a clean worktree
```

Then use Node.js 24 (installed via `nvm`) and the existing lockfiles:

```bash
nvm use 24
npm ci
npx quartz plugin install
npx quartz build
npx quartz build --serve
```

The preview server normally listens on port `8080`. This Windows/WSL setup previously required accessing the **WSL instance's IP address** from the Windows browser rather than `localhost`; the IP can change between sessions. Use `hostname -I` inside WSL if needed. Keep the preview command running while visiting the site.

**Publishing code changes:** review `git diff`, commit locally, then perform an explicitly authorized manual push to `v5`. Git authentication uses the existing 1Password-backed SSH setup. Codex must not perform unattended remote pushes. After deployment, check the [Actions page](https://github.com/PMosharev/chinese-learning-wiki/actions).

## Safety and maintenance

- Treat `content/Notes/` and published attachments as **generated publication copies**; edit the originals in Obsidian.
- Preserve `content/index.md`, `.github/workflows/deploy.yml`, `quartz.config.yaml`, and the package/plugin lockfiles unless there is a specific, reviewed reason to change them.
- Do not force-push, delete the `v5` branch, or run destructive Git cleanup commands. Review deletions in Quartz Syncer separately from ordinary publication.
- Keep tokens, SSH material, 1Password credentials, and private vault content out of this **public** repository.
- Keep changes to Quartz upgrades and dependencies deliberate; investigate npm security warnings rather than running `npm audit fix --force` blindly.
- If a deployment fails, fix the workflow and redeploy. The public website is reproducible from this repository; the authoritative notes are in the separate vault.

## Upstream project

This website is based on [Quartz](https://github.com/jackyzha0/quartz). Its documentation is at https://quartz.jzhao.xyz/. Quartz's existing license files and notices remain in the repository. Publishing personal notes or media here should not be interpreted as granting unrestricted reuse rights to that content.

# Agent instructions — Chinese Learning Wiki site

## Mission and scope

Maintain the **public Quartz 5 website** for the Chinese-learning wiki. This is the WSL checkout of `PMosharev/chinese-learning-wiki`, production branch `v5`; the live site is `https://pmosharev.github.io/chinese-learning-wiki/`.

The **Windows Obsidian vault is the source of truth** for notes and screenshots. Quartz Syncer publishes selected copies into `content/`. This repository is for site code, layout, configuration, deployment, and verification; it is **not** the master note archive.

## Non-negotiable safety boundaries

1. **No remote writes without explicit user authorization for that operation.** Never run `git push`, force-push, delete branches, reconfigure GitHub, or publish via the Obsidian CLI autonomously. Local commits are allowed when requested.
2. **Never retrieve or use secrets.** Do not invoke the 1Password CLI/SSH agent for credential discovery, copy tokens, inspect private keys, or print credentials into logs. Existing credentials are not permission to perform remote actions.
3. **Do not modify the Windows Obsidian vault** (including through `/mnt/c` or `/mnt/d`) without a separate, explicit task involving that vault.
4. **Do not delete or overwrite `content/index.md`** as routine cleanup. It is the live homepage and may show as **DELETED** in Quartz Syncer because there is no matching Obsidian note. Do not select it for remote deletion.
5. **Do not mass-edit, reorganize, delete, rename, or overwrite files under `content/`**, including images, unless the user explicitly requests a content migration with a reviewed manifest of affected paths and links. Published content may change independently via Quartz Syncer.
6. Do not use `git reset --hard`, `git clean -fd`, `git push --force`, bulk deletion, history rewriting, or automated repository mirroring. Do not bypass branch protection.
7. Never commit private notes, credentials, local `.obsidian` plugin data, build artifacts, or files outside the project's agreed scope.

## Before editing

- Inspect `git status`, current branch, and the relevant configuration/files. Check for changes introduced by Quartz Syncer since the last development session.
- If the worktree is clean, update using `git fetch origin v5` and `git pull --ff-only origin v5` when remote access is available; otherwise report that the checkout may be stale. Never overwrite local changes to resolve divergence.
- Confirm the change is in website code/configuration rather than an Obsidian-original note. Prefer Quartz configuration, plugin options, and small targeted styling changes over altering Quartz core.
- Limit work to the requested feature. Avoid unrequested CMS, database, bot, or framework additions.

## Implement and verify

- Use the existing Node.js 24 toolchain and lockfiles. Follow current repo scripts and documentation.
- For relevant changes, run `npm ci`, `npx quartz plugin install`, and `npx quartz build`, or explain why a step was skipped.
- Validate internal links, Chinese text, images, the homepage, and output paths when affected.
- Inspect `git diff --check`, `git diff --stat`, and all file deletions. Do not silently remove published content or shared permalinks.
- If dependency security warnings appear, report their scope and potential impact. **Do not use `npm audit fix --force` or upgrade Quartz/plugins as an unrelated side effect.**
- Keep generated `public/`, `node_modules/`, caches, and secrets out of Git.

## Handoff to the user

Report the files changed, tests performed, any unverified assumptions, risks to existing URLs/content, and exact manual next steps. If committing, provide the commit hash. **Stop before pushing** unless the user explicitly requested and authorized that push for the current task.

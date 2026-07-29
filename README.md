# @nithin-studio/ui-components

Shared, app-agnostic React components used across nithin-studio's sub-apps
(file-manager, image-importer, insta-downloader, ...). Extracted so each
sub-app can live in its own repo/deploy independently while still reusing
the same UI pieces, instead of copy-pasting them.

## Status: rebuilding from a clean slate

`src/` is being rebuilt from scratch, organized by category rather than a
flat list of component folders:

- `foundations/` — design tokens and base rules that aren't components
  themselves (`typography/`, `colors/` so far — layout to follow).
- `data-display/` — components for presenting data: `avatar/`, `badge/`,
  `chip/`, `divider/`, `icons/`, `list/`, `table/`, `tooltip/`, `text/`.
  `icons/` (SVG components, `stroke`/`fill="currentColor"`) lives inside
  this category rather than at `src/` root, since it's specifically the
  icon set these data-display components use.
- `utils/` (not yet created) — non-visual helpers.
- `_showcase/` — Storybook-presentation-only helpers (`ShowcasePage`,
  `ShowcaseCard`), used by `*.stories.tsx` files but never exported from
  the public API. Lives at `src/` root, not nested under `foundations/`,
  since it isn't one — excluded from declaration output in
  `vite.config.ts` (`dts({ exclude: [...] })`) so it doesn't ship in the
  published package.

Everything previously built (pre-restructure) lives, untracked by this
repo's git, at `../ui-components-backup/` (sibling directory, one level
up from this repo). When a component is actually needed, copy its folder
from there into the right category above, refactoring as it lands rather
than carrying old conventions over unexamined. Don't bulk-restore
everything at once — that defeats the point of starting clean.

### Showcase pages

Every category's Storybook page (`foundations/*`, `data-display/*`, ...)
uses the same shell, from `_showcase/`: `ShowcasePage` (full-width title
+ optional description) wrapping a stack of `ShowcaseCard`s (small
caption label + arbitrary preview content). See
`foundations/colors/Colors.stories.tsx` or
`data-display/avatar/Avatar.stories.tsx` for the pattern — one card per
variant/example, showing that case's own preview rather than a single
combined example. Keep new pages on this same shell so they read as one
system instead of each inventing its own layout.

`colors/palette.ts`/`palette.css` are the full raw color scale — 19
families × shades, no opinions attached.

`colors/accents.ts`/`accents.css` are the semantic layer on top of it —
`primary` for general UI, plus status colors for job/task/upload states
(`failed`/`error`/`danger`, `success`, `inProgress`, `queued`,
`disabled`), each a specific palette
shade picked deliberately, not derived. `failed`/`error`/`danger` are the
same color under three names, so any of them works depending on which
term fits the calling domain — the `Accents` Storybook page groups them
into one card since they're visually identical. This is about status semantics,
not general UI (there's no `--accent`/primary-action color yet — that's
still an open decision for later).

**Publishing a new opt-in CSS file** (like `typography.css`/`palette.css`)
needs no per-file wiring: the build script copies every `*.css` directly
under a `foundations/*/` folder into `dist/` (`find src/foundations -name
'*.css' ...`), and `"./*.css": "./dist/*.css"` in `package.json`'s
`exports` is a wildcard pattern that resolves any of them automatically
(`@nithin-studio/ui-components/whatever.css`). Just drop the file in —
no build script or `package.json` edit needed. The one assumption this
relies on: every `foundations/*/*.css` file is meant to be a public,
opt-in export, not component-internal styling (there's no CSS like that
under `foundations/` yet, but if that ever changes, this glob will need
narrowing).

## Using this in an app

```
pnpm add @nithin-studio/ui-components
```

Components read design tokens from CSS custom properties (`--bg`,
`--text`, `--border`, `--accent`, `--mono`, ...). There's no bundled
default/fallback file for these — the consuming app is expected to define
them itself (as nithin-studio's client does in `src/index.css`).

## Developing

```
pnpm install
pnpm dev             # Storybook at localhost:6006
pnpm build           # type-check + build dist/
pnpm build-storybook
```

Each component has a co-located `*.stories.tsx` — add one for any new
component so it's visible in Storybook before publishing.

## Testing

Every story is a real test, via `@storybook/addon-vitest` — Storybook's
own preview is rendered in a headless browser (Playwright/Chromium) and
checked for: it renders without throwing, has no accessibility violations
(`@storybook/addon-a11y`, enforced via `a11y.test: "error"` in
`.storybook/preview.tsx`), and passes any `play` function assertions
you've written (interaction tests — see
`../ui-components-backup/stepper/Stepper.stories.tsx` or
`../ui-components-backup/icon-button/IconButton.stories.tsx` for examples
using `userEvent`/`expect` from `storybook/test`).

```
pnpm test             # run once
pnpm test:watch       # watch mode
pnpm test:coverage    # run once + coverage/ HTML report
```

Add a `play` function to new stories that have meaningful interaction
(clicks, keyboard nav, state changes) rather than leaving them as pure
render smoke tests.

## Versioning & releasing

This package is a real dependency shared across independently-deployed
sub-apps. A breaking change here means every consumer needs to bump and
redeploy, so bump `major` deliberately and check Storybook for visual
regressions before publishing.

`main` is protected — all changes land via PR, and PRs can't merge until
CI (`.github/workflows/ci.yml`: lint, build, test, build-storybook) is
green.

Releasing is a **manual trigger, decoupled from any single PR**
(`.github/workflows/release.yml`) — publish happens immediately once
triggered, *then* `main` gets synced afterward:
1. PRs merge to `main` as normal. Merging doesn't release anything by
   itself — it's just accumulating changes for whenever the next release
   happens, whether that's after one PR or ten.
2. When you're ready to release: GitHub → **Actions → Release → Run
   workflow**, and pick the bump type (patch/minor/major) from the
   dropdown. The workflow bumps `package.json` to that version, builds,
   and publishes straight to GitHub Packages
   (`@nithin22796/ui-components`) — no PR gate before this step.
3. Only after that publish succeeds, it opens a PR to bring `main`'s
   `package.json` in line with what was just published, and enables
   auto-merge on it.
4. Once that PR's own CI run passes, it auto-merges — at which point
   `main` reflects the version that's already live on the registry.

No one manually runs `npm publish` or hand-edits the version number.
There's no changelog automation — write release notes separately if you
want them (e.g. the GitHub Release UI) rather than relying on commit
messages.

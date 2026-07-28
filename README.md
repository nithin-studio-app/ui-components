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
- `components/` (not yet created) — actual interactive/visual components.
- `icons/` (not yet created) — SVG icon components, kept separate since
  it's a large, frequently-growing flat asset list.
- `utils/` (not yet created) — non-visual helpers.

Everything previously built (pre-restructure) lives, untracked by this
repo's git, at `../ui-components-backup/` (sibling directory, one level
up from this repo). When a component is actually needed, copy its folder
from there into the right category above, refactoring as it lands rather
than carrying old conventions over unexamined. Don't bulk-restore
everything at once — that defeats the point of starting clean.

### Foundation showcase pages

Every `foundations/*` Storybook page (`typography/`, `colors/`, and
layout to follow) uses the same shell, from `foundations/_showcase/`:
`ShowcasePage` (full-width title + optional description) wrapping a
stack of `ShowcaseCard`s (small caption label + arbitrary preview
content). See `foundations/typography/Typography.stories.tsx` or
`foundations/colors/Colors.stories.tsx` for the pattern — one card per
item, showing that item's own preview rather than a single combined
example. Keep new foundation pages on this same shell so they read as
one system instead of each inventing its own layout.

`colors/palette.ts`/`palette.css` are the full raw color scale — 19
families × shades, no opinions attached.

`colors/accents.ts`/`accents.css` are the semantic layer on top of it —
status colors for job/task/upload states (`failed`/`error`/`danger`,
`success`, `inProgress`, `queued`, `disabled`), each a specific palette
shade picked deliberately, not derived. This is about status semantics,
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

## Versioning

This package is a real dependency shared across independently-deployed
sub-apps. A breaking change here means every consumer needs to bump and
redeploy, so bump `major` deliberately and check Storybook for visual
regressions before publishing.

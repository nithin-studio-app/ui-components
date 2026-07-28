# @nithin-studio/ui-components

Shared, app-agnostic React components used across nithin-studio's sub-apps
(file-manager, image-importer, insta-downloader, ...). Extracted so each
sub-app can live in its own repo/deploy independently while still reusing
the same UI pieces, instead of copy-pasting them.

## Status: clean slate

`src/` is currently empty (just a placeholder `index.ts`) — the library is
being rebuilt from scratch. Everything previously built lives, untracked
by this repo's git, at `../ui-components-backup/` (sibling directory, one
level up from this repo).

When a component is actually needed, copy its folder from
`../ui-components-backup/` into `src/`, refactoring the folder
structure/conventions as it lands rather than carrying them over
unexamined. Don't bulk-restore everything at once — that defeats the
point of starting clean.

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
pnpm test             # run once — errors with no stories in src/ yet
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

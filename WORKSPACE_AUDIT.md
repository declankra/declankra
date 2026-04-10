# Workspace Audit

This is a metadata-only audit for `/Users/macbook/Code`. No folders were moved as part of this pass.

## What To Keep At Root

These look like active, current, or still-useful top-level projects and should stay easy to reach:

- `ai-engineering`
- `chitrack`
- `declankramper.com`
- `dkbuilds.co`
- `elite-ai`
- `home-control`
- `interactive-letter`
- `led-control`
- `led-control-public`
- `ontology-xtract`
- `terminalcopypaste`
- `WakeWithMe`
- `xxcli`

## Likely Archive Candidates

These feel like old finished builds, retired experiments, or projects you already described as funny to revisit:

- `kaloX`
- `meet-or-not-test`
- `my-first-portfolio`
- `raspberryPiRecordPlayerSonos2`
- `scrolls`
- `soundcloudToMp3`

Recommended future move: group these into a single archive bucket again once you want the workspace to feel cleaner.

## Review Later

These are not obviously active or obviously archive from a quick pass, so they should be reviewed before any move:

- `1kby2025`
- `ChatWithPedoFiles`
- `PublicMarket`
- `app-store-scraper`
- `blog-starter-app`
- `bud-light-bracket-battle`
- `driving-distances`
- `farmmatch`
- `grade-calculator`
- `landing-page`
- `mac-focus-app`
- `mac-recorder`
- `mdrive`
- `melrose-bagels`
- `nextjs-app-router-shadcn-default`
- `nextjs-vercel`
- `notion-blog`
- `o1-xml-parser`
- `ppt-2-prd`
- `psprd-preview`
- `react-app-vercel`
- `rsi-wsb-scanner`
- `rsi-wsb-scanner-gCloud`
- `site-blocker-extension`
- `strava-personality-test`
- `sunlight-sips-chicago`
- `template`
- `upwardly`
- `v0-think-drop-landing-page`

## Public Mirror Pattern

`led-control-public` is a good pattern to keep using when a private or messy project needs a sanitized public-facing version.

Recommended rule:

- Keep the active private build in its normal root folder.
- Create a separate `-public` repo only when the public story is materially different from the working project.
- Avoid duplicating repos just to make them look cleaner if the original repo can be cleaned up directly.

## Next Cleanup Pass

When you want to do the soft reorg later, the order should be:

1. Confirm which root folders are truly active.
2. Move only obvious relics into an archive bucket.
3. Leave any project with current momentum at root.
4. Update `projects.catalog.json` first, then move folders second.

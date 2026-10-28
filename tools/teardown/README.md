# Teardown figures

Scroll-driven exploded line drawings for the homepage (engine stack) and the
download page (release kit). Run `pnpm teardown` after changing a drawing; it
writes `components/landing/teardown/<id>.generated.ts`, which the pages render.

```sh
pnpm teardown                         # every drawing
pnpm teardown release-kit             # one drawing
pnpm teardown --proof=/tmp/teardown   # plus proof sheets (needs rsvg-convert for PNGs)
```

## How it works

- `geometry.mjs` — every solid is a prism: a 2D profile extruded along a
  world axis. Lines drawn on faces (engravings, glyphs) carry the weight they
  print at: `edge`, `detail` or `texture`.
- `render.mjs` — parallel projection and hidden-line removal. Front-facing
  faces become occluders; creases and silhouettes become candidate lines
  (silhouettes print as `outline`). Each line is sampled along its length and
  tested against the occluders' depth.
- `build.mjs` — renders every part on its own, maps its ink into one figure
  frame and records each layer's explosion as a vertical shift. Layers explode
  along world z, which a parallel projection turns into a pure vertical move,
  so the page paints layers in order with paper-filled faces and translates
  them by `--t`. That occludes correctly at any spacing.
- `drawings/*.mjs` — the models. Each lists its layers top to bottom, an
  optional paint order, trail points and the lift of each layer.

The proof sheets put the page's layered composite (left) beside a render of
the whole scene at the same spacing (right), for t = 0, 0.3 and 1. They should
match line for line; a difference means a paint-order or fill problem.

## What the drawings show

Both are **concepts**: every dimension is invented, and the captions say so.

| Drawing | Grounded in | Invented |
| --- | --- | --- |
| Engine stack | Layer order follows `content/docs/architecture/index.mdx`: consumers (desktop app, CLI, Node.js API) over the JSON-RPC server, engine manager, protocol handlers, engine core (with the stats manager) and storage, upload sinks and Risuko Share. Ten handler modules match the homepage protocol list. | The order of modules inside the engine (the docs list them as peers), all geometry, the camera |
| Release kit | Platform groups and package managers from `lib/release.ts` and `lib/installs.ts`; checksums from the download page | The archive, lid, seal and device shapes, all geometry, the camera |

The release kit's builds sit inside the archive when assembled, so the archive
is two parts painted either side of them. The front and left walls face the
viewer and stay in front of every build at any lift.

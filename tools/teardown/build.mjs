#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import engineStack from "./drawings/engine-stack.mjs";
import releaseKit from "./drawings/release-kit.mjs";
import { createCamera, render } from "./render.mjs";

const DRAWINGS = [engineStack, releaseKit];
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const OUT = join(ROOT, "components/landing/teardown");

const PAD = 3;
const PART_PAD = 1.5;
const LABEL_GAP = 8;
const LABEL_WIDTH = 44;
const WIDTHS = { outline: 1.35, edge: 0.9, detail: 0.6, texture: 0.45 };

const round = (n) => Math.round(n * 100) / 100;
const round1 = (n) => Math.round(n * 10) / 10;
const union = (a, b) => ({
  x0: Math.min(a.x0, b.x0),
  y0: Math.min(a.y0, b.y0),
  x1: Math.max(a.x1, b.x1),
  y1: Math.max(a.y1, b.y1),
});
const shift = (b, dy) => ({ ...b, y0: b.y0 + dy, y1: b.y1 + dy });
function boundsOf(points) {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return {
    x0: Math.min(...xs),
    y0: Math.min(...ys),
    x1: Math.max(...xs),
    y1: Math.max(...ys),
  };
}

function aabb(part) {
  const points = [
    ...part.prisms.flatMap((s) => [...s.bottom, ...s.top]),
    ...part.lines.flatMap((l) => [l.a, l.b]),
  ];
  const lo = [0, 1, 2].map((i) => Math.min(...points.map((p) => p[i])));
  const hi = [0, 1, 2].map((i) => Math.max(...points.map((p) => p[i])));
  return { lo, hi };
}

function paintOrder(members, camera) {
  const after = (a, b) => {
    for (let k = 0; k < 3; k++) {
      const toward = camera.toward[k];
      if (a.box.lo[k] >= b.box.hi[k]) return toward > 0;
      if (a.box.hi[k] <= b.box.lo[k]) return toward < 0;
    }
    return a.index > b.index;
  };
  const order = [];
  for (const m of members) {
    const i = order.findIndex((o) => after(o, m));
    order.splice(i < 0 ? order.length : i, 0, m);
  }
  return order;
}

const polylinePath = (lines, map) =>
  lines
    .map((points) =>
      points
        .map(map)
        .map(([x, y], i) => `${i ? "L" : "M"}${round1(x)} ${round1(y)}`)
        .join(""),
    )
    .join("");
const polygonPath = (polygons, map) =>
  polygons.map((points) => `${polylinePath([points], map)}Z`).join("");

function layout(drawing) {
  const camera = createCamera(drawing.camera);
  const parts = drawing.build();
  const byId = new Map(parts.map((p) => [p.id, p]));
  drawing.layers.forEach((layer, index) => {
    for (const id of layer.parts) {
      const part = byId.get(id);
      if (!part)
        throw Error(
          `${drawing.id}: layer ${layer.id} names unknown part ${id}`,
        );
      part.explosion = [0, 0, drawing.explosion(layer, index)];
    }
  });

  const rendered = new Map(
    parts.map((part) => {
      const { ink, faces } = render([part], camera, 0);
      const inkPoints = Object.values(ink).flat(2);
      if (!inkPoints.length || !faces.length)
        throw Error(`${drawing.id}: ${part.id} drew nothing`);
      return [
        part.id,
        {
          part,
          ink,
          faces,
          inkPoints,
          bounds: boundsOf([...inkPoints, ...faces.flat()]),
        },
      ];
    }),
  );

  let number = 0;
  const layers = drawing.layers.map((layer) => {
    const members = paintOrder(
      layer.parts.map((id, index) => ({
        ...rendered.get(id),
        box: aabb(byId.get(id)),
        index,
      })),
      camera,
    );
    const lift = byId.get(layer.parts[0]).explosion;
    const dy = camera.project(lift)[1];
    const label = layer.label !== false;
    if (label) number += 1;
    return {
      ...layer,
      label,
      number,
      members,
      dy,
      bounds: members.map((m) => m.bounds).reduce(union),
      anchor: members
        .flatMap((m) => m.inkPoints)
        .reduce((best, p) => (p[0] > best[0] ? p : best)),
    };
  });
  const labelled = layers.filter((l) => l.label);
  const labelX = Math.max(...labelled.map((l) => l.anchor[0])) + LABEL_GAP;
  const extent = layers
    .map((l) => union(l.bounds, shift(l.bounds, l.dy)))
    .reduce(union);
  const origin = [extent.x0 - PAD, extent.y0 - PAD];
  const fig = ([x, y]) => [x - origin[0], y - origin[1]];
  const layerOf = (id) => layers.find((l) => l.id === id);

  const trails = drawing.trails.flatMap(({ at: [x, y], layers: ids }) =>
    ids.slice(1).map((below, i) => {
      const above = ids[i];
      const a = camera.project([x, y, drawing.surfaces[above].bottom]);
      const b = camera.project([x, y, drawing.surfaces[below].top]);
      return {
        above,
        below,
        x: round(a[0] - origin[0]),
        y: round(a[1] - origin[1]),
        length: round(b[1] - a[1]),
        shift: round(layerOf(above).dy),
        grow: round(layerOf(below).dy - layerOf(above).dy),
      };
    }),
  );

  const spriteId = (id) => `td-${drawing.id}-${id}`;
  const group = ({ part, ink, faces }) =>
    `<g id="${spriteId(part.id)}"><path stroke="none" d="${polygonPath(faces, fig)}"/>` +
    `<g fill="none" stroke-linecap="round" stroke-linejoin="round">` +
    Object.entries(WIDTHS)
      .filter(([role]) => ink[role]?.length)
      .map(
        ([role, width]) =>
          `<path stroke-width="${width}" vector-effect="non-scaling-stroke" d="${polylinePath(ink[role], fig)}"/>`,
      )
      .join("") +
    "</g></g>";
  const box = (b) => {
    const [x0, y0] = fig([b.x0 - PART_PAD, b.y0 - PART_PAD]);
    return [
      round(x0),
      round(y0),
      round(b.x1 - b.x0 + 2 * PART_PAD),
      round(b.y1 - b.y0 + 2 * PART_PAD),
    ];
  };

  const data = {
    id: drawing.id,
    title: drawing.title,
    description: drawing.description,
    figure: {
      width: round(labelX + LABEL_WIDTH - origin[0]),
      height: round(extent.y1 + PAD - origin[1]),
    },
    labelX: round(labelX - origin[0]),
    layers: layers.map((l) => ({
      id: l.id,
      name: l.name,
      number: l.number,
      label: l.label,
      dy: round(l.dy),
      box: box(l.bounds),
      anchor: fig(l.anchor).map(round),
      parts: l.members.map((m) => ({
        id: m.part.id,
        name: m.part.name,
        box: box(m.bounds),
      })),
    })),
    paint: drawing.paint ?? drawing.layers.map((l) => l.id).reverse(),
    trails,
    sprite: layers
      .flatMap((l) => l.members)
      .map(group)
      .join(""),
  };
  return { data, camera, parts, fig, layers };
}

function proofSheet({ data, camera, parts, fig }, t) {
  const ink = "#202020";
  const { width, height } = data.figure;
  const sized = data.sprite
    .replaceAll(' vector-effect="non-scaling-stroke"', "")
    .replace(
      /stroke-width="([\d.]+)"/g,
      (_, w) => `stroke-width="${round(w * 0.32)}"`,
    );
  let composite = "";
  for (const id of data.paint) {
    const layer = data.layers.find((l) => l.id === id);
    composite += `<g transform="translate(0 ${round(layer.dy * t)})">${layer.parts.map((p) => `<use href="#td-${data.id}-${p.id}"/>`).join("")}</g>`;
    for (const trail of data.trails.filter((tr) => tr.below === id)) {
      const y = trail.y + trail.shift * t;
      composite += `<line x1="${trail.x}" x2="${trail.x}" y1="${round(y)}" y2="${round(y + trail.length + trail.grow * t)}" stroke-width="0.25" stroke-dasharray="3 0.8 0.6 0.8"/>`;
    }
  }
  const scene = render(parts, camera, t).ink;
  const sceneInk = Object.entries(WIDTHS)
    .filter(([role]) => scene[role]?.length)
    .map(
      ([role, w]) =>
        `<path fill="none" stroke-width="${round(w * 0.32)}" d="${polylinePath(scene[role], fig)}"/>`,
    )
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width * 2} ${height}" width="${width * 12}" height="${height * 6}">` +
    `<rect width="100%" height="100%" fill="#fff"/><defs>${sized}</defs>` +
    `<g stroke="${ink}" fill="#fff" stroke-linecap="round" stroke-linejoin="round">${composite}` +
    `<g transform="translate(${width} 0)">${sceneInk}</g></g>` +
    `<line x1="${width}" x2="${width}" y1="0" y2="${height}" stroke="#d33" stroke-width="0.2"/></svg>`
  );
}

const args = process.argv.slice(2);
const proof = args
  .find((a) => a.startsWith("--proof="))
  ?.slice("--proof=".length);
const only = args.filter((a) => !a.startsWith("--"));

for (const drawing of DRAWINGS) {
  if (only.length && !only.includes(drawing.id)) continue;
  const result = layout(drawing);
  const file = join(OUT, `${drawing.id}.generated.ts`);
  writeFileSync(
    file,
    `export const DRAWING = ${JSON.stringify(result.data, null, 2)} as const;\n`,
  );
  const { width, height } = result.data.figure;
  console.log(
    `${relative(process.cwd(), file)}: ${width} × ${height}, sprite ${(result.data.sprite.length / 1024).toFixed(1)} KB`,
  );

  if (proof) {
    mkdirSync(proof, { recursive: true });
    for (const t of [0, 0.3, 1]) {
      const svg = join(proof, `${drawing.id}-${t}.svg`);
      writeFileSync(svg, proofSheet(result, t));
      try {
        execFileSync("rsvg-convert", [
          "-o",
          svg.replace(/\.svg$/, ".png"),
          svg,
        ]);
      } catch {}
    }
  }
}

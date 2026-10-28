import { dot } from "./geometry.mjs";

const STEP = 0.12;
const DEPTH_EPSILON = 1e-3;
const CELL = 4;

export function createCamera({ azimuth, elevation }) {
  const a = (azimuth * Math.PI) / 180;
  const e = (elevation * Math.PI) / 180;
  const right = [-Math.sin(a), Math.cos(a), 0];
  const up = [
    -Math.sin(e) * Math.cos(a),
    -Math.sin(e) * Math.sin(a),
    Math.cos(e),
  ];
  const toward = [
    Math.cos(e) * Math.cos(a),
    Math.cos(e) * Math.sin(a),
    Math.sin(e),
  ];
  const project = (p) => [dot(p, right), -dot(p, up), dot(p, toward)];
  return { right, up, toward, project };
}

const add = (a, b) => a.map((c, i) => c + b[i]);
const scale = (v, k) => v.map((c) => c * k);
const facing = (normal, camera) => dot(normal, camera.toward) > 1e-9;
const angleBetween = (a, b) =>
  (Math.acos(Math.max(-1, Math.min(1, dot(a, b)))) * 180) / Math.PI;

function collect(parts, camera, t) {
  const occluders = [];
  const lines = [];
  const fills = [];

  for (const part of parts) {
    const shift = scale(part.explosion, t);
    const at = (p) => add(p, shift);

    for (const solid of part.prisms) {
      const n = solid.bottom.length;
      const bottom = solid.bottom.map(at);
      const top = solid.top.map(at);
      const front = solid.sides.map((normal) => facing(normal, camera));
      const caps = [
        { points: bottom, front: facing(solid.bottomNormal, camera) },
        { points: top, front: facing(solid.topNormal, camera) },
      ];

      for (const cap of caps) {
        if (!cap.front) continue;
        for (const [i, j, k] of solid.cap)
          occluders.push([cap.points[i], cap.points[j], cap.points[k]]);
        fills.push(cap.points);
      }
      const ridge = solid.sides.map(
        (side, i) =>
          angleBetween(solid.sides[(i + n - 1) % n], side) > solid.crease,
      );
      for (const cap of caps) {
        const rim = front.map((side) =>
          !cap.front && !side ? null : cap.front !== side ? "outline" : "edge",
        );
        const start = ridge.indexOf(true);
        for (let k = 0, from = 0; k <= n; k++) {
          const i = (Math.max(start, 0) + k) % n;
          if (k === n || (k > 0 && ridge[i])) {
            const span = Array.from(
              { length: k - from },
              (_, m) => (Math.max(start, 0) + from + m) % n,
            );
            if (span.some((s) => rim[s] === "outline"))
              for (const s of span) if (rim[s]) rim[s] = "outline";
            from = k;
          }
        }
        rim.forEach((role, i) => {
          if (role)
            lines.push({ a: cap.points[i], b: cap.points[(i + 1) % n], role });
        });
      }
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        if (front[i]) {
          occluders.push([bottom[i], bottom[j], top[j]]);
          occluders.push([bottom[i], top[j], top[i]]);
        }
        const h = (i + n - 1) % n;
        if (front[h] !== front[i]) {
          lines.push({ a: bottom[i], b: top[i], role: "outline" });
        } else if (ridge[i] && front[i]) {
          lines.push({ a: bottom[i], b: top[i], role: "edge" });
        }
      }
      for (let i = 0; i < n; i++) {
        if (!front[i] || front[(i + n - 1) % n]) continue;
        const run = [i];
        for (let m = i; front[m]; m = (m + 1) % n) run.push((m + 1) % n);
        fills.push([
          ...run.map((m) => bottom[m]),
          ...run.reverse().map((m) => top[m]),
        ]);
      }
    }
    for (const l of part.lines)
      lines.push({ a: at(l.a), b: at(l.b), role: l.role });
  }
  return { occluders, lines, fills };
}

function occlusionIndex(triangles, camera) {
  const grid = new Map();
  for (const tri of triangles) {
    const p = tri.map(camera.project);
    const area =
      (p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) -
      (p[2][0] - p[0][0]) * (p[1][1] - p[0][1]);
    if (Math.abs(area) < 1e-9) continue;
    const entry = { p, area };
    const xs = p.map((q) => q[0]);
    const ys = p.map((q) => q[1]);
    for (
      let gx = Math.floor(Math.min(...xs) / CELL);
      gx <= Math.floor(Math.max(...xs) / CELL);
      gx++
    ) {
      for (
        let gy = Math.floor(Math.min(...ys) / CELL);
        gy <= Math.floor(Math.max(...ys) / CELL);
        gy++
      ) {
        const key = `${gx},${gy}`;
        const bucket = grid.get(key);
        if (bucket) bucket.push(entry);
        else grid.set(key, [entry]);
      }
    }
  }
  return (s) => {
    const bucket = grid.get(
      `${Math.floor(s[0] / CELL)},${Math.floor(s[1] / CELL)}`,
    );
    if (!bucket) return false;
    for (const { p, area } of bucket) {
      const w0 =
        ((p[1][0] - s[0]) * (p[2][1] - s[1]) -
          (p[2][0] - s[0]) * (p[1][1] - s[1])) /
        area;
      const w1 =
        ((p[2][0] - s[0]) * (p[0][1] - s[1]) -
          (p[0][0] - s[0]) * (p[2][1] - s[1])) /
        area;
      const w2 = 1 - w0 - w1;
      if (w0 < -1e-9 || w1 < -1e-9 || w2 < -1e-9) continue;
      const depth = w0 * p[0][2] + w1 * p[1][2] + w2 * p[2][2];
      if (depth > s[2] + DEPTH_EPSILON) return true;
    }
    return false;
  };
}

function visibleRuns(a, b, hidden) {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const steps = Math.max(2, Math.ceil(length / STEP));
  const at = (k) => a.map((c, i) => c + (b[i] - c) * k);
  const seen = (k) => !hidden(at(k));
  const edge = (lo, hi, loSeen) => {
    for (let i = 0; i < 10; i++) {
      const mid = (lo + hi) / 2;
      if (seen(mid) === loSeen) lo = mid;
      else hi = mid;
    }
    return loSeen ? lo : hi;
  };
  const runs = [];
  let start = seen(0) ? 0 : null;
  let previous = start !== null;
  for (let s = 1; s <= steps; s++) {
    const k = s / steps;
    const now = seen(k);
    if (now && !previous) start = edge((s - 1) / steps, k, false);
    if (!now && previous && start !== null) {
      const end = edge((s - 1) / steps, k, true);
      if (end > start) runs.push([at(start), at(end)]);
      start = null;
    }
    previous = now;
  }
  if (previous && start !== null && start < 1) runs.push([at(start), at(1)]);
  return runs
    .map(([p, q]) => [
      [p[0], p[1]],
      [q[0], q[1]],
    ])
    .filter(([p, q]) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 0.02);
}

function chain(segments) {
  const key = (p) => `${Math.round(p[0] * 50)},${Math.round(p[1] * 50)}`;
  const ends = new Map();
  segments.forEach(([p, q], i) => {
    for (const k of [key(p), key(q)]) {
      const list = ends.get(k);
      if (list) list.push(i);
      else ends.set(k, [i]);
    }
  });
  const used = new Set();
  const take = (k) => (ends.get(k) ?? []).find((i) => !used.has(i));
  const paths = [];
  segments.forEach((segment, i) => {
    if (used.has(i)) return;
    used.add(i);
    const path = [...segment];
    for (const forward of [true, false]) {
      for (;;) {
        const end = forward ? path[path.length - 1] : path[0];
        const next = take(key(end));
        if (next === undefined) break;
        used.add(next);
        const [p, q] = segments[next];
        const other = key(p) === key(end) ? q : p;
        if (forward) path.push(other);
        else path.unshift(other);
      }
    }
    paths.push(path);
  });
  return paths;
}

export function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy);
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const p = points[i];
    const d =
      length < 1e-9
        ? Math.hypot(p[0] - a[0], p[1] - a[1])
        : Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / length;
    if (d > worst) {
      worst = d;
      index = i;
    }
  }
  if (worst <= tolerance) return [a, b];
  return [
    ...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(index), tolerance),
  ];
}

export function render(parts, camera, t = 0) {
  const { occluders, lines, fills } = collect(parts, camera, t);
  const hidden = occlusionIndex(occluders, camera);
  const byRole = {};
  for (const { a, b, role } of lines) {
    const runs = visibleRuns(camera.project(a), camera.project(b), hidden);
    if (!runs.length) continue;
    byRole[role] = [...(byRole[role] ?? []), ...runs];
  }
  const ink = {};
  for (const [role, segments] of Object.entries(byRole)) {
    ink[role] = chain(segments).map((path) => simplify(path, 0.02));
  }
  const faces = fills.map((polygon) => {
    const page = polygon.map((p) => {
      const q = camera.project(p);
      return [q[0], q[1]];
    });
    const area = page.reduce((sum, [x, y], i) => {
      const [nx, ny] = page[(i + 1) % page.length];
      return sum + x * ny - nx * y;
    }, 0);
    return area < 0 ? page.reverse() : page;
  });
  return { ink, faces };
}

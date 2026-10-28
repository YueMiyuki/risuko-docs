export function part(id, name) {
  return {
    id,
    name,
    explosion: [0, 0, 0],
    prisms: [],
    lines: [],
  };
}

const signedArea = (points) =>
  points.reduce((sum, [x, y], i) => {
    const [nx, ny] = points[(i + 1) % points.length];
    return sum + x * ny - nx * y;
  }, 0) / 2;

function cleanProfile(profile) {
  const points = profile.filter((p, i) => {
    const q = profile[(i + profile.length - 1) % profile.length];
    return Math.hypot(p[0] - q[0], p[1] - q[1]) > 1e-6;
  });
  if (points.length < 3) throw Error("A profile needs at least three points");
  return signedArea(points) < 0 ? points.reverse() : points;
}

function triangulate(points) {
  const cross = (a, b, c) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const inside = (p, a, b, c) =>
    cross(a, b, p) >= -1e-12 &&
    cross(b, c, p) >= -1e-12 &&
    cross(c, a, p) >= -1e-12;
  const left = points.map((_, i) => i);
  const triangles = [];
  let guard = 0;
  while (left.length > 3 && guard++ < 100000) {
    let clipped = false;
    for (let k = 0; k < left.length; k++) {
      const i = left[(k + left.length - 1) % left.length];
      const j = left[k];
      const n = left[(k + 1) % left.length];
      const [a, b, c] = [points[i], points[j], points[n]];
      if (cross(a, b, c) <= 1e-12) continue;
      const blocked = left.some(
        (m) => m !== i && m !== j && m !== n && inside(points[m], a, b, c),
      );
      if (blocked) continue;
      triangles.push([i, j, n]);
      left.splice(k, 1);
      clipped = true;
      break;
    }
    if (!clipped) throw Error("Profile is not a simple polygon");
  }
  triangles.push([left[0], left[1], left[2]]);
  return triangles;
}

export function prism(
  p,
  profile,
  { plane = "xy", at = 0, depth, crease = 25 },
) {
  if (!(depth > 0)) throw Error("A prism needs a positive depth");
  const points = cleanProfile(profile);
  const place =
    plane === "xy" ? (u, v, w) => [u, v, at + w] : (u, v, w) => [u, at + w, v];
  const outward =
    plane === "xy" ? (du, dv) => [dv, -du, 0] : (du, dv) => [dv, 0, -du];
  const sides = points.map(([u, v], i) => {
    const [nu, nv] = points[(i + 1) % points.length];
    const n = outward(nu - u, nv - v);
    const length = Math.hypot(...n);
    return n.map((c) => c / length);
  });
  p.prisms.push({
    bottom: points.map(([u, v]) => place(u, v, 0)),
    top: points.map(([u, v]) => place(u, v, depth)),
    sides,
    bottomNormal: plane === "xy" ? [0, 0, -1] : [0, -1, 0],
    topNormal: plane === "xy" ? [0, 0, 1] : [0, 1, 0],
    cap: triangulate(points),
    crease,
  });
  return p;
}

export function box(p, [x0, y0, z0], [x1, y1, z1], { radius = 0 } = {}) {
  if (!(x1 > x0 && y1 > y0 && z1 > z0)) throw Error("A box needs size");
  const profile =
    radius > 0
      ? roundedRect(x1 - x0, y1 - y0, radius, [(x0 + x1) / 2, (y0 + y1) / 2])
      : [
          [x0, y0],
          [x1, y0],
          [x1, y1],
          [x0, y1],
        ];
  return prism(p, profile, { at: z0, depth: z1 - z0 });
}

export function roundedRect(width, height, radius, [cx, cy] = [0, 0]) {
  if (radius * 2 > Math.min(width, height)) throw Error("Radius too large");
  const steps = Math.max(4, Math.ceil(radius * 3));
  const hx = width / 2 - radius;
  const hy = height / 2 - radius;
  const corners = [
    [hx, -hy, -Math.PI / 2],
    [hx, hy, 0],
    [-hx, hy, Math.PI / 2],
    [-hx, -hy, Math.PI],
  ];
  return corners.flatMap(([x, y, start]) =>
    Array.from({ length: steps + 1 }, (_, i) => {
      const a = start + (i / steps) * (Math.PI / 2);
      return [cx + x + radius * Math.cos(a), cy + y + radius * Math.sin(a)];
    }),
  );
}

export function circleProfile(cx, cy, radius, segments = 72, start = 0) {
  return Array.from({ length: segments }, (_, i) => {
    const a = start + (i / segments) * Math.PI * 2;
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
  });
}

export function line(p, a, b, role = "detail") {
  p.lines.push({ a, b, role });
  return p;
}

export function polyline(p, points, { closed = false, role = "detail" } = {}) {
  const n = closed ? points.length : points.length - 1;
  for (let i = 0; i < n; i++)
    line(p, points[i], points[(i + 1) % points.length], role);
  return p;
}

export function circle(p, center, radius, normal, options = {}) {
  const { role = "detail" } = options;
  const segments =
    options.segments ?? Math.min(96, Math.max(16, Math.round(radius * 8)));
  const k = normalize(normal);
  const helper = Math.abs(k[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = normalize(cross(k, helper));
  const v = cross(k, u);
  const points = Array.from({ length: segments }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return center.map(
      (c, j) => c + radius * (u[j] * Math.cos(a) + v[j] * Math.sin(a)),
    );
  });
  return polyline(p, points, { closed: true, role });
}

export const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export function normalize(v) {
  const length = Math.hypot(...v);
  return v.map((c) => c / length);
}

import {
  box,
  circle,
  circleProfile,
  line,
  part,
  polyline,
  prism,
  roundedRect,
} from "../geometry.mjs";

const SPACING = 36;
const LIFT = 0.05;

const Z = {
  outputs: 0,
  core: 24,
  handlers: 31.3,
  queue: 39.9,
  rpc: 46.2,
  consumers: 53.3,
};

export default {
  id: "engine-stack",
  title: "Fig. 1 — Risuko engine stack. Illustrative.",
  description:
    "Exploded line drawing of Risuko's architecture as six stacked layers: consumers (desktop app, tray flyout, CLI and Node.js API), the JSON-RPC server, the engine manager, ten protocol handlers, the engine core with its stats manager, and storage, upload sinks and Risuko Share.",
  camera: { azimuth: -120, elevation: 24 },
  layers: [
    {
      id: "consumers",
      name: "Consumers",
      parts: ["desktop", "flyout", "cli", "node"],
    },
    { id: "rpc", name: "JSON-RPC server", parts: ["rpc"] },
    { id: "queue", name: "Engine manager", parts: ["queue"] },
    { id: "handlers", name: "Protocol handlers", parts: ["handlers"] },
    { id: "core", name: "Engine core", parts: ["core", "stats"] },
    {
      id: "outputs",
      name: "Storage & sinks",
      parts: ["disk", "cloud", "share"],
    },
  ],
  surfaces: {
    consumers: { bottom: Z.consumers },
    rpc: { top: Z.rpc + 3, bottom: Z.rpc },
    queue: { top: Z.queue + 4, bottom: Z.queue },
    handlers: { top: Z.handlers + 2.5, bottom: Z.handlers },
    core: { top: Z.core + 3, bottom: Z.core },
    outputs: { top: 9 },
  },
  trails: [
    {
      at: [-50, -23],
      layers: ["consumers", "rpc", "queue", "handlers", "core", "outputs"],
    },
    {
      at: [50, -23],
      layers: ["consumers", "rpc", "queue", "handlers", "core"],
    },
  ],
  explosion: (_layer, index) => (2.5 - index) * SPACING,
  build,
};

function build() {
  const top = (p, points, z, options) =>
    polyline(
      p,
      points.map(([x, y]) => [x, y, z + LIFT]),
      options,
    );
  const rect = (p, x0, y0, x1, y1, z, role = "detail") =>
    top(
      p,
      [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ],
      z,
      { closed: true, role },
    );
  const rounded = (p, cx, cy, w, h, r, z, role = "detail") =>
    top(p, roundedRect(w, h, r, [cx, cy]), z, { closed: true, role });
  const dot = (p, cx, cy, r, z, role = "detail") =>
    circle(p, [cx, cy, z + LIFT], r, [0, 0, 1], { role });
  const front = (p, y, points, options) =>
    polyline(
      p,
      points.map(([x, z]) => [x, y - LIFT, z]),
      options,
    );
  const plate = (p, z, h, r = 3) =>
    box(p, [-55, -28, z], [55, 28, z + h], { radius: r });

  const desktop = part("desktop", "Desktop app");
  {
    const z = Z.consumers;
    const t = z + 3;
    box(desktop, [-55, -28, z], [14, 28, t], { radius: 3 });
    line(desktop, [-53, 22, t + LIFT], [12, 22, t + LIFT]);
    for (const x of [-50, -46.5, -43]) dot(desktop, x, 25, 1.1, t);
    line(desktop, [-38, -26, t + LIFT], [-38, 22, t + LIFT]);
    for (const y of [17, 12.5, 8])
      line(desktop, [-52, y, t + LIFT], [-42, y, t + LIFT], "texture");
    [0.82, 0.46, 0.68, 0.24].forEach((progress, i) => {
      const y = 15 - i * 9.5;
      line(
        desktop,
        [-34, y + 2.4, t + LIFT],
        [-14, y + 2.4, t + LIFT],
        "texture",
      );
      rect(desktop, -34, y - 1.6, 10, y, t);
      line(
        desktop,
        [-34, y - 0.8, t + LIFT],
        [-34 + 44 * progress, y - 0.8, t + LIFT],
        "edge",
      );
    });
  }

  const flyout = part("flyout", "Tray flyout");
  {
    const z = Z.consumers;
    const t = z + 2.5;
    box(flyout, [20, -2, z], [42, 28, t], { radius: 2.5 });
    line(flyout, [22, 23, t + LIFT], [40, 23, t + LIFT]);
    for (const y of [17.5, 11.5, 5.5]) rounded(flyout, 31, y, 18, 4, 1.2, t);
  }

  const cli = part("cli", "CLI");
  {
    const z = Z.consumers;
    box(cli, [18, -27, z], [34, -13, z + 8], { radius: 1.5 });
    front(
      cli,
      -27,
      [
        [21.5, z + 6.2],
        [25, z + 4.2],
        [21.5, z + 2.2],
      ],
      { role: "edge" },
    );
    front(
      cli,
      -27,
      [
        [26.5, z + 2.2],
        [31, z + 2.2],
      ],
      { role: "edge" },
    );
  }

  const node = part("node", "Node.js API");
  {
    const z = Z.consumers;
    const h = 8;
    prism(node, circleProfile(46, -18, 8.5, 6, Math.PI / 6), {
      at: z,
      depth: h,
    });
    top(node, circleProfile(46, -18, 8.5 * 0.62, 6, Math.PI / 6), z + h, {
      closed: true,
    });
  }

  const rpc = part("rpc", "JSON-RPC server");
  {
    const z = Z.rpc;
    const t = z + 3;
    plate(rpc, z, 3);
    for (const [x0, x1] of [
      [-48, -14],
      [14, 48],
    ]) {
      box(rpc, [x0, -22, t + 0.3], [x1, -14, t + 3.3], { radius: 1 });
      for (let x = x0 + 3; x < x1 - 1; x += 4)
        dot(rpc, x, -18, 0.9, t + 3.3, "texture");
    }
    for (const y of [-20.5, -18, -15.5])
      line(rpc, [-14, y, t + LIFT], [14, y, t + LIFT]);
  }

  const queue = part("queue", "Engine manager");
  {
    const z = Z.queue;
    const t = z + 4;
    plate(queue, z, 4);
    [80, 52, 66, 30, 90].forEach((length, i) => {
      const y = -20 + i * 10;
      rounded(queue, 0, y, 96, 6, 3, t);
      box(queue, [-46, y - 1.6, t + 0.3], [-46 + length, y + 1.6, t + 1.5], {
        radius: 1.4,
      });
    });
  }

  const handlers = part("handlers", "Protocol handlers");
  {
    const z = Z.handlers;
    const t = z + 2.5;
    plate(handlers, z, 2.5);
    for (const cy of [-12, 12]) {
      for (const cx of [-42, -21, 0, 21, 42]) {
        box(
          handlers,
          [cx - 8.5, cy - 10, t + 0.3],
          [cx + 8.5, cy + 10, t + 5.3],
          { radius: 1.2 },
        );
        dot(handlers, cx + 5, cy - 6.5, 1.2, t + 5.3);
        line(
          handlers,
          [cx - 5.5, cy - 6.5, t + 5.3 + LIFT],
          [cx + 1.5, cy - 6.5, t + 5.3 + LIFT],
        );
      }
    }
  }

  const core = part("core", "Engine core");
  {
    const z = Z.core;
    const t = z + 3;
    plate(core, z, 3);
    box(core, [-46, -21, t + 0.3], [-6, 15, t + 3.5], { radius: 1.5 });
    rounded(core, -26, -3, 30, 26, 1, t + 3.5);
    dot(core, -26, -3, 4, t + 3.5);
    for (let x = -50; x <= 50; x += 3.2)
      line(core, [x, -26.4, t + LIFT], [x, -24.2, t + LIFT], "texture");
    for (const [x0, x1] of [
      [4, 18],
      [21, 35],
      [38, 50],
    ])
      rect(core, x0, 6, x1, 20, t);
  }

  const stats = part("stats", "Stats manager");
  {
    const z = Z.core + 3.3;
    const t = z + 3.2;
    box(stats, [6, -22, z], [44, -4, t], { radius: 1.2 });
    for (const [i, h] of [5, 9, 7, 12, 10].entries()) {
      rect(stats, 11 + i * 6, -19, 14.6 + i * 6, -19 + h, t);
    }
  }

  const disk = part("disk", "Local storage");
  {
    const t = 9;
    box(disk, [-54, -27, 0], [-16, 8, t], { radius: 2.5 });
    dot(disk, -35, -9.5, 13, t, "edge");
    dot(disk, -35, -9.5, 2.2, t);
    top(
      disk,
      [
        [-20, 4],
        [-26, -2],
        [-31.5, -6.5],
      ],
      t,
    );
    dot(disk, -20, 4, 1.8, t);
    front(
      disk,
      -27,
      [
        [-30, 2.5],
        [-22, 2.5],
        [-22, 5],
        [-30, 5],
      ],
      { closed: true },
    );
  }

  const cloud = part("cloud", "Upload sinks");
  {
    const lobes = [
      [-10, 5, 5],
      [10.5, 5.5, 5.5],
      [1, 9, 7.5],
      [-5.5, 9, 5],
    ];
    const inside = ([x, y]) =>
      (y >= 0 && y <= 5 && x >= -10 && x <= 10.5) ||
      lobes.some(([cx, cy, r]) => Math.hypot(x - cx, y - cy) <= r);
    const profile = [];
    for (let i = 0; i < 180; i++) {
      const a = (i / 180) * Math.PI * 2;
      let lo = 0;
      let hi = 30;
      for (let k = 0; k < 40; k++) {
        const mid = (lo + hi) / 2;
        if (inside([Math.cos(a) * mid, 6 + Math.sin(a) * mid])) lo = mid;
        else hi = mid;
      }
      profile.push([6 + Math.cos(a) * lo, 6 + Math.sin(a) * lo]);
    }
    prism(cloud, profile, { plane: "xz", at: -14, depth: 6, crease: 40 });
  }

  const share = part("share", "Risuko Share");
  {
    const yFront = -12.4;
    const cx = 37.5;
    prism(share, roundedRect(13, 23, 2.4, [cx, 11.5]), {
      plane: "xz",
      at: yFront,
      depth: 2.4,
    });
    front(share, yFront, roundedRect(10.4, 18.6, 1.4, [cx, 12]), {
      closed: true,
    });
    front(
      share,
      yFront,
      [
        [cx, 17.5],
        [cx, 9.5],
      ],
      { role: "edge" },
    );
    front(
      share,
      yFront,
      [
        [cx - 3, 12.5],
        [cx, 9.5],
        [cx + 3, 12.5],
      ],
      { role: "edge" },
    );
    front(
      share,
      yFront,
      [
        [cx - 3.6, 6.8],
        [cx + 3.6, 6.8],
      ],
      { role: "edge" },
    );
  }

  return [
    desktop,
    flyout,
    cli,
    node,
    rpc,
    queue,
    handlers,
    core,
    stats,
    disk,
    cloud,
    share,
  ];
}

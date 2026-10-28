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

const LIFT = 0.05;
const WALL = 16;
const FLOOR = 2;
const BASE = FLOOR + 0.3;
const LID = { bottom: WALL + 0.4, top: WALL + 3.4 };
const EXPLOSION = { lid: 46, builds: 2, archive: -34, "archive-front": -34 };

export default {
  id: "release-kit",
  title: "Fig. 1 — Risuko release kit. Illustrative.",
  description:
    "Exploded line drawing of a Risuko release as a lidded archive: the lid with its checksum seal lifts off, and six platform builds rise out of the archive: macOS, Windows, Linux, Android, the command line and the package managers.",
  camera: { azimuth: -120, elevation: 28 },
  layers: [
    { id: "lid", name: "Checksums", parts: ["lid", "seal"] },
    {
      id: "builds",
      name: "Platform builds",
      parts: ["macos", "windows", "linux", "android", "cli", "packages"],
    },
    { id: "archive", name: "Release archive", parts: ["archive"] },
    {
      id: "archive-front",
      name: "Release archive",
      parts: ["archive-front"],
      label: false,
    },
  ],
  paint: ["archive", "builds", "archive-front", "lid"],
  surfaces: { lid: { bottom: LID.bottom }, "archive-front": { top: WALL } },
  trails: [
    { at: [-55, -36], layers: ["lid", "archive-front"] },
    { at: [55, -36], layers: ["lid", "archive-front"] },
  ],
  explosion: (layer) => EXPLOSION[layer.id],
  build,
};

function build() {
  const rect = (p, x0, y0, x1, y1, z, role = "detail") =>
    polyline(
      p,
      [
        [x0, y0],
        [x1, y0],
        [x1, y1],
        [x0, y1],
      ].map(([x, y]) => [x, y, z + LIFT]),
      { closed: true, role },
    );
  const front = (p, y, points, options) =>
    polyline(
      p,
      points.map(([x, z]) => [x, y - LIFT, z]),
      options,
    );
  const frontRect = (p, y, x0, z0, x1, z1, role = "detail") =>
    front(
      p,
      y,
      [
        [x0, z0],
        [x1, z0],
        [x1, z1],
        [x0, z1],
      ],
      { closed: true, role },
    );

  const archive = part("archive", "Release archive");
  box(archive, [-56, -37, 0], [56, 37, FLOOR]);
  box(archive, [-56, 35, FLOOR + 0.05], [56, 37, WALL]);
  box(archive, [54, -34.95, FLOOR + 0.05], [56, 34.95, WALL]);
  for (const cx of [-36, 0, 36]) {
    for (const cy of [-17.5, 17.5])
      rect(archive, cx - 17, cy - 16, cx + 17, cy + 16, FLOOR, "texture");
  }

  const archiveFront = part("archive-front", "Release archive");
  box(archiveFront, [-56, -37, FLOOR + 0.05], [56, -35, WALL]);
  box(archiveFront, [-56, -34.95, FLOOR + 0.05], [-54, 34.95, WALL]);
  frontRect(archiveFront, -37, -22, 5, 22, 12.5);
  for (const [z, x1] of [
    [10.5, 12],
    [8.5, 16],
    [6.8, 4],
  ])
    front(
      archiveFront,
      -37,
      [
        [-19, z],
        [x1, z],
      ],
      { role: "texture" },
    );

  const lid = part("lid", "Release lid");
  box(lid, [-57, -38, LID.bottom], [57, 38, LID.top], { radius: 2 });
  polyline(
    lid,
    roundedRect(104, 66, 3).map(([x, y]) => [x, y, LID.top + LIFT]),
    { closed: true },
  );

  const seal = part("seal", "Checksum seal");
  {
    const [cx, cy] = [30, -16];
    const z = LID.top + 0.3;
    const h = 0.9;
    prism(seal, circleProfile(cx, cy, 9, 72), { at: z, depth: h });
    circle(seal, [cx, cy, z + h + LIFT], 7, [0, 0, 1], { segments: 72 });
    polyline(
      seal,
      [
        [cx - 3.4, cy + 0.2],
        [cx - 1, cy - 2.4],
        [cx + 3.8, cy + 2.6],
      ].map(([x, y]) => [x, y, z + h + LIFT]),
      { role: "edge" },
    );
  }

  const macos = part("macos", "macOS");
  {
    const [cx, cy, z] = [-36, -17.5, BASE];
    box(macos, [cx - 13, cy - 9, z], [cx + 13, cy + 7, z + 1.4], { radius: 1 });
    box(macos, [cx - 13, cy + 7.05, z], [cx + 13, cy + 8.45, z + 12], {
      radius: 0.6,
    });
    frontRect(macos, cy + 7.05, cx - 11.4, z + 2.4, cx + 11.4, z + 10.6);
    for (const y of [cy + 4.6, cy + 2.6, cy + 0.6])
      line(
        macos,
        [cx - 10, y, z + 1.4 + LIFT],
        [cx + 10, y, z + 1.4 + LIFT],
        "texture",
      );
    rect(macos, cx - 4, cy - 7.4, cx + 4, cy - 2.4, z + 1.4);
  }

  const cli = part("cli", "Command line");
  {
    const [cx, cy, z] = [0, -17.5, BASE];
    const t = z + 9;
    box(cli, [cx - 11, cy - 8, z], [cx + 11, cy + 8, t], { radius: 1.2 });
    front(
      cli,
      cy - 8,
      [
        [cx - 7, z + 6.6],
        [cx - 3, z + 4.6],
        [cx - 7, z + 2.6],
      ],
      { role: "edge" },
    );
    front(
      cli,
      cy - 8,
      [
        [cx - 1, z + 2.6],
        [cx + 5, z + 2.6],
      ],
      { role: "edge" },
    );
    line(cli, [cx - 9.5, cy + 5, t + LIFT], [cx + 9.5, cy + 5, t + LIFT]);
  }

  const packages = part("packages", "Package managers");
  {
    const [cx, cy, z] = [36, -17.5, BASE];
    const parcel = (x0, y0, x1, y1, h) => {
      box(packages, [x0, y0, z], [x1, y1, z + h]);
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2;
      line(packages, [x0, my, z + h + LIFT], [x1, my, z + h + LIFT]);
      line(packages, [mx, y0, z + h + LIFT], [mx, y1, z + h + LIFT]);
      front(packages, y0, [
        [mx, z],
        [mx, z + h],
      ]);
    };
    parcel(cx - 13, cy - 8, cx + 1, cy + 6, 9);
    parcel(cx + 3, cy - 7, cx + 13, cy + 3, 6.5);
  }

  const linux = part("linux", "Linux");
  {
    const [cx, cy, z] = [-36, 17.5, BASE];
    const y = cy - 9;
    box(linux, [cx - 13, y, z], [cx + 13, cy + 9, z + 8], { radius: 0.8 });
    front(linux, y, [
      [cx - 12.2, z + 4],
      [cx + 12.2, z + 4],
    ]);
    for (const base of [z + 1.1, z + 5.1]) {
      for (let x = cx - 11; x <= cx + 3; x += 1.75)
        front(
          linux,
          y,
          [
            [x, base],
            [x, base + 1.8],
          ],
          { role: "texture" },
        );
      for (const x of [cx + 9, cx + 11])
        circle(linux, [x, y - LIFT, base + 0.9], 0.7, [0, -1, 0]);
    }
  }

  const windows = part("windows", "Windows");
  {
    const [cx, cy, z] = [0, 17.5, BASE];
    box(windows, [cx - 6, cy - 3, z], [cx + 6, cy + 5, z + 0.8], { radius: 1 });
    box(windows, [cx - 1.5, cy + 0.85, z + 0.85], [cx + 1.5, cy + 2.4, z + 5]);
    box(windows, [cx - 13, cy - 0.8, z + 3.5], [cx + 13, cy + 0.8, z + 13], {
      radius: 0.6,
    });
    frontRect(windows, cy - 0.8, cx - 11.8, z + 5.6, cx + 11.8, z + 12);
    front(
      windows,
      cy - 0.8,
      [
        [cx - 11.8, z + 4.6],
        [cx + 11.8, z + 4.6],
      ],
      { role: "texture" },
    );
  }

  const android = part("android", "Android");
  {
    const [cx, cy, z] = [36, 17.5, BASE];
    const y = cy - 0.7;
    prism(android, roundedRect(14, 11, 1.2, [cx - 5.5, z + 5.5]), {
      plane: "xz",
      at: y,
      depth: 1.4,
    });
    prism(android, roundedRect(7, 13, 1.2, [cx + 6.5, z + 6.5]), {
      plane: "xz",
      at: y,
      depth: 1.4,
    });
    front(android, y, roundedRect(11.6, 8.6, 0.8, [cx - 5.5, z + 5.5]), {
      closed: true,
    });
    front(android, y, roundedRect(5, 10, 0.8, [cx + 6.5, z + 6.8]), {
      closed: true,
    });
    front(
      android,
      y,
      [
        [cx + 6.5, z + 9.6],
        [cx + 6.5, z + 4.4],
      ],
      { role: "edge" },
    );
    front(
      android,
      y,
      [
        [cx + 4.8, z + 6.1],
        [cx + 6.5, z + 4.4],
        [cx + 8.2, z + 6.1],
      ],
      { role: "edge" },
    );
  }

  return [
    lid,
    seal,
    macos,
    windows,
    linux,
    android,
    cli,
    packages,
    archive,
    archiveFront,
  ];
}

import { type CSSProperties, Fragment } from "react";
import { cn } from "@/lib/cn";

type Box = readonly [number, number, number, number];

export type Drawing = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly figure: { readonly width: number; readonly height: number };
  readonly labelX: number;
  readonly layers: readonly {
    readonly id: string;
    readonly name: string;
    readonly number: number;
    readonly label: boolean;
    readonly dy: number;
    readonly box: Box;
    readonly anchor: readonly number[];
    readonly parts: readonly {
      readonly id: string;
      readonly name: string;
      readonly box: Box;
    }[];
  }[];
  readonly paint: readonly string[];
  readonly trails: readonly {
    readonly above: string;
    readonly below: string;
    readonly x: number;
    readonly y: number;
    readonly length: number;
    readonly shift: number;
    readonly grow: number;
  }[];
  readonly sprite: string;
};

export type PartOf<D extends Drawing> =
  D["layers"][number]["parts"][number]["id"];

function units(drawing: Drawing) {
  const unit = 100 / drawing.figure.width;
  const n = (v: number) => Math.round(v * unit * 1000) / 1000;
  return { n, cqw: (v: number) => `${n(v)}cqw` };
}

const spriteId = (drawing: Drawing, part: string) => `td-${drawing.id}-${part}`;

function partsOf(drawing: Drawing) {
  return drawing.layers.flatMap((layer) =>
    layer.parts.map((part) => ({ ...part, layer: layer.number })),
  );
}

export function TeardownSprite({ drawing }: { drawing: Drawing }) {
  return (
    <svg
      aria-hidden
      focusable="false"
      width="0"
      height="0"
      className="absolute"
    >
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: generated at build time from tools/teardown, never from input */}
      <defs dangerouslySetInnerHTML={{ __html: drawing.sprite }} />
    </svg>
  );
}

export function TeardownFigure({
  drawing,
  className,
}: {
  drawing: Drawing;
  className?: string;
}) {
  const { n, cqw } = units(drawing);
  const { width, height } = drawing.figure;
  return (
    <figure
      data-teardown
      className={cn("td", className)}
      style={{ "--td-ratio": width / height } as CSSProperties}
    >
      <div className="td-canvas" role="img" aria-label={drawing.description}>
        {drawing.paint.map((id) => {
          const layer = drawing.layers.find((l) => l.id === id);
          if (!layer) return null;
          const [, top, , layerHeight] = layer.box;
          const [ax, ay] = layer.anchor;
          return (
            <Fragment key={layer.id}>
              <div
                className="td-layer"
                style={
                  {
                    top: cqw(top),
                    height: cqw(layerHeight),
                    "--dy": n(layer.dy),
                  } as CSSProperties
                }
              >
                {layer.parts.map((part) => {
                  const [x, y, w, h] = part.box;
                  return (
                    <svg
                      key={part.id}
                      aria-hidden
                      className="td-part"
                      data-part={part.id}
                      data-name={part.name}
                      viewBox={`${x} ${y} ${w} ${h}`}
                      style={{
                        left: cqw(x),
                        top: cqw(y - top),
                        width: cqw(w),
                        height: cqw(h),
                      }}
                    >
                      <use href={`#${spriteId(drawing, part.id)}`} />
                    </svg>
                  );
                })}
                {layer.label ? (
                  <span
                    className="td-label"
                    data-parts={layer.parts.map((part) => part.id).join(" ")}
                    style={
                      {
                        left: cqw(ax + 1),
                        top: cqw(ay - top),
                        "--lead": cqw(drawing.labelX - ax - 2.5),
                        "--name": cqw(width - drawing.labelX),
                      } as CSSProperties
                    }
                  >
                    <span className="td-lead" />
                    <span className="td-name">
                      <span className="td-no">{layer.number}</span>
                      {layer.name}
                    </span>
                  </span>
                ) : null}
              </div>
              {drawing.trails
                .filter((trail) => trail.below === layer.id)
                .map((trail) => (
                  <i
                    key={`${trail.above}-${trail.x}`}
                    className="td-trail"
                    style={
                      {
                        left: cqw(trail.x),
                        top: cqw(trail.y),
                        "--len": n(trail.length),
                        "--grow": n(trail.grow),
                        "--shift": n(trail.shift),
                      } as CSSProperties
                    }
                  />
                ))}
            </Fragment>
          );
        })}
      </div>
      <figcaption className="td-caption">
        <span>{drawing.title}</span>
        <span className="td-status" data-status aria-hidden />
      </figcaption>
    </figure>
  );
}

export function PartFigure<D extends Drawing>({
  drawing,
  parts,
  className,
}: {
  drawing: D;
  parts: PartOf<D>[];
  className?: string;
}) {
  const all = partsOf(drawing);
  const shown = all.filter((part) => parts.includes(part.id));
  const x0 = Math.min(...shown.map((p) => p.box[0]));
  const y0 = Math.min(...shown.map((p) => p.box[1]));
  const x1 = Math.max(...shown.map((p) => p.box[0] + p.box[2]));
  const y1 = Math.max(...shown.map((p) => p.box[1] + p.box[3]));

  return (
    <figure className={cn("td-thumb", className)}>
      <svg
        aria-hidden
        viewBox={`${x0} ${y0} ${x1 - x0} ${y1 - y0}`}
        style={{ aspectRatio: `${x1 - x0} / ${y1 - y0}` }}
      >
        {shown.map((part) => (
          <use key={part.id} href={`#${spriteId(drawing, part.id)}`} />
        ))}
      </svg>
      <figcaption>{figureRef(drawing, parts)}</figcaption>
    </figure>
  );
}

export function figureRef<D extends Drawing>(drawing: D, parts: PartOf<D>[]) {
  const all = partsOf(drawing);
  const shown = parts.flatMap((id) => all.filter((part) => part.id === id));
  const layers = [...new Set(shown.map((part) => part.layer))];
  return `Fig. 1.${layers.join("–")} — ${shown.map((part) => part.name).join(", ")}`;
}

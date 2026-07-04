import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Globe2,
  Server,
} from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";

type ApiStatus = "operational" | "degraded" | "unavailable";

type EndpointCheck = {
  label: string;
  url: string;
  status: ApiStatus;
  statusCode: number | null;
  responseMs: number | null;
  checkedAt: string;
  detail: string;
};

const apiUrl = "https://api.risuko.app/";

export const metadata: Metadata = {
  title: "Risuko API Status",
  description: "Current availability for the Risuko API.",
  alternates: { canonical: "/status" },
};

async function checkApiStatus(): Promise<EndpointCheck> {
  const checkedAt = new Date().toISOString();
  const startedAt = performance.now();

  try {
    const response = await fetch(apiUrl, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const responseMs = Math.round(performance.now() - startedAt);
    const contentType = response.headers.get("content-type") ?? "";
    const body = contentType.includes("application/json")
      ? ((await response.json()) as { status?: unknown })
      : null;
    const reportsOkStatus = body?.status === "ok";
    const status =
      response.ok && reportsOkStatus
        ? "operational"
        : response.ok
          ? "degraded"
          : "unavailable";

    return {
      label: "Settings sync API",
      url: apiUrl,
      status,
      statusCode: response.status,
      responseMs,
      checkedAt,
      detail: reportsOkStatus
        ? 'Response body reports {"status":"ok"}.'
        : "Response did not report the expected ok status.",
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The API check failed.";

    return {
      label: "Settings sync API",
      url: apiUrl,
      status: "unavailable",
      statusCode: null,
      responseMs: null,
      checkedAt,
      detail: message,
    };
  }
}

function formatCheckedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "long",
    timeZone: "UTC",
  }).format(new Date(value));
}

function statusLabel(status: ApiStatus) {
  if (status === "operational") return "Operational";
  if (status === "degraded") return "Degraded";
  return "Unavailable";
}

function statusClassName(status: ApiStatus) {
  if (status === "operational") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "degraded") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }

  return "border-red-500/30 bg-red-500/10 text-red-300";
}

function StatusIcon({ status }: { status: ApiStatus }) {
  if (status === "operational") {
    return <CheckCircle2 className="size-5" aria-hidden="true" />;
  }

  if (status === "degraded") {
    return <AlertTriangle className="size-5" aria-hidden="true" />;
  }

  return <AlertTriangle className="size-5" aria-hidden="true" />;
}

function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card/40 p-5">
      <div className="mb-4 flex size-9 items-center justify-center rounded-md border border-border/40 bg-muted/30 text-muted-foreground">
        {icon}
      </div>
      <div className="text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export default async function StatusPage() {
  await connection();

  const endpoint = await checkApiStatus();
  const checkedAt = formatCheckedAt(endpoint.checkedAt);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border/30 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
                Risuko API status
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Current availability for the public Risuko API endpoint.
              </p>
            </div>

            <div
              className={`rounded-lg border p-5 ${statusClassName(endpoint.status)}`}
            >
              <div className="flex items-center gap-3">
                <StatusIcon status={endpoint.status} />
                <div>
                  <div className="text-sm font-medium">Current status</div>
                  <div className="text-2xl font-semibold tracking-tight">
                    {statusLabel(endpoint.status)}
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs opacity-80">
                Last checked {checkedAt}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2">
          <MetricCard
            label="HTTP status"
            value={endpoint.statusCode?.toString() ?? "No response"}
            icon={<Server className="size-4" aria-hidden="true" />}
          />
          <MetricCard
            label="Response time"
            value={
              endpoint.responseMs === null
                ? "Unavailable"
                : `${endpoint.responseMs} ms`
            }
            icon={<Clock3 className="size-4" aria-hidden="true" />}
          />
        </div>
      </section>

      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg border border-border/40 bg-card/30">
            <div className="flex items-center justify-between gap-4 border-b border-border/30 px-5 py-4">
              <div>
                <h2 className="font-semibold tracking-tight">
                  Endpoint monitor
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Live request against the public API
                </p>
              </div>
              <Globe2
                className="size-5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>

            <div className="p-5">
              <div className="grid gap-4 rounded-lg border border-border/30 bg-background/40 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div>
                  <div className="font-medium">{endpoint.label}</div>
                  <a
                    href={endpoint.url}
                    className="mt-1 block break-all font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {endpoint.url}
                  </a>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {endpoint.detail}
                  </p>
                </div>

                <div
                  className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${statusClassName(endpoint.status)}`}
                >
                  <StatusIcon status={endpoint.status} />
                  {statusLabel(endpoint.status)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

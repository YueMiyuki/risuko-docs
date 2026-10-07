const button =
  "inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full px-6 font-semibold transition-[transform,background-color,border-color,box-shadow] duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export const buttonPrimary = `${button} bg-primary text-primary-foreground shadow-[0_12px_28px_-14px_color-mix(in_oklch,var(--primary)_80%,transparent)] hover:shadow-[0_16px_32px_-14px_color-mix(in_oklch,var(--primary)_90%,transparent)]`;

export const buttonSecondary = `${button} border border-border bg-card text-foreground hover:border-primary/40`;

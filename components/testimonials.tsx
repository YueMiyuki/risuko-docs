"use client";

const testimonials = [
  {
    quote:
      "Switched our CI/CD pipeline to Pikari. Build times dropped by 40% and zero corrupted downloads since.",
    author: "Sarah Chen",
    role: "DevOps Lead at Nexus Labs",
  },
  {
    quote:
      "The multi-threaded downloads are a game changer. I download 50GB+ datasets and Pikari maxes out my connection every time.",
    author: "Marcus Johnson",
    role: "ML Engineer",
  },
  {
    quote:
      "Finally, a download manager that doesn't leak memory. Running for weeks on our file servers with zero issues.",
    author: "Alex Rivera",
    role: "Systems Administrator",
  },
  {
    quote:
      "The plugin system is incredibly well designed. I wrote a custom extractor in about 200 lines of Rust.",
    author: "Yuki Tanaka",
    role: "Senior Software Engineer",
  },
];

function TestimonialCard({ quote, author, role }: (typeof testimonials)[0]) {
  return (
    <div className="flex-shrink-0 w-[300px] p-5 rounded-lg border border-border/30 bg-card/20">
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{`"${quote}"`}</p>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-xs font-medium">
          {author
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <div className="text-sm font-medium">{author}</div>
          <div className="text-xs text-muted-foreground">{role}</div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const items = [...testimonials, ...testimonials];

  return (
    <section className="py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 mb-10">
        <h2 className="text-center text-xl font-semibold text-muted-foreground">
          A framework developers love.
        </h2>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex gap-4 animate-marquee">
          {items.map((t, i) => (
            <TestimonialCard key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}

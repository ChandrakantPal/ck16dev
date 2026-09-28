import type { Signal } from "@/lib/signals";

/** One live source. Optional fields are simply absent rather than blank. */
const SignalCard = ({ signal }: { signal: Signal }) => (
  <section className="border-t border-subtle pt-6">
    <h2 className="text-lg text-accent md:text-xl">./{signal.label}</h2>
    <ul className="mt-4 space-y-4">
      {signal.items.map((item, index) => (
        <li key={`${item.title}-${index}`} className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            {item.url ? (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-strong underline-offset-4 hover:text-accent hover:underline"
              >
                {item.title}
              </a>
            ) : (
              <span className="text-strong">{item.title}</span>
            )}
            {item.detail && (
              <span className="text-sm text-accent-dim">{item.detail}</span>
            )}
          </div>
          {item.subtitle && (
            <span className="text-sm text-muted">{item.subtitle}</span>
          )}
          {item.timestamp && <SignalTime timestamp={item.timestamp} />}
        </li>
      ))}
    </ul>
  </section>
);

/*
 * Rendered on the server, so it must not depend on the visitor's clock — a
 * relative "3 days ago" would be baked in at build time and then rot.
 */
const SignalTime = ({ timestamp }: { timestamp: string }) => {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return (
    <time dateTime={date.toISOString()} className="text-xs text-muted">
      {date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })}
    </time>
  );
};

export default SignalCard;

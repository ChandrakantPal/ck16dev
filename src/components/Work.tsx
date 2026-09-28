import Link from "next/link";
import { getWorkEntries } from "@/lib/work";
import Reveal from "./Reveal";
import SectionHeader from "./SectionHeader";

/**
 * Renders nothing until a case study exists in content/work — an empty "work"
 * heading reads worse than no heading at all. Adding the first entry also means
 * adding `{ title: "work", href: "#work" }` to src/config/nav.ts.
 */
const Work = () => {
  const entries = getWorkEntries();

  if (entries.length === 0) {
    return null;
  }

  return (
    <section id="work" className="w-full mb-24 md:mb-36">
      <SectionHeader title="work" />
      <div className="px-10 my-10 space-y-10 md:space-y-16">
        {entries.map(({ slug, title, summary, stack, year }) => (
          <Reveal key={slug} direction="right">
            <article>
              <Link
                href={`/work/${slug}`}
                className="text-xl text-strong underline-offset-4 hover:text-accent hover:underline md:text-2xl"
              >
                {title}
              </Link>
              <p className="mt-2 text-muted md:text-lg">{summary}</p>
              <p className="mt-3 text-sm text-accent-dim md:text-base">
                {[String(year), ...stack].join(" · ")}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default Work;

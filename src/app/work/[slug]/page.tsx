import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { WorkEntry } from "@/config/work";
import { findWorkEntry, getWorkEntries } from "@/lib/work";

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export const generateStaticParams = () =>
  getWorkEntries().map(({ slug }) => ({ slug }));

export const generateMetadata = async ({
  params,
}: CaseStudyPageProps): Promise<Metadata> => {
  const { slug } = await params;
  const entry = findWorkEntry(slug);

  if (!entry) {
    return {};
  }

  return {
    title: `${entry.title} — Chandrakant Pal`,
    description: entry.summary,
    alternates: { canonical: `/work/${entry.slug}` },
    openGraph: { type: "article", title: entry.title, description: entry.summary },
  };
};

const CaseStudyPage = async ({ params }: CaseStudyPageProps) => {
  const { slug } = await params;
  const entry = findWorkEntry(slug);

  if (!entry) {
    notFound();
  }

  const { default: CaseStudyBody } = await import(`@content/work/${slug}.mdx`);

  return (
    <main className="site-shell px-6 pt-32 pb-24 md:px-10">
      <Link
        href="/#work"
        className="text-sm text-accent hover:text-accent-strong md:text-base"
      >
        ../work
      </Link>
      <CaseStudyHeader entry={entry} />
      <article>
        <CaseStudyBody />
      </article>
    </main>
  );
};

const CaseStudyHeader = ({ entry }: { entry: WorkEntry }) => (
  <header className="mt-6 mb-12 border-b border-subtle pb-8">
    <h1 className="text-3xl font-semibold text-strong md:text-5xl">
      {entry.title}
    </h1>
    <p className="mt-4 text-muted md:text-xl">{entry.summary}</p>
    <dl className="mt-8 grid grid-cols-2 gap-6 text-sm md:text-base">
      <CaseStudyFact label="role" value={entry.role} />
      <CaseStudyFact label="year" value={String(entry.year)} />
      {entry.stack.length > 0 && (
        <CaseStudyFact label="stack" value={entry.stack.join(" · ")} />
      )}
      {entry.metrics.map(({ label, value }) => (
        <CaseStudyFact key={label} label={label} value={value} />
      ))}
    </dl>
    {entry.links.length > 0 && (
      <ul className="mt-8 flex flex-wrap gap-6">
        {entry.links.map(({ label, url }) => (
          <li key={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-4 hover:text-accent-strong"
            >
              {label} ↗
            </a>
          </li>
        ))}
      </ul>
    )}
  </header>
);

const CaseStudyFact = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-accent-dim">{label}</dt>
    <dd className="mt-1 text-muted">{value}</dd>
  </div>
);

export default CaseStudyPage;

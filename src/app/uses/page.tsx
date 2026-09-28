import type { Metadata } from "next";
import Link from "next/link";
import { usesGroups } from "@/config/uses";

export const metadata: Metadata = {
  title: "Uses — Chandrakant Pal",
  description: "The tools I reach for, and why.",
  alternates: { canonical: "/uses" },
};

const UsesPage = () => (
  <main className="site-shell px-6 pt-32 pb-24 md:px-10">
    <Link
      href="/"
      className="text-sm text-accent hover:text-accent-strong md:text-base"
    >
      ../home
    </Link>
    <h1 className="mt-6 text-3xl font-semibold text-strong md:text-5xl">
      uses
    </h1>
    <p className="mt-4 text-muted md:text-xl">The tools I reach for, and why.</p>

    <div className="mt-12 space-y-12">
      {usesGroups.map(({ title, items }) => (
        <section key={title} className="border-t border-subtle pt-6">
          <h2 className="text-lg text-accent md:text-xl">./{title}</h2>
          <dl className="mt-4 space-y-4">
            {items.map(({ name, note }) => (
              <div key={name}>
                <dt className="text-strong">{name}</dt>
                <dd className="mt-1 text-muted">{note}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  </main>
);

export default UsesPage;

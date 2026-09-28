import { notFound } from "next/navigation";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "@/app/_og/card";
import { findWorkEntry, getWorkEntries } from "@/lib/work";

export const alt = "Case study";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export const generateStaticParams = () =>
  getWorkEntries().map(({ slug }) => ({ slug }));

const CaseStudyOgImage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const entry = findWorkEntry(slug);

  if (!entry) {
    notFound();
  }

  return renderOgCard({
    eyebrow: "./work",
    title: entry.title,
    subtitle: entry.summary,
  });
};

export default CaseStudyOgImage;

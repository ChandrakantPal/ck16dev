import { site } from "@/config/site";

/**
 * JSON-LD `Person`, so a search engine can tell who this site is about rather
 * than inferring it from the copy.
 */
const StructuredData = () => {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    url: site.url,
    jobTitle: "Senior Software Engineer",
    description: site.description,
    sameAs: [site.github, site.linkedin],
  };

  return (
    <script
      type="application/ld+json"
      /*
       * The payload is a literal built above, never visitor input, so there is
       * nothing here to escape.
       */
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
};

export default StructuredData;

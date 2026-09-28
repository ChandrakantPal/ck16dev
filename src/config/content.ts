/**
 * What counts as published, for every MDX collection on the site. A leading
 * underscore marks an authoring template or a draft, never a live entry.
 */
export const isPublishableContentFile = (fileName: string): boolean =>
  fileName.endsWith(".mdx") && !fileName.startsWith("_");

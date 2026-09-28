import { OG_CONTENT_TYPE, OG_SIZE, renderOgCard } from "./_og/card";
import { site } from "@/config/site";

export const alt = site.title;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const HomeOgImage = () =>
  renderOgCard({
    eyebrow: "~",
    title: site.name,
    subtitle: "Senior software engineer. Interfaces, APIs, and the data underneath.",
  });

export default HomeOgImage;

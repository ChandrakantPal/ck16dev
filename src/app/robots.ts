import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: "*", allow: "/" },
  sitemap: absoluteUrl("/sitemap.xml"),
});

export default robots;

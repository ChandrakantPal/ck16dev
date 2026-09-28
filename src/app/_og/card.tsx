import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/*
 * Fonts are read from disk rather than fetched, so building an OG card never
 * depends on the network. Literal segments keep the path statically traceable,
 * the same constraint the content loaders work under.
 */
const readFont = (fileName: string): Buffer =>
  readFileSync(join(process.cwd(), "src", "app", "_og", fileName));

interface CardProps {
  /** The `./work`-style path shown above the title. */
  eyebrow: string;
  title: string;
  subtitle?: string;
}

/**
 * One card design for every route, so a shared link is recognisably this site:
 * bunker background, mono type, green prompt.
 */
export const renderOgCard = ({ eyebrow, title, subtitle }: CardProps) =>
  new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0d1117",
          padding: "72px",
          fontFamily: "Roboto Mono",
        }}
      >
        <div style={{ display: "flex", color: "#4ade80", fontSize: 32 }}>
          {eyebrow}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#e6edf3",
              fontSize: title.length > 48 ? 64 : 80,
              fontWeight: 600,
              lineHeight: 1.15,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                display: "flex",
                marginTop: 24,
                color: "#9ca3af",
                fontSize: 30,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#9ca3af",
            fontSize: 28,
          }}
        >
          <span style={{ color: "#16a34a" }}>ck16 ~ $</span>
          <span>{site.url.replace("https://", "")}</span>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        {
          name: "Roboto Mono",
          data: readFont("RobotoMono-Regular.ttf"),
          weight: 400,
          style: "normal",
        },
        {
          name: "Roboto Mono",
          data: readFont("RobotoMono-SemiBold.ttf"),
          weight: 600,
          style: "normal",
        },
      ],
    },
  );

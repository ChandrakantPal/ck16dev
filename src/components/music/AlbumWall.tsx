import Image from "next/image";
import type { AlbumSwatch } from "@/lib/spotify/music";
import { PRELOADED_COVERS } from "./eagerCovers";

/**
 * The covers themselves, most-played first — the page opens on the records
 * rather than on an abstraction of them.
 */
const AlbumWall = ({ albums }: { albums: AlbumSwatch[] }) => {
  const withCovers = albums.filter((album) => album.coverUrl).slice(0, 12);

  if (withCovers.length === 0) {
    return null;
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {withCovers.map((album, index) => (
        <li key={album.id}>
          <a
            href={album.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <div
              className="relative aspect-square overflow-hidden rounded"
              /* A thin wash of the cover's own colour behind it while it loads. */
              style={{ backgroundColor: album.colour ?? "transparent" }}
            >
              <Image
                src={album.coverUrl as string}
                alt=""
                fill
                sizes="(min-width: 768px) 15rem, 45vw"
                unoptimized
                /*
                 * Every album here is also in the crate above, so these are the
                 * same URLs already fetched — eager costs nothing extra, and it
                 * stops the LCP landing on a lazy tile when a tall viewport
                 * puts the second row above the fold.
                 */
                {...(index < PRELOADED_COVERS
                  ? { priority: true }
                  : { loading: "eager" as const })}
                className="object-cover transition-opacity group-hover:opacity-80"
              />
            </div>
            <p className="mt-2 truncate text-sm text-strong">{album.name}</p>
            <p className="truncate text-xs text-muted">{album.artist}</p>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default AlbumWall;

import type { AlbumSwatch, RankedTrack } from "@/lib/spotify/music";

/**
 * Every track in the all-time top 50, placed on the year it was released and
 * tinted with its own cover's colour.
 *
 * One mark per record rather than a bar per decade: the shape of the
 * distribution still reads, but so does each individual release, which a
 * histogram flattens away.
 */
const EraSpectrum = ({
  tracks,
  albums,
}: {
  tracks: RankedTrack[];
  albums: AlbumSwatch[];
}) => {
  const dated = tracks.filter(
    (track): track is RankedTrack & { releaseYear: number } =>
      track.releaseYear !== undefined,
  );

  if (dated.length < 3) {
    return null;
  }

  const colourByAlbum = new Map(
    albums.map((album) => [album.id, album.colour]),
  );
  const firstYear = Math.min(...dated.map((track) => track.releaseYear));
  const lastYear = Math.max(...dated.map((track) => track.releaseYear));

  const columns = [];
  for (let year = firstYear; year <= lastYear; year += 1) {
    columns.push({
      year,
      tracks: dated.filter((track) => track.releaseYear === year),
    });
  }

  const tallest = Math.max(...columns.map((column) => column.tracks.length));

  return (
    <figure className="mt-6">
      {/* Six decades will not fit a phone; the plot scrolls rather than squashing. */}
      <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
        <div className="min-w-[38rem]">
          <ol
            className="flex items-end gap-px"
            style={{ height: `${Math.max(tallest, 6) * 0.75}rem` }}
          >
            {columns.map(({ year, tracks: yearTracks }) => (
              <li
                key={year}
                className="flex flex-1 flex-col-reverse items-center gap-px"
              >
                {yearTracks.map((track) => (
                  <span
                    key={track.id}
                    title={`${track.title} — ${track.artist} (${year})`}
                    className="block h-2 w-full rounded-[2px] bg-accent"
                    style={{
                      backgroundColor:
                        colourByAlbum.get(track.albumId ?? "") ?? undefined,
                    }}
                  />
                ))}
              </li>
            ))}
          </ol>

          <div className="mt-3 flex items-end gap-px border-t border-subtle pt-2">
            {columns.map(({ year }) => (
              <span key={year} className="flex-1 text-center">
                {isDecadeStart(year) && (
                  <span className="text-xs text-muted tabular-nums">
                    {year}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <figcaption className="mt-4 text-muted">
        Every track I play most, by the year it came out.
      </figcaption>

      {/* The same distribution in words, for anyone not reading the plot. */}
      <p className="sr-only">
        {columns
          .filter((column) => column.tracks.length > 0)
          .map(({ year, tracks: yearTracks }) => `${year}: ${yearTracks.length}`)
          .join(", ")}
      </p>
    </figure>
  );
};

const isDecadeStart = (year: number): boolean => year % 10 === 0;

export default EraSpectrum;

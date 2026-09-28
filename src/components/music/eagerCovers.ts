/**
 * How many covers a gallery preloads, and how it treats the rest.
 *
 * `priority` does two things: it skips lazy-loading *and* emits a preload hint.
 * Preloading is worth it for the handful that decide the Largest Contentful
 * Paint; beyond those, the hints compete with each other and cost more than
 * they save. So a gallery preloads PRELOADED_COVERS and marks anything else it
 * can show above the fold merely eager — enough that the LCP never lands on a
 * lazy image, without twenty preloads racing.
 */
export const PRELOADED_COVERS = 4;

/**
 * The crate shows far more sleeves at once than the grid does — how many
 * depends on viewport width — so every real record is eager. The duplicate
 * half of the loop stays lazy.
 */
export const CRATE_EAGER_COVERS = 18;

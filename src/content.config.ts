import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Projects collection — drives the Projects listing tiles and links to each
 * case study. Add a future project by dropping a new .md file in
 * src/content/projects/ (no code changes needed for a listing entry).
 */
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    tags: z.array(z.string()),
    /** Sort order on the listing (ascending). */
    order: z.number().default(0),
    status: z.enum(["live", "coming-soon"]).default("live"),
    /** Where the tile links (case study route or external URL). */
    href: z.string().optional(),
    /** Tile artwork: a photo-pile, a single image, or a solid cover. */
    variant: z.enum(["pile", "image", "cover"]).default("cover"),
    /** Pile id when variant === "pile" (matches CSS in the listing page). */
    pile: z.enum(["ea", "cabrillo"]).optional(),
    /** Image path when variant === "image". */
    coverImage: z.string().optional(),
    /** How the image sits in the tile: "cover" fills it, "contain" centers it
     *  (e.g. a logo) on top of coverBg. */
    coverFit: z.enum(["cover", "contain"]).default("cover"),
    /** Solid cover colour + label when variant === "cover" (also the backdrop
     *  behind a "contain" image). */
    coverBg: z.string().optional(),
    coverFg: z.string().optional(),
    coverLabel: z.string().optional(),
  }),
});

export const collections = { projects };

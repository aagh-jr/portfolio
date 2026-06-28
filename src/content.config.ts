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
    /** Tile artwork: a bespoke photo-pile variant, or a solid cover. */
    variant: z.enum(["pile", "cover"]).default("cover"),
    /** Pile id when variant === "pile" (matches CSS in the listing page). */
    pile: z.enum(["ea", "cabrillo"]).optional(),
    /** Solid cover colour + label when variant === "cover". */
    coverBg: z.string().optional(),
    coverFg: z.string().optional(),
    coverLabel: z.string().optional(),
  }),
});

export const collections = { projects };

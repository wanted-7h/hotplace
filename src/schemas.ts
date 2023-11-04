import { z } from "zod";

export const BaseHeadersSchema = z.object({
  authorization: z.string(),
  user: z
    .object({
      userId: z.string(),
      lat: z.number(),
      lon: z.number(),
      isRecommendLunch: z.coerce.boolean(),
    })
    .optional(),
});

import { z } from "zod";

export const ReviewSchema = z.object({
  user_id: z.string(),
  restaurant_name: z.string(),
  grade: z.coerce.number(),
  detail: z.string().optional(),
});

export const ReviewBodySchema = z.object({
  grade: z.coerce.number(),
  detail: z.string().optional(),
});

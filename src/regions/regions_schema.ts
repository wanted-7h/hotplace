import { coordsSchema } from "../restaurants";
import { z } from "../zod_openapi";

export type RegionName = z.infer<typeof regionNameSchema>;
export const regionNameSchema = z.object({
  do_si: z.string().optional().openapi({ example: "서울" }),
  sgg: z.string().optional().openapi({ example: "강남구" }),
});

export type Region = z.infer<typeof regionSchema>;
export const regionSchema = regionNameSchema.and(coordsSchema);

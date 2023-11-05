import { z } from "../zod_openapi";

export const regionSchema = z.object({
  do_si: z.string().optional().openapi({ example: "서울" }),
  sgg: z.string().optional().openapi({ example: "강남구" }),
});

import { initContract } from "@ts-rest/core";
import { z } from "../zod_openapi";
import { regionNameSchema } from "./regions_schema";
import { regionSchema } from "./regions_schema";

const c = initContract();

export const regionsContract = c.router(
  {
    getMany: {
      method: "GET",
      path: "/",
      summary: "지역 목록을 조회합니다.",
      query: regionNameSchema,
      responses: {
        200: z.array(regionSchema),
      },
    },
  },
  { pathPrefix: "/regions" },
);

import { initContract } from "@ts-rest/core";
import { z } from "../zod_openapi";
import { coordsSchema } from "../restaurants";
import { regionSchema } from "./regions_schema";

const c = initContract();

export const regionsContract = c.router(
  {
    getMany: {
      method: "GET",
      path: "/",
      summary: "지역 목록을 조회합니다.",
      query: regionSchema,
      responses: {
        200: z.array(coordsSchema),
      },
    },
  },
  { pathPrefix: "/regions" },
);

import { initContract } from "@ts-rest/core";
import { z } from "../zod_openapi";
import { coordsSchema, degreeSchema } from "./coord_schema";

const c = initContract();

export const restaurantsContract = c.router(
  {
    // getManyByRegion: {},
    getMany: {
      method: "GET",
      path: "/",
      summary: "주어진 위치 근처의 음식점 목록을 조회합니다.",
      query: coordsSchema.extend({
        range: degreeSchema.openapi({ description: "범위 (km)", example: 5 }),
        sort: z
          .enum(["distance", "rating"])
          .default("distance")
          .describe("정렬 기준"),
      }),
      responses: {
        200: z.array(z.object({})),
      },
    },
    getOne: {
      method: "GET",
      path: "/:id",
      responses: {
        200: z.object({
          reviews: z.array(z.object({})),
        }),
      },
    },
  },
  { pathPrefix: "/restaurants" },
);

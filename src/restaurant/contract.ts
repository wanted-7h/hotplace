import { initContract } from "@ts-rest/core";
import { z } from "../zod_openapi";

const c = initContract();

export const degreeSchema = z.coerce.number();

export const coordsSchema = z.object({
  lat: degreeSchema
    .min(-90)
    .max(90)
    .openapi({ description: "위도", example: 37.5667 }),
  lon: degreeSchema
    .min(-180)
    .max(180)
    .openapi({ description: "경도", example: 126.9784 }),
});

export const restaurantsRouter = c.router(
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

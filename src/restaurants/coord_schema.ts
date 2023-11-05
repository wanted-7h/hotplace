import { z } from "../zod_openapi";

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

import { z } from "zod";

export const UserSchema = z.object({
  user_id: z.string(),
  password: z.string(),
  lat: z.number(),
  lon: z.number(),
  is_recommend_lunch: z.boolean(),
});

export const UserSettingSchema = z.object({
  user_id: z.string(),
  lat: z.number(),
  lon: z.number(),
  is_recommend_lunch: z.boolean(),
});

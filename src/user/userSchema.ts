import { z } from "zod";

export const UserSignupSchema = z.object({
  userId: z.string(),
  password: z.string(),
  lat: z.coerce.number().optional().default(0.0),
  lon: z.coerce.number().optional().default(0.0),
  isRecommendLunch: z.coerce.boolean().optional().default(false),
});

export const UserSettingSchema = z.object({
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
  isRecommendLunch: z.coerce.boolean().optional(),
});

export const UserSigninSchema = z.object({
  userId: z.string(),
  password: z.string(),
});

export const JwtSchema = UserSignupSchema.omit({ password: true });

export type UserInfo = z.infer<typeof JwtSchema>;

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userId: string;
    lat: number;
    lon: number;
    isRecommendLunch: boolean;
  }
}

export type UpdateCondition = {
  lat?: number;
  lon?: number;
  is_recommend_lunch?: boolean;
};

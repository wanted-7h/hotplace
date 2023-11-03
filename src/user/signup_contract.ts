import { initContract } from "@ts-rest/core";
import { z } from "zod";
export { signupRouter } from "./signup_router";

const contract = initContract();

const signupSchema = z.object({
  userId: z.string(),
  password: z.string(),
  lat: z.string(),
  lon: z.string(),
  isRecommendLunch: z.string(),
});

const UserSettingSchema = z.object({
  userId: z.string(),
  lat: z.string(),
  lon: z.string(),
  isRecommendLunch: z.string(),
});

const SigninSchema = z.object({
  userId: z.string(),
  password: z.string(),
});

export const signUpContract = contract.router({
  signup: {
    method: "POST",
    path: "/users",
    responses: {
      201: UserSettingSchema,
    },
    body: signupSchema,
    summary: "회원가입",
  },
  signin: {
    method: "POST",
    path: "/users/signin",
    responses: {
      200: z.object({
        msg: z.string(),
      }),
    },
    body: z.object({
      userId: z.string(),
      password: z.string(),
    }),
    summary: "회원가입",
  },
});

import { initContract } from "@ts-rest/core";
import { z } from "zod";
export { signupRouter } from "./signup_router";

const contract = initContract();

const signupSchema = z.object({
  userId: z.string(),
  password: z.string(),
  lat: z.coerce.number().optional().default(0.0),
  lon: z.coerce.number().optional().default(0.0),
  isRecommendLunch: z.coerce.boolean().optional().default(false),
});

const UserSettingSchema = z.object({
  userId: z.string(),
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
  isRecommendLunch: z.boolean().optional(),
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
        message: z.string(),
      }),
    },
    body: z.object({
      userId: z.string(),
      password: z.string(),
    }),
    summary: "로그인",
  },

  // getUserInfo: {
  //   method: "GET",
  //   path: "/users",
  //   responses: {
  //     200: UserSettingSchema,
  //   },
  //   summary: "유저 정보 불러오기",
  // },

  // updateUserInfo: {
  //   method: "PUT",
  //   path: "/users",
  //   responses: {
  //     200: z.object({
  //       message: z.string(),
  //     }),
  //   },
  //   body: UserSettingSchema,
  //   summary: "유저 정보 업데이트",
  // },
});

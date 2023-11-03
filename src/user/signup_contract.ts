import { initContract } from "@ts-rest/core";
import { z } from "zod";
import {
  UserSigninSchema,
  UserSettingSchema,
  UserSignupSchema,
} from "./userSchema";
export { signupRouter } from "./signup_router";

const contract = initContract();

export const signUpContract = contract.router({
  signup: {
    method: "POST",
    path: "/users",
    responses: {
      201: z.object({
        message: z.string(),
      }),
    },
    body: UserSignupSchema,
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
    body: UserSigninSchema,
    summary: "로그인",
  },

  getUserInfo: {
    method: "GET",
    path: "/users",
    responses: {
      200: UserSettingSchema,
    },
    summary: "유저 정보 불러오기",
  },

  updateUserInfo: {
    method: "PUT",
    path: "/users",
    responses: {
      200: z.object({
        message: z.string(),
      }),
    },
    body: UserSettingSchema,
    summary: "유저 정보 업데이트",
  },
});

import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { UserSigninSchema, UserSignupSchema } from "../userSchema";

const contract = initContract();

export const signupContract = contract.router({
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
    path: "/users/login",
    responses: {
      200: z.object({
        accessToken: z.string(),
        refreshToken: z.string(),
      }),
    },
    body: UserSigninSchema,
    summary: "로그인",
  },
});

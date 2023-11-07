import { initContract } from "@ts-rest/core";
import { z } from "zod";
export { authRouter } from "./auth_router";

const contract = initContract();

export const authContract = contract.router(
  {
    reissueAccessToken: {
      method: "GET",
      path: "/auth",
      responses: {
        200: z.object({
          accessToken: z.string(),
        }),
      },
      summary: "엑세스 토큰 재발급",
    },

    reissueRefreshToken: {
      method: "GET",
      path: "/auth/refresh",
      responses: {
        200: z.object({
          refreshToken: z.string(),
        }),
      },
      summary: "리프래시 토큰 재발급",
    },
  },
  {
    baseHeaders: z.object({
      authorization: z.string(),
      refresh: z.string(),
    }),
  },
);

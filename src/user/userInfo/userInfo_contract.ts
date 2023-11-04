import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { UserSettingSchema } from "../userSchema";
import { BaseHeadersSchema } from "../../schemas";

const contract = initContract();

export const userInfoContract = contract.router(
  {
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
  },
  {
    baseHeaders: BaseHeadersSchema,
  },
);

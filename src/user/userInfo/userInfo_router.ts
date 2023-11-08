import { initServer } from "@ts-rest/express";
import db from "../../db/models/index";
import { userInfoContract } from "./userInfo_contract";
import { createAccessToken } from "../authorization/jwtUtils";
import { UpdateCondition } from "../userSchema";

const s = initServer();

export const userInfoRouter = s.router(userInfoContract, {
  //------------------------------------------------------------------------//
  getUserInfo: {
    handler: async ({ headers }) => {
      const { userId: _userId, ...userInfo } = headers.user;
      return {
        status: 200,
        body: userInfo,
      };
    },
  },
  //------------------------------------------------------------------------//
  updateUserInfo: {
    handler: async ({ headers, body }) => {
      let user = headers.user;
      let updateCondition: UpdateCondition = {};

      //요청 내용만 변경하기 위한 updateCondition
      if (body.isRecommendLunch != undefined) {
        updateCondition.is_recommend_lunch = body.isRecommendLunch;
      }

      const { isRecommendLunch: _isRecommendLunch, ...latlon } = body;
      updateCondition = { ...updateCondition, ...latlon };
      console.log(updateCondition);

      if (Object.keys(updateCondition).length === 0)
        return {
          status: 400,
          body: { error: "잘못된 요청, 업데이트 정보 없음" },
        };

      try {
        await db.User.update(updateCondition, {
          where: { user_id: user.userId },
        });

        const tokenInfo = { ...user, ...body };
        const newAccessToken = createAccessToken(tokenInfo);

        return { status: 200, body: { accessToken: newAccessToken } };
      } catch {
        return { status: 404, body: { error: "유저정보 변경 실패" } };
      }
    },
  },
});

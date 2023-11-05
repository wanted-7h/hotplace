import { initServer } from "@ts-rest/express";
import db from "../../db/models/index";
import { userInfoContract } from "./userInfo_contract";

const s = initServer();

type UpdateCondition = {
  lat?: number;
  lon?: number;
  is_recommend_lunch?: boolean;
};

export const userInfoRouter = s.router(userInfoContract, {
  //------------------------------------------------------------------------//
  getUserInfo: {
    handler: async ({ headers }) => {
      //유효성 검사덕에 header.user가 보장됨
      const user = headers.user;

      return {
        status: 200,
        body: {
          lat: user?.lat,
          lon: user?.lon,
          isRecommendLunch: user?.isRecommendLunch,
        },
      };
    },
  },
  //------------------------------------------------------------------------//
  updateUserInfo: {
    handler: async ({ headers, body }) => {
      //업데이트 후 바뀐 유저정보 고민 필요
      const user = headers.user;

      let updateCondition: UpdateCondition = {};

      if (body.isRecommendLunch)
        updateCondition.is_recommend_lunch = body.isRecommendLunch;

      if (body.lat && body.lon) {
        updateCondition.lat = body.lat;
        updateCondition.lon = body.lon;
      }

      if (updateCondition) {
        const updateResult = await db.User.update(updateCondition, {
          where: { user_id: user?.userId },
        });
        if (updateResult[0])
          return {
            status: 200,
            body: { message: "성공" },
          };
        return {
          status: 400,
          body: { error: "변경사항 없음" },
        };
      }
      return {
        status: 404,
        body: { error: "업데이트 정보 없음" },
      };
    },
  },
});

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
      //headers.user는 미들웨어를 통과하면 보장되는데, 타입 이슈때문에 if header.user를 걸어놓음.
      //리펙토링 필요
      if (headers.user) {
        let user = headers.user;

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
          if (updateResult[0]) {
            const tokenInfo = {
              userId: user?.userId,
              lat: body.lat ? body.lat : user?.lat,
              lon: body.lon ? body.lon : user?.lon,
              isRecommendLunch: body.isRecommendLunch
                ? body.isRecommendLunch
                : user?.isRecommendLunch,
            };
            const newAccessToken = createAccessToken(tokenInfo);
            return {
              status: 200,
              body: { accessToken: newAccessToken },
            };
          }
          return {
            status: 400,
            body: { error: "변경사항 없음" },
          };
        }
        return {
          status: 400,
          body: { error: "잘못된 요청, 업데이트 정보 없음" },
        };
      }
      return {
        status: 401,
        body: { error: "잘못된 접근, 토큰 없음" },
      };
    },
  },
});

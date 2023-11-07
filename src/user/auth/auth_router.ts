import { initServer } from "@ts-rest/express";
import { authContract } from "./auth_contract";
import {
  UserInfo,
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyToken,
} from "../authorization/jwtUtils";
import jwt from "jsonwebtoken";
import redisClient from "../../redis";

const s = initServer();

export const authRouter = s.router(authContract, {
  reissueAccessToken: async ({ headers }) => {
    const verify = verifyToken(headers.authorization);
    if (verify.validation)
      return {
        status: 400,
        body: { error: "잘못된 요청, 토큰이 아직 유효함" },
      };

    const decoded = jwt.decode(headers.authorization);
    const tokenInfo: UserInfo | undefined =
      decoded && typeof decoded === "object"
        ? {
            userId: decoded.userId,
            lat: decoded.lat,
            lon: decoded.lon,
            isRecommendLunch: decoded.isRecommendLunch,
          }
        : undefined;

    if (tokenInfo) {
      const isValidRefreshToken = await verifyRefreshToken(
        headers.refresh,
        tokenInfo.userId,
      );

      if (isValidRefreshToken) {
        const newAccessToken = createAccessToken(tokenInfo);
        return {
          status: 200,
          body: { accessToken: newAccessToken },
        };
      }

      return {
        status: 401,
        body: { error: "잘못된 접근, 유효하지 않은 리프레시 토큰" },
      };
    }

    return {
      status: 400,
      body: { error: "잘못된 요청, 토큰 정보가 유효하지 않음" },
    };
  },

  reissueRefreshToken: async ({ headers }) => {
    const decoded = jwt.decode(headers.refresh);
    const tokenOwner =
      decoded && typeof decoded === "object" ? decoded.userId : undefined;

    if (tokenOwner) {
      const refreshTokenKey = `refreshToken_${tokenOwner}`;
      const preRefreshToken = await redisClient.get(refreshTokenKey);

      if (preRefreshToken) {
        return {
          status: 400,
          body: { error: "잘못된 요청, 리프래시 토큰이 아직 유효함" },
        };
      }

      const newRefreshToken = createRefreshToken(tokenOwner);

      return {
        status: 200,
        body: { refreshToken: newRefreshToken },
      };
    }

    return {
      status: 400,
      body: { error: "잘못된 요청, 토큰 정보가 유효하지 않음" },
    };
  },
});

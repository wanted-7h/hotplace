import { initServer } from "@ts-rest/express";
import { authContract } from "./auth_contract";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
  verifyToken,
} from "../authorization/jwtUtils";
import jwt from "jsonwebtoken";

const s = initServer();

export const authRouter = s.router(authContract, {
  /**액세스 토큰 재발급,
   * 만료된 엑세스토큰과 만료되지 않은 리프래시 토큰으로 요청*/
  reissueAccessToken: async ({ headers }) => {
    const verify = verifyToken(headers.authorization);

    if (verify.validation)
      return {
        status: 400,
        body: { error: "잘못된 요청, 토큰이 아직 유효함" },
      };

    const decoded = jwt.decode(headers.authorization);

    //토큰 타입이 jwt.JwtPayload가 아닐 시, 유효하지 않음
    const tokenPayload =
      decoded && typeof decoded != "string" ? decoded : false;

    if (!tokenPayload) {
      return {
        status: 401,
        body: { error: "잘못된 접근, 유효하지 않은 엑세스 토큰" },
      };
    }

    const isValidRefreshToken = await verifyRefreshToken(
      headers.refresh,
      tokenPayload.userId,
    );

    if (!isValidRefreshToken) {
      return {
        status: 401,
        body: { error: "잘못된 접근, 유효하지 않은 리프레시 토큰" },
      };
    }

    const newAccessToken = createAccessToken(tokenPayload);
    return { status: 200, body: { accessToken: newAccessToken } };
  },

  /**리프래쉬 토큰 재발급,
   * 만료되기 전의 refreshToken과 만료되거나 안된 accessToken을 요청*/
  reissueRefreshToken: async ({ headers }) => {
    const decoded = jwt.decode(headers.authorization);
    const userPayload = decoded && typeof decoded != "string" ? decoded : false;

    if (!userPayload) {
      return { status: 401, body: { error: "올바르지 않은 토큰 요청" } };
    }

    const isValidRefesh = await verifyRefreshToken(
      headers.refresh,
      userPayload.userId,
    );

    if (!isValidRefesh) {
      return {
        status: 401,
        body: { error: "리프래쉬 토큰 유효하지 않음, 재로그인 요망" },
      };
    }

    const newRefreshToken = createRefreshToken(userPayload.userId);
    return { status: 200, body: { refreshToken: newRefreshToken } };
  },
});

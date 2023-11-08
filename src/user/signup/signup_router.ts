import { initServer } from "@ts-rest/express";
import { signupContract } from "./signup_contract";
import db from "../../db/models/index";
import { hash, genSalt, compare } from "bcrypt";
import {
  createAccessToken,
  createRefreshToken,
} from "../authorization/jwtUtils";
import { env } from "../../env.ts";

const s = initServer();

export const signupRouter = s.router(signupContract, {
  signup: async ({ body }) => {
    const isDuplication = await db.User.findOne({
      attributes: ["user_id"],
      where: { user_id: body.userId },
      raw: true,
    });

    if (isDuplication)
      return {
        status: 400,
        body: { error: "중복된 아이디" },
      };

    const password = await hashing(body.password);

    const signupInfo = {
      user_id: body.userId,
      password: password,
      lat: body.lat,
      lon: body.lat,
      is_recommend_lunch: body.isRecommendLunch,
    };

    const insertValue = await db.User.create(signupInfo);

    return {
      status: 201,
      body: {
        message: `${insertValue.dataValues.user_id}님의 회원가입 성공`,
      },
    };
  },
  //------------------------------------------------------------------------//
  signin: async ({ body }) => {
    const user = await db.User.findOne({
      where: { user_id: body.userId },
      raw: true,
    });

    if (!user)
      return {
        status: 404,
        body: { error: "해당 아이디가 없음" },
      };

    const result = await compare(body.password, user.password);

    if (result) {
      const userInfo = {
        userId: user.user_id,
        lat: user.lat,
        lon: user.lon,
        isRecommendLunch: user.is_recommend_lunch,
      };

      const accessToken = createAccessToken(userInfo);
      const refreshToken = createRefreshToken(userInfo.userId);

      return {
        status: 200,
        body: {
          accessToken: accessToken,
          refreshToken: refreshToken,
        },
      };
    } else {
      return {
        status: 400,
        body: { error: "비밀번호가 맞지 않음" },
      };
    }
  },
});

const hashing = async (password: string) => {
  const salt = await genSalt(env.JWT_SALT_ROUNDS);
  return hash(password, salt);
};

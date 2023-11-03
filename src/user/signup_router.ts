import { initServer } from "@ts-rest/express";
import { signUpContract } from "./signup_contract";
import db from "../db/models/index";
import { hash, genSalt, compare } from "bcrypt";

const s = initServer();
export const signupRouter = s.router(signUpContract, {
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
        userId: insertValue.dataValues.user_id,
        lat: insertValue.dataValues.lat,
        lon: insertValue.dataValues.lon,
        isRecommendLunch: insertValue.dataValues.is_recommend_lunch,
      },
    };
  },

  signin: async ({ body }) => {
    const userPassword = await db.User.findOne({
      attributes: ["password"],
      where: { user_id: body.userId },
      raw: true,
    });

    if (!userPassword)
      return {
        status: 404,
        body: { error: "해당 아이디가 없음" },
      };

    const result = userPassword?.password
      ? await compare(body.password, userPassword.password)
      : false;

    if (result) {
      //todo jwt 생성, 적용
      return {
        status: 200,
        body: { message: "로그인 성공" },
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
  //saltnum env관리
  const salt = await genSalt(10);
  return hash(password, salt);
};

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
    if (!isDuplication)
      return {
        status: 400,
        body: { error: "중복된 아이디" },
      };
    const password = await hashing(body.password);

    const signupInfo = {
      user_id: body.userId,
      password: password,
      lat: parseFloat(body.lat),
      lon: parseFloat(body.lon),
      is_recommend_lunch: body.isRecommendLunch === "true" ? true : false,
    };

    const insertUser = await db.User.create(signupInfo);
    console.log("userinsert", insertUser.dataValues);

    return {
      status: 201,
      body: body,
    };
  },
  signin: async ({ body }) => {
    const userPassword = await db.User.findOne({
      attributes: ["password"],
      where: { user_id: body.userId },
      raw: true,
    });
    const result = userPassword?.password
      ? await compare(body.password, userPassword.password)
      : false;

    if (result) {
      return {
        status: 200,
        body: { msg: "ss" },
      };
    } else {
      return {
        status: 404,
        body: { error: "N F" },
      };
    }
  },
});

const hashing = async (password: string) => {
  //saltnum env관리
  const salt = await genSalt(10);
  return hash(password, salt);
};

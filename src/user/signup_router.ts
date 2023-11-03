import { initServer } from "@ts-rest/express";
import { signUpContract } from "./signup_contract";
import db from "../db/models/index";
import { hash, genSalt, compare } from "bcrypt";

const s = initServer();

export const signupRouter = s.router(signUpContract, {
  signup: async ({ body }) => {
    //todo jwt 발급
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

  getUserInfo: async () => {
    //todo jwt 적용 후, 헤더 정보 보내주면 됨 (db get 할 필요가 없음)
    //임시생성
    return {
      status: 200,
      body: {
        lat: 0.2,
        lon: 0.2,
        isRecommendLunch: true,
      },
    };
  },

  updateUserInfo: async ({ body }) => {
    //jwt 적용 후 userid 적용
    let updateCondition: UpdateCondition = {};

    if (body.isRecommendLunch)
      updateCondition.is_recommend_lunch = body.isRecommendLunch;

    if (body.lat && body.lon) {
      updateCondition.lat = body.lat;
      updateCondition.lon = body.lon;
    }

    if (updateCondition) {
      const updateResult = await db.User.update(updateCondition, {
        where: { user_id: "test" },
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
});

type UpdateCondition = {
  lat?: number;
  lon?: number;
  is_recommend_lunch?: boolean;
};

const hashing = async (password: string) => {
  //todo saltnum env관리
  const salt = await genSalt(1);
  return hash(password, salt);
};

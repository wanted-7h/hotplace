import jwt from "jsonwebtoken";
import { UserInfo } from "../userSchema";
import redisClient from "../../redis";
import { env } from "../../env.ts";

export const createAccessToken = ({
  exp: _exp,
  ...user
}: UserInfo & { exp?: number }) =>
  jwt.sign(user, env.JWT_SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: env.ACCESS_TOKEN_EXPIRE,
  });

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET_KEY);
    return {
      validation: true,
      payload: decoded,
    };
  } catch {
    return { validation: false };
  }
};

const toRefreshId = <const T extends string>(userId: T) =>
  `refreshToken_${userId}`;

export const createRefreshToken = (userId: string) => {
  const newRefreshToken = jwt.sign({}, env.JWT_SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: env.REFRESH_TOKEN_EXPIRE_SECOND,
  });
  redisClient.set(toRefreshId(userId), newRefreshToken, {
    EX: env.REFRESH_TOKEN_EXPIRE_BY_NUMBER,
  });

  return newRefreshToken;
};

export const verifyRefreshToken = async (
  refreshToken: string,
  userId: string,
) => {
  const userRt = await redisClient.get(toRefreshId(userId));
  if (userRt === refreshToken) {
    const decoded = verifyToken(refreshToken);
    return decoded.validation;
  }
  return false;
};

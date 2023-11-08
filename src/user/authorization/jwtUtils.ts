import jwt from "jsonwebtoken";
import { UserInfo } from "../userSchema";
import redisClient from "../../redis";

const SECRET_KEY = process.env.JWT_SECRECT_KEY || ("secret" as string);
const AT_EXPIRED = process.env.AT_EXPIRE || ("1m" as string);
const RT_EXPIRED = process.env.RT_EXPIRE || ("3m" as string);
const RT_EXPIRED_BY_NUMBER =
  60 * 60 * 24 * Number(process.env.RT_EXPIRED_BY_NUMBER || 1);

export const createAccessToken = ({
  exp: _exp,
  ...user
}: UserInfo & { exp?: number }) =>
  jwt.sign(user, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: AT_EXPIRED,
  });

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return {
      validation: true,
      payload: decoded,
    };
  } catch {
    return { validation: false };
  }
};

export const createRefreshToken = (userId: string) => {
  const newRefreshToken = jwt.sign({}, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: RT_EXPIRED,
  });
  const refreshTokenKey = `refreshToken_${userId}`;
  redisClient.set(refreshTokenKey, newRefreshToken, {
    EX: RT_EXPIRED_BY_NUMBER,
  });

  return newRefreshToken;
};

export const verifyRefreshToken = async (
  refreshToken: string,
  userId: string,
) => {
  const refreshTokenKey = `refreshToken_${userId}`;
  const userRt = await redisClient.get(refreshTokenKey);
  if (userRt === refreshToken) {
    const decoded = verifyToken(refreshToken);
    return decoded.validation;
  }
  return false;
};

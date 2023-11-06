import jwt from "jsonwebtoken";
import { z } from "zod";
import { JwtSchema } from "../userSchema";

type UserInfo = z.infer<typeof JwtSchema>;

const SECRET_KEY = process.env.JWT_SECRECT_KEY || ("secret" as string);
const AT_EXPIRED = process.env.AT_EXPIRE || ("1m" as string);
const RT_EXPIRED = process.env.RT_EXPIRE || ("3d" as string);

export const createAccessToken = (user: UserInfo) =>
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
  } catch (err: any) {
    //err.message : "jwt expired", "jwt malformed", "Unexpected token ... "...
    throw new Error(err.message);
  }
};

export const createRefreshToken = (userId: string) =>
  jwt.sign({ userId: userId }, SECRET_KEY, {
    algorithm: "HS256",
    expiresIn: RT_EXPIRED,
  });

export const verifyRefreshToken = (refreshToken: string, userId: string) => {
  //db에서 userId에 맞는 rt를 꺼내온다.
  const userRt = "123";
  if (userRt === refreshToken) {
    const decoded = verifyToken(refreshToken);
    if (decoded.validation) return true;
    return false;
  }
  return false;
};

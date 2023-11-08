import { NextFunction } from "express";
import { verifyToken } from "./jwtUtils";

//todo insert type
const jwtAuthorization = (req: any, res: any, next: NextFunction) => {
  const accessToken = req.headers.authorization;

  if (accessToken) {
    const verifiedToken = verifyToken(accessToken);
    if (verifiedToken.validation) {
      req.headers.user = verifiedToken.payload;
      return next();
    }
    return res.status(401).json({ error: "유효하지 않은 토큰" });
  }
  return res.status(401).json({ error: "토큰 없음" });
};

export const jwtMiddleware = { globalMiddleware: [jwtAuthorization] };

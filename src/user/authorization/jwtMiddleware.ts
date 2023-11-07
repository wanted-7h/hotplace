import { NextFunction } from "express";
import { verifyToken } from "./jwtUtils";

//todo insert type
const jwtAuthorization = (req: any, res: any, next: NextFunction) => {
  const accessToken = req.headers.authorization;
  if (accessToken) {
    try {
      const verifiedToken = verifyToken(accessToken);
      if (verifiedToken.validation) {
        req.headers.user = verifiedToken.payload;

        return next();
      } else return res.status(401).json({ error: "유효하지 않은 토큰" });
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  } else return res.status(401).json({ error: "토큰 없음" });
};

export const jwtMiddleware = { globalMiddleware: [jwtAuthorization] };

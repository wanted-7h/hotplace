import { initContract } from "@ts-rest/core";
import { signupContract } from "./signup/signup_contract";
import { userInfoContract } from "./userInfo/userInfo_contract";

import { signupRouter } from "./signup/signup_contract";
import { userInfoRouter } from "./userInfo/userInfo_router";

const c = initContract();

export const userContract = c.router({
  signup: signupContract,
  userInfo: userInfoContract,
});

export const userRouter = {
  signup: signupRouter,
  userInfo: userInfoRouter,
};

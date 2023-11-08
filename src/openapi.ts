import { initContract } from "@ts-rest/core";
import { generateOpenApi } from "@ts-rest/open-api";
import { reviewContract } from "./review/review_contract";
import { restaurantsContract } from "./restaurants";
import { signupContract } from "./user/signup/signup_contract";
import { userInfoContract } from "./user/userInfo/userInfo_contract";
import { regionsContract } from "./regions";
import { authContract } from "./user/auth";

const c = initContract();

const api = c.router({
  auth: authContract,
  user: { ...signupContract, ...userInfoContract },
  restaurants: { ...restaurantsContract, ...reviewContract },
  regions: regionsContract,
});

export const openApiDocument = generateOpenApi(api, {
  info: {
    title: "Hotplace API",
    version: "1.0.0",
  },
});

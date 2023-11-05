import { initContract } from "@ts-rest/core";
import { generateOpenApi } from "@ts-rest/open-api";
import { reviewContract } from "./review/review_contract";
import { restaurantsContract } from "./restaurants";
import { signupContract } from "./user/signup/signup_contract";
import { userInfoContract } from "./user/userInfo/userInfo_contract";

const c = initContract();

const api = c.router({
  user: { ...signupContract, ...userInfoContract },
  restaurants: { ...restaurantsContract, ...reviewContract },
});

export const openApiDocument = generateOpenApi(api, {
  info: {
    title: "Hotplace API",
    version: "1.0.0",
  },
});

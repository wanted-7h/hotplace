import { initContract } from "@ts-rest/core";
import { generateOpenApi } from "@ts-rest/open-api";
import { userContract } from "./user/user_router";
import { reviewContract } from "./review/review_contract";

const c = initContract();

const api = c.router({
  user: userContract,
  review: reviewContract,
});

export const openApiDocument = generateOpenApi(api, {
  info: {
    title: "Posts API",
    version: "1.0.0",
  },
});

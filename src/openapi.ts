import { initContract } from "@ts-rest/core";
import { generateOpenApi } from "@ts-rest/open-api";
import { userContract } from "./user/user_router";
import { reviewContract } from "./review/review_contract";
import { restaurantsContract } from "./restaurants";

const c = initContract();

const api = c.router({
  user: userContract,
  review: reviewContract,
  restaurants: restaurantsContract,
});

export const openApiDocument = generateOpenApi(api, {
  info: {
    title: "Hotplace API",
    version: "1.0.0",
  },
});

import { initContract } from "@ts-rest/core";
import { ReviewBodySchema, ReviewSchema } from "./review_schema";
import { BaseHeadersSchema } from "../schemas";

const contract = initContract();

export const reviewContract = contract.router(
  {
    postReview: {
      method: "POST",
      //임시 path, 맛집 api 작성 후 수정 필요
      path: "/restaurants/:restaurant_name/reviews",
      responses: {
        201: ReviewSchema,
      },
      body: ReviewBodySchema,
      summary: "리뷰 작성",
    },
  },
  {
    baseHeaders: BaseHeadersSchema,
  },
);

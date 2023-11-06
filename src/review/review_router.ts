import { initServer } from "@ts-rest/express";
import db from "../db/models/index";
import { reviewContract } from "./review_contract";

const s = initServer();

export const reviewRouter = s.router(reviewContract, {
  //------------------------------------------------------------------------//
  postReview: {
    handler: async ({
      headers,
      body: { grade, detail },
      params: { restaurant_name },
    }) => {
      const userId = headers.user?.userId;

      // 맛집 데이터 삽입 이후 검증 작업 필요
      // const restaurant = await db.Restaurant.findOne({
      //   attributes: ['restaurant_name'],
      //   where: {restaurant_name},
      //   raw: true
      // })
      // if(restaurant) //진행

      try {
        const insertReview = await db.Review.create({
          user_id: userId,
          restaurant_name,
          grade,
          detail,
        });
        const {
          id: _id,
          createdAt: _createdAt,
          updatedAt: _updatedAt,
          ...insertResult
        } = insertReview.dataValues;
        return {
          status: 201,
          body: insertResult,
        };
      } catch (e) {
        return {
          status: 400,
          body: { error: "잘못된 요청, 리뷰 작성 실패" },
        };
      }
    },
  },
});

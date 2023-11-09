import axios from "axios";
import db from "../db/models/index";
import { env } from "../env";
import { getRestaurant, getHead } from "./get_data";

// 모든 데이터를 DB에 삽입하는 함수
export const allInsertDB = async () => {
  try {
    // 전체 데이터의 총 수
    const total = 100;
    // 한 번에 가져올 데이터 수
    const chunkSize = 10;

    const promises = [];

    for (let idx = 1; idx < total; idx += chunkSize) {
      promises.push(
        getRestaurant("GENRESTRT", env.API_KEY, total, idx, chunkSize),
      );
    }

    // 모든 API 호출을 병렬로 실행
    const chunkedData = await Promise.all(promises);
    const restaurants = chunkedData.flat();

    for (const restaurant of restaurants) {
      if (restaurant.BSN_STATE_NM === "폐업") {
        // 폐업 가게를 카운트
      } else {
        const restaurantInfo = {
          restaurant_name: restaurant.BIZPLC_NM,
          restaurant_type: restaurant.SANITTN_BIZCOND_NM,
          address: restaurant.REFINE_LOTNO_ADDR, // 도로명 주소가 없는 식당이 존재함
          lat: Number(restaurant.REFINE_WGS84_LAT),
          lon: Number(restaurant.REFINE_WGS84_LOGT),
        };

        // 레스토랑 정보를 데이터베이스에 삽입
        await db.Restaurant.create(restaurantInfo);
      }
    }

    // console.log("폐업 가게 수 : ", cnt);
  } catch (error) {
    console.log("API 호출 중 오류 발생: ", error);
  }
};

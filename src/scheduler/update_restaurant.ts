import axios from "axios";
import db from "../db/models/index";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { env } from "../env";
import { getRestaurant, getHead } from "./get_data";

// 레스토랑 데이터 업데이트
export const updateRestData = async () => {
  const today = new Date(2023, 11, 10).getDay();

  // 요일별 업종의 url 경로 설정
  const path = join(dirname(fileURLToPath(import.meta.url)), "sectors.json");
  const raw = readFileSync(path, { encoding: "utf8" });
  const sectors = JSON.parse(raw);

  // 데이터베이스 업데이트 함수 호출
  await updateDB(sectors[today].data1);
};

// 데이터 베이스 업데이트
const updateDB = async (sectors: string) => {
  const key = env.API_KEY;

  try {
    // 총 데이터 수
    // const total = (await getHead(sectors)) || 10;
    const total = 10;

    // 한 페이제 가져올 데이터의 수 최소1, 최대 1000
    const chunkSize = 5;

    const promises = [];

    // 병렬로 apu 데이터 가져오기
    for (let idx = 1; idx < total; idx += chunkSize) {
      promises.push(getRestaurant(sectors, key, total, idx, chunkSize));
    }

    const chunkedData = await Promise.all(promises);
    const restaurants = chunkedData.flat();

    for (const restaurant of restaurants) {
      if (restaurant.BSN_STATE_NM === "폐업") {
        // 폐업한 레스토랑 데이터 확인
        const closed = await db.Restaurant.findOne({
          where: {
            restaurant_name: restaurant.BIZPLC_NM,
            adress: restaurant.REFINE_LOTNO_ADDR,
          },
        });

        if (closed !== null) {
          // DB에서 삭제
          await db.Restaurant.destroy({
            where: {
              restaurant_name: restaurant.BIZPLC_NM,
              adress: restaurant.REFINE_LOTNO_ADDR,
            },
          });
        }
      } else {
        // DB 정보 업데이트
        await db.Restaurant.update(
          {
            restaurant_name: restaurant.BIZPLC_NM,
            restaurant_type: restaurant.SANITTN_BIZCOND_NM,
            adress: restaurant.REFINE_LOTNO_ADDR,
            lat: Number(restaurant.REFINE_WGS84_LAT),
            lon: Number(restaurant.REFINE_WGS84_LOGT),
          },
          {
            where: {
              restaurant_name: restaurant.BIZPLC_NM,
              adress: restaurant.REFINE_LOTNO_ADDR,
            },
          },
        );
      }
    }
  } catch (error) {
    console.log("api 호출 중 오류 발생: ", error);
  }
};

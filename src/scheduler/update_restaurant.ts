import axios from "axios";
import db from "../db/models/index";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { restaurantsRouter } from "../restaurants";

export const updateRestData = async () => {
  const today = new Date(2023, 11, 10).getDay();
  // 하루에 2개의 업종별로 업데이트
  const path = join(dirname(fileURLToPath(import.meta.url)), "sectors.json");
  const raw = readFileSync(path, { encoding: "utf8" });
  const secotrs = JSON.parse(raw);

  await updateDB(secotrs[today].data1);
};

const updateDB = async (_sectors: string) => {
  const key = process.env.api_key;

  try {
    //업종명

    const getHeadUrl =
      "https://openapi.gg.go.kr/" +
      _sectors +
      "?key=" +
      key +
      "&type=json&pSize=5&pindex=1";

    const getHead = await axios.get(getHeadUrl);
    const headData = getHead.data;

    // 데이터 총 개수
    // const total = headData.GENRESTRT[0].head[0].list_total_count;
    const total = 5;
    // 한번에 가져올 데이터 수
    const chunkSize = 2;
    var cnt = 0;
    for (let idx = 1; idx < total; idx += chunkSize) {
      const url =
        "https://openapi.gg.go.kr/" +
        _sectors +
        "?key=" +
        key +
        "&type=json&pSize=" +
        chunkSize +
        "&pindex=" +
        Math.floor(idx / chunkSize + 1);

      // 전체 데이터 가져오기
      const response = await axios.get(url);
      const responseData = response.data;
      const restaurants = responseData[_sectors][1].row;

      for (let i in restaurants) {
        // 폐업한 가게 중에서 DB에 데이터가 있다면 삭제
        if (restaurants[i].BSN_STATE_NM == "폐업") {
          const closed = await db.Restaurant.findOne({
            where: {
              restaurant_name: restaurants[i].BIZPLC_NM,
              adress: restaurants[i].REFINE_LOTNO_ADDR,
            },
          });
          // 삭제 로직
          if (closed !== null) {
            db.Restaurant.destroy({
              where: {
                restaurant_name: restaurants[i].BIZPLC_NM,
                adress: restaurants[i].REFINE_LOTNO_ADDR,
              },
            });
          }
        } else {
          // 영업 중인 가게 정보 업데이트
          db.Restaurant.update(
            {
              restaurant_name: restaurants[i].BIZPLC_NM,
              restaurant_type: restaurants[i].SANITTN_BIZCOND_NM,
              adress: restaurants[i].REFINE_LOTNO_ADDR, // 도로명 주소가 없는 식당이 존재 함
              lat: Number(restaurants[i].REFINE_WGS84_LAT),
              lon: Number(restaurants[i].REFINE_WGS84_LOGT),
            },
            {
              where: {
                restaurant_name: restaurants[i].BIZPLC_NM,
                adress: restaurants[i].REFINE_LOTNO_ADDR,
              },
            },
          );
        }
      }
    }
  } catch (error) {
    console.log("api 호출 중 오류 발생 : ", error);
  }
};

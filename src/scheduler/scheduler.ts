import axios from "axios";
import db from "../db/models/index";

export const dbScheduler = async () => {
  console.log(new Date() + "Running Scheduler !!! ");

  const key = process.env.api_key;

  try {
    //업종명
    const SANITTN_BIZCOND_NM = "chifood";
    const getHeadUrl =
      "https://openapi.gg.go.kr/Genrestrt" +
      SANITTN_BIZCOND_NM +
      "?key=" +
      key +
      "&type=json&pSize=5&pindex=1";

    const getHead = await axios.get(getHeadUrl);
    const headData: RestaurantResponse = getHead.data;

    // 데이터 총 개수
    const total = headData.Genrestrtchifood[0].head[0].list_total_count;
    // const total = 17; test용 값
    // 한번에 가져올 데이터 수
    const chunkSize = 5;

    for (let idx = 1; idx < total; idx += chunkSize) {
      console.log(idx, "번째 요청");
      let url =
        "https://openapi.gg.go.kr/Genrestrt" +
        SANITTN_BIZCOND_NM +
        "?key=" +
        key +
        "&type=json&pSize=" +
        chunkSize +
        "&pindex=" +
        Math.floor(idx / chunkSize + 1);
      console.log("insert : ", url);
      let response = await axios.get(url);
      let responseData: RestaurantResponse = response.data;
      let restaurants: Restaurant[] = responseData.Genrestrtchifood[1].row;
      for (let i in restaurants) {
        let restaurantInfo = {
          restaurant_name: restaurants[i].BIZPLC_NM,
          restaurant_type: restaurants[i].SANITTN_BIZCOND_NM,
          adress: restaurants[i].REFINE_LOTNO_ADDR, // 도로명 주소가 없는 식당이 존재 함
          lat: Number(restaurants[i].REFINE_WGS84_LAT),
          lon: Number(restaurants[i].REFINE_WGS84_LOGT),
        };
        let insertDB = await db.Restaurant.create(restaurantInfo);
      }
    }
  } catch (error) {
    console.log("api 호출 중 오류 발생 : ", error);
  }
};

// api로 받아오는 json 값들을 미리 정의해주는 인터페이스
interface Restaurant {
  SIGUN_NM: string;
  BIZPLC_NM: string;
  LICENSG_DE: string;
  BSN_STATE_NM: string;
  SANITTN_BIZCOND_NM: string;
  REFINE_LOTNO_ADDR: string;
  REFINE_ROADNM_ADDR: string;
  REFINE_ZIP_CD: string;
  REFINE_WGS84_LOGT: string;
  REFINE_WGS84_LAT: string;
}

interface RestaurantResponse {
  Genrestrtchifood: {
    head: {
      list_total_count: number;
      RESULT: {
        CODE: string;
        MESSAGE: string;
      };
      api_version: string;
    }[];
    row: Restaurant[];
  }[];
}

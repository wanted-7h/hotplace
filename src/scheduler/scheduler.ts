import axios from "axios";
import db from "../db/models/index";

export const dbScheduler = async () => {
  console.log(new Date() + "Running Scheduler !!! ");

  const key = process.env.api_key;

  try {
    //업종명
    const SANITTN_BIZCOND_NM = "chifood";
    const url =
      "https://openapi.gg.go.kr/Genrestrt" +
      SANITTN_BIZCOND_NM +
      "?key=" +
      key +
      "&type=json&pSize=5&pindex=1";

    const response = await axios.get(url);
    const responseData: RestaurantResponse = response.data;

    //[0] = head / [1] = row
    const restaurants: Restaurant[] = responseData.Genrestrtchifood[1].row;

    // DB에 들어갈 데이터들
    const restaurantInfo = {
      restaurant_name: restaurants[0].BIZPLC_NM,
      restaurant_type: restaurants[0].SANITTN_BIZCOND_NM,
      adress: restaurants[0].REFINE_ROADNM_ADDR,
      lat: Number(restaurants[0].REFINE_WGS84_LAT),
      lon: Number(restaurants[0].REFINE_WGS84_LOGT),
    };

    // insert DB
    const insertDB = await db.Restaurant.create(restaurantInfo);

    console.log("db에 insert : ", insertDB);
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

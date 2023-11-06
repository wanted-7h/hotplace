import axios from "axios";
import db from "../db/models/index";

export const allInsertDB = async () => {
  const key = process.env.api_key;
  try {
    //업종명

    const getHeadUrl =
      "https://openapi.gg.go.kr/Genrestrt" +
      "?key=" +
      key +
      "&type=json&pSize=5&pindex=1";

    const getHead = await axios.get(getHeadUrl);
    const headData = getHead.data;

    // 데이터 총 개수
    // const total = headData.Genrestrtchifood[0].head[0].list_total_count;
    const total = 17;
    // 한번에 가져올 데이터 수
    const chunkSize = 5;

    for (let idx = 1; idx < total; idx += chunkSize) {
      console.log(idx, "번째 요청");
      const url =
        "https://openapi.gg.go.kr/GENRESTRT" +
        "?key=" +
        key +
        "&type=json&pSize=" +
        chunkSize +
        "&pindex=" +
        Math.floor(idx / chunkSize + 1);
      console.log("url : ", url);

      // 전체 데이터 가져오기
      const response = await axios.get(url);
      const responseData = response.data;
      const restaurants = responseData.GENRESTRT[1].row;

      for (let i in restaurants) {
        if (restaurants[i].BSN_STATE_NM == "폐업") {
          // 폐업 가게 추가 x
          const restaurantInfo = {
            restaurant_name: restaurants[i].BIZPLC_NM,
            restaurant_type: restaurants[i].SANITTN_BIZCOND_NM,
            adress: restaurants[i].REFINE_LOTNO_ADDR, // 도로명 주소가 없는 식당이 존재 함
            lat: Number(restaurants[i].REFINE_WGS84_LAT),
            lon: Number(restaurants[i].REFINE_WGS84_LOGT),
          };
          const insertDB = await db.Restaurant.create(restaurantInfo);
        }
      }
    }
  } catch (error) {
    console.log("api 호출 중 오류 발생 : ", error);
  }
};

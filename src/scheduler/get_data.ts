import { waitForDebugger } from "inspector";
import { env } from "../env";
import axios from "axios";

// 데이터 가져오기
export const getRestaurant = async (
  _sectors: string, // 업종
  _key: string, // api key
  _total: any, // 총 데이터 수
  _idx: number, // index
  _chunkSize: number, // 한번에 가져오는 데이터 수
) => {
  // api url
  const url =
    "https://openapi.gg.go.kr/" +
    _sectors +
    "?key=" +
    _key +
    "&type=json&pSize=" +
    _chunkSize +
    "&pindex=" +
    Math.floor(_idx / _chunkSize + 1);

  const response = await axios.get(url);
  const responseData = response.data;
  const restaurants = responseData[_sectors][1].row;
  return restaurants;
};

// 헤더 정보, return 총 데이터수
export const getHead = async (_sectors: string) => {
  const key = env.API_KEY;

  try {
    const HeadUrl =
      "https://openapi.gg.go.kr/" +
      _sectors +
      "?key=" +
      key +
      "&type=json&pSize=5&pindex=1";

    const getHead = await axios.get(HeadUrl);
    const headData = getHead.data;
    const total = headData[_sectors][0].head[0].list_total_count;
    return Number(total);
  } catch (err) {
    console.log("getHead error : ", err);
  }
};

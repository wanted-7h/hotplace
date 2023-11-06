import axios from "axios";
import db from "../db/models/index";
import { updateRestData } from "./update_restaurant";
import { allInsertDB } from "./all_insert";

export const dbScheduler = async () => {
  console.log(new Date() + "Running Scheduler !!! ");

  const nowData = await db.Restaurant.count();

  if (nowData > 0) {
    console.log("0보다 큼");
    await updateRestData();
  } else {
    console.log("DB에 데이터 없음");
    await allInsertDB();
  }
};

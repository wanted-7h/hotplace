import axios from "axios";
import db from "../db/models/index";
import { updateRestData } from "./update_restaurant";
import { allInsertDB } from "./all_insert";

export const dbScheduler = async () => {
  console.log(new Date() + "Running Scheduler !!! ");

  // 오늘의 요일 0 ~ 6
  const nowData = await db.Restaurant.count();

  if (nowData > 0) {
    await updateRestData();
  } else {
    await allInsertDB();
  }
};

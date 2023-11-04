import axios from "axios";
import db from "../db/models/index";

import { allInsertDB } from "./all_insert";

export const dbScheduler = async () => {
  console.log(new Date() + "Running Scheduler !!! ");

  await allInsertDB();
};

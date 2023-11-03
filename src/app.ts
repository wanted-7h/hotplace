import express from "express";
import morgan from "morgan";
import testRouter from "./test/test.router";
import dotenv from "dotenv";
import { createExpressEndpoints } from "@ts-rest/express";
import { signUpContract, signupRouter } from "./user/signup_contract";
import { dbScheduler } from "./scheduler/scheduler";
import db from "./db/models";
import schedule from "node-schedule";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));

app.use("/api", testRouter);
createExpressEndpoints(signUpContract, signupRouter, app);

db.sequelize
  .sync({
    force: true, //임시
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(3000, () => {
  console.log("Server On");
  schedule.scheduleJob("0 * * * * *", function () {
    dbScheduler();
  });
});

/*
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL)

*/

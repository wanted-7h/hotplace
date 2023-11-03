import dotenv from "dotenv";
import express from "express";
import sequelzie from "./db/models";
import morgan from "morgan";
import testRouter from "./test/test.router";
import { dbScheduler } from "./scheduler/scheduler"


dotenv.config();

const app = express();
const schedule = require('node-schedule')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));

app.use("/api", testRouter);

sequelzie
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
  schedule.scheduleJob('0 * * * * *', function(){
    dbScheduler()
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
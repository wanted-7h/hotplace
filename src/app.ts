import express from "express";
import db from "./db/models";
import morgan from "morgan";
import testRouter from "./test/test.router";
import { createExpressEndpoints } from "@ts-rest/express";
import { signUpContract, signupRouter } from "./user/signup_contract";

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
});

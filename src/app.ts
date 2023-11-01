import dotenv from "dotenv";
import express from "express";
import sequelzie from "./db/models";
import morgan from "morgan";
import testRouter from "./test/test.router";
dotenv.config();

const app = express();

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
});

import express from "express";
import morgan from "morgan";
import testRouter from "./test/test.router.ts";
import { userContract, userRouter } from "./user/user_router";
import { dbScheduler } from "./scheduler/scheduler.ts";
import db from "./db/models";
import schedule from "node-schedule";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./openapi";
import { jwtMiddleware } from "./user/authorization/jwtMiddleware";
import { reviewRouter, reviewContract } from "./review/mod.ts";
import { restaurantsContract, restaurantsRouter } from "./restaurants";
import { initContract } from "@ts-rest/core";
import { regionsContract, regionsRouter } from "./regions";
import { authContract, authRouter } from "./user/auth/index";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan("dev"));

app.use("/api", testRouter);

const swaggerUrl = "/openapi.json";
app.get(swaggerUrl, (_req, res) => res.json(openApiDocument));
app.use(
  "/openapi",
  swaggerUi.serveFiles(undefined, { swaggerUrl }),
  swaggerUi.setup(undefined, {
    swaggerUrl,
    swaggerOptions: {
      persistAuthorization: true,
      withCredentials: true,
    },
  }),
);

// 인증 불필요 라우터
const c = initContract();
const publicContract = c.router({
  restaurants: restaurantsContract,
  regions: regionsContract,
});

const s = initServer();
const publicRouter = s.router(publicContract, {
  restaurants: restaurantsRouter,
  regions: regionsRouter,
});

createExpressEndpoints(publicContract, publicRouter, app, {
  jsonQuery: true,
  logInitialization: true,
  responseValidation: true,
});

//토큰 재발급(액세스, 리프래시)
createExpressEndpoints(authContract, authRouter, app);

//users{가입, 로그인}
createExpressEndpoints(userContract.signup, userRouter.signup, app);

// 인증 필요 라우터
//users{유저정보, 유저정보 업데이트}
createExpressEndpoints(
  userContract.userInfo,
  userRouter.userInfo,
  app,
  jwtMiddleware,
);
//리뷰 작성(맛집 api 이후 수정 필요)
createExpressEndpoints(reviewContract, reviewRouter, app, jwtMiddleware);

app.listen(3000, async () => {
  console.log("Server On");

  await dbScheduler();
  schedule.scheduleJob("0 0 0 * * *", dbScheduler);
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

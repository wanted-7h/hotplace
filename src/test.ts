import express from "express";
import { initServer, createExpressEndpoints } from "@ts-rest/express";
import { apiContract } from "./testrouter";
import { router } from "./testcon";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

createExpressEndpoints(apiContract, router, app);

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});

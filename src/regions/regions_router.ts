import { initServer } from "@ts-rest/express";
import { regionsContract } from "./regions_contract";
import * as fs from "node:fs";
import * as path from "node:path";

const regions = fs.readFileSync(path.join(__dirname, "/regions.json")).toJSON();

const s = initServer();
export const restaurantsRouter = s.router(regionsContract, {
  getMany: async ({ query: { do_si, sgg } }) => {
    return { status: 200, body: [] };
  },
});

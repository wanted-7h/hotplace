import { initServer } from "@ts-rest/express";
import { regionsContract } from "./regions_contract";
import { Region, RegionName } from "./regions_schema";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const raw = readFileSync(join(__dirname, "regions.json"), { encoding: "utf8" });
const regions = JSON.parse(raw) as Region[];

const byRegion =
  ({ do_si, sgg }: RegionName) =>
  (x: Region) =>
    (!do_si || x.do_si === do_si) && (!sgg || x.sgg === sgg);

const s = initServer();
export const regionsRouter = s.router(regionsContract, {
  getMany: async ({ query }) => {
    const queried = regions.filter(byRegion(query));

    return { status: 200, body: queried };
  },
});

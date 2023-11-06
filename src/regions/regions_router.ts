import { initServer } from "@ts-rest/express";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { regionsContract } from "./regions_contract.ts";
import { Region, RegionName } from "./regions_schema.ts";

const path = join(dirname(fileURLToPath(import.meta.url)), "regions.json");
const raw = readFileSync(path, { encoding: "utf8" });
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

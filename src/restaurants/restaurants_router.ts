import { initServer } from "@ts-rest/express";
import { restaurantsContract } from "./restaurants_contract";

const s = initServer();
export const restaurantsRouter = s.router(restaurantsContract, {
  getOne: async () => {
    return { status: 200, body: { reviews: [] } };
  },
  getMany: async () => {
    return { status: 200, body: [] };
  },
});

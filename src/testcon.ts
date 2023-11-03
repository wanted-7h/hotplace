import { initServer, createExpressEndpoints } from "@ts-rest/express";
import { apiContract } from "./testrouter";
const s = initServer();

export const router = s.router(apiContract, {
  transcribeVideo: async () => {
    const body2 = "hh";
    return {
      status: 200,
      body: {
        url: body2,
        content: body2,
        language: "English",
      },
    };
  },
});

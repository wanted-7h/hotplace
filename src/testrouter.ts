import { initContract } from "@ts-rest/core";
import { z } from "zod";

export const contract = initContract();

const PostSchema = z.object({
  language: z.string(),
  url: z.string(),
  content: z.string(),
});

export const apiContract = contract.router({
  transcribeVideo: {
    method: "GET",
    path: "/",
    responses: {
      200: PostSchema,
    },
    summary: "Transcribe YouTube video by videoUrl",
  },
});

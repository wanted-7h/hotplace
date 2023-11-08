import { createClient } from "redis";

//default local 127.0.0.1:6379
const redisClient = await createClient()
  .on("ready", () => console.log("redis is ready"))
  .on("error", (error) => console.log("redis error:", error))
  .connect();

export default redisClient;

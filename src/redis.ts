import * as redis from "redis";

//default local 127.0.0.1:6379
const redisClient = redis.createClient();

await redisClient.connect();
console.log("redis is connected");

redisClient.on("ready", () => {
  console.log("redis is ready");
});

redisClient.on("error", (error) => {
  console.log(error);
});

export default redisClient;

// lib/redis.ts
import { createClient } from "redis";

let redis: ReturnType<typeof createClient>;

if (!global._redis) {
  global._redis = createClient({
    url: process.env.REDIS_URL,
  });

  global._redis.connect().catch(console.error);

  global._redis.on("error", (err) => {
    console.error("REDIS ERROR:", err);
  });
}

redis = global._redis;

export default redis;

declare global {
  // prevent TS from complaining about global._redis
  var _redis: ReturnType<typeof createClient> | undefined;
}

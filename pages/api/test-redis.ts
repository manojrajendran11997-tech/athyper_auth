import type { NextApiRequest, NextApiResponse } from "next";
import redis from "../../lib/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await redis.set("ping", "pong", { EX: 10 });

  const value = await redis.get("ping");

  res.json({ status: "ok", value });
}

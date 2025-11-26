import mongoose from "mongoose";
import { fetchRfxEvents } from "./fetchRFX";
import { RfxEvent } from "../../../models/RfxEvent";

export async function syncRfxToMongo() {
  const MONGO = process.env.MONGO_URL || process.env.MONGODB_URI;
  await mongoose.connect(MONGO!);
  const data = await fetchRfxEvents();
  if (!data || !data.events) return console.log("No data returned.");

  for (const ev of data.events) {
    await RfxEvent.updateOne(
      { eventId: ev.eventId },
      { $set: ev },
      { upsert: true }
    );
  }

  console.log("✔ Ariba → Mongo data sync completed.");
}

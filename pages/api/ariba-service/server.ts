import cron from "node-cron";
import { syncRfxToMongo } from "./saveToMongo";

console.log("⏳ Sync started...");

cron.schedule("*/10 * * * *", () => {
  console.log("🔄 Fetching Ariba → Mongo...");
  syncRfxToMongo();
});

syncRfxToMongo(); // Run immediately

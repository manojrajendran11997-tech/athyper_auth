import mongoose from "mongoose";

const RFXSchema = new mongoose.Schema({
  eventId: String,
  title: String,
  status: String,
  created: Date,
  owner: String,
  suppliers: Array,
}, { timestamps: true });

export const RfxEvent = mongoose.model("RfxEvent", RFXSchema);

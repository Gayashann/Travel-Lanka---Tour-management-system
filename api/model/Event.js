import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  district: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;

import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Income", "Expense"],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Finance = mongoose.model("Finance", financeSchema);

export default Finance;

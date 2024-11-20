import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectMongoDB.js";
import userRouter from "./router/userRouter.js";
import eventRouter from "./router/eventRoutes.js";
import inquiryRouter from "./router/inquiryRoutes.js"
import financeRouter from "./router/financeRouter.js";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

app.use("/auth", userRouter);
app.use("/events", eventRouter);
app.use("/inquiry", inquiryRouter);
app.use("/finance", financeRouter);
dotenv.config();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connectMongoDB();

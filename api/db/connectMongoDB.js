import mongoose from "mongoose";

const connectMongoDB = async () => {
  try {
    const mongo = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(`MongoDB connected: ${mongo.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connectMongoDB;

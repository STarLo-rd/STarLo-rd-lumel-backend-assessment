import mongoose from "mongoose";

export async function connectDB(connectionURI: string) {
  try {
    await mongoose.connect(connectionURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

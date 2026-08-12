import mongoose from "mongoose";

export const connectDB = async () => {
  if (!process.env.MONGODB) {
    throw new Error("MONGODB connection string is not set in backend/.env");
  }

  // Fail fast instead of letting queries hang on mongoose's buffer timeout.
  mongoose.set("bufferTimeoutMS", 5000);

  await mongoose.connect(process.env.MONGODB, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("Database connected successfully");
};

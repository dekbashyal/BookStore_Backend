import mongoose from "mongoose";

export const connecttoDB = async (MONGO_URL) => {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to database successfully");
  } catch (err) {
    console.error("Error connecting to database:", err.message);
    throw err;
  }
};

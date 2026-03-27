import mongoose from "mongoose";

type connectionObj = {
  isConnected?: number
}

const connection: connectionObj = {};

const connectDB = async () => {
  if (connection.isConnected) {
    console.log("Already connected to the database");
    return;
  }

  try {
    const db = (await mongoose.connect(process.env.MONGO_URI as string)) || "";

    connection.isConnected = db.connections[0].readyState;

    console.log("Database connected successfully");

  } catch (error) {
    console.error("Database connection failed:", error);

    process.exit(1);
  }
};


export default connectDB;
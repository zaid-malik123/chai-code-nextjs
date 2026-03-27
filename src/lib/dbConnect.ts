import mongoose from "mongoose";


// basic connection for data base ;
// type connectionObj = {
//   isConnected?: number
// }

// const connection: connectionObj = {};

// const connectDB = async () => {
//   if (connection.isConnected) {
//     console.log("Already connected to the database");
//     return;
//   }

//   try {
//     const db = (await mongoose.connect(process.env.MONGO_URI as string)) || "";

//     connection.isConnected = db.connections[0].readyState;

//     console.log("Database connected successfully");

//   } catch (error) {
//     console.error("Database connection failed:", error);

//     process.exit(1);
//   }
// };


// export default connectDB;

// production ready connection for database

const db_Url = process.env.MONGO_URI!;

if (!db_Url) {
  throw new Error("DB URL is not found");
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectDb = async () => {
  if(cached.conn){
    return cached.conn
  }

  if(!cached.promise){
    cached.promise = mongoose.connect(db_Url, {
      bufferCommands: false
    }).then((conn) => conn.connection)
  }

  try {
    const conn = await cached.promise
    return conn
  } catch (error) {
    console.log(`Db connection error ${error}`)
    cached.promise = null;
    throw error; 
  }
}
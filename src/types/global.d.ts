import {Connection} from "mongoose";

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<Connection> | null;
  };
}

export {};
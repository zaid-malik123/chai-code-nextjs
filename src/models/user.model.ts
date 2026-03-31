import mongoose, { Schema, Document } from "mongoose";

export interface MessageI extends Document {
  content: string;
  createdAt: Date;
}

export interface UserI extends Document {
  userName: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: MessageI[];
  createdAt?: Date;
  updatedAt?: Date;
}

const messageSchema: Schema<MessageI> = new Schema(
  {
    content: {
      type: String,
      required: [true, "content is required"],
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
);

const userSchema: Schema<UserI> = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [/.+\@.+\..+/, "Please use a valid email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    verifyCode: {
      type: String,
      required: true,
    },
    verifyCodeExpiry: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isAcceptingMessage: {
      type: Boolean,
      default: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true },
);

const User =
  (mongoose.models.User as mongoose.Model<UserI>) ||
  mongoose.model<UserI>("User", userSchema);

export default User;

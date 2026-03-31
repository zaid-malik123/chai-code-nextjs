import { connectDb } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/options";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await connectDb();

  try {
    const session = await getServerSession(authOptions);

    const user = session?.user;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "user and session is not defined ",
        },
        { status: 400 },
      );
    }

    const userId = new mongoose.Types.ObjectId(user?._id);

    const res = await User.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (res.length === 0 || !res) {
      return Response.json(
        {
          success: false,
          message: "result not found",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: true,
        message: res[0].messages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: error || "Something went wrong",
      },
      { status: 500 },
    );
  }
}

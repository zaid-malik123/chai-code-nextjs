import { connectDb } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth].ts/options";

export async function POST(req: Request) {
  connectDb();

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

    const userId = user?._id;

    const { acceptMessage } = await req.json();

    const updatedResult = await User.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessage,
      },
      { new: true },
    );

    if (!updatedResult) {
      return Response.json(
        {
          success: false,
          message: "user not found and updated",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedResult,
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

export async function GET(req: Request) {
  try {
    await connectDb();

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

    const userId = user?._id;

    const userAcceptanceMessageStatus = await User.findById(userId);

    if (!userAcceptanceMessageStatus) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        { status: 400 },
      );
    }

    return Response.json(
      {
        success: true,
        message: "Message acceptance status",
        isAcceptingMessage: userAcceptanceMessageStatus.isAcceptingMessage,
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

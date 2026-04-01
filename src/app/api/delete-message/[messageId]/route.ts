import { connectDb } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth].ts/options";

export async function DELETE(
  req: Request,
  { params }: { params: { messageId: string } }
) {
  await connectDb();

  const messageId = params.messageId;

  if (!messageId) {
    return Response.json(
      { success: false, message: "Message ID is required" },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const userId = session.user._id;

  try {
    const updateResult = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: {
          messages: { _id: messageId },
        },
      },
      { new: true }
    );

    if (!updateResult) {
      return Response.json(
        { message: "Message not found or already deleted", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Message deleted", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}

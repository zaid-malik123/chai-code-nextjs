import { connectDb } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { MessageI } from "@/models/user.model";

export async function POST(req: Request) {
  connectDb();

  try {

    const {userName, content} = await req.json();

    const user = await User.findOne({
        userName
    })

    if(!user) {
        return Response.json(
        { message: 'User not found', success: false },
        { status: 404 }
      );
    }

    if(!user.isAcceptingMessage) {
        return Response.json(
        { message: 'User is not accepting messages', success: false },
        { status: 403 } // 403 Forbidden status
      );
    }

    const message = {
        content,
        createdAt: new Date()
    }

    user.messages.push(message as MessageI);

    await user.save();

    return Response.json(
      { message: 'Message sent successfully', success: true },
      { status: 201 }
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

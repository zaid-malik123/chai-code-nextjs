import { connectDb } from "@/lib/dbConnect";
import User from "@/models/user.model";
import { verifyUserSchema } from "@/schemas/verifySchema";

export async function POST(req: Request) {
  await connectDb();

  try {
    
    const body = await req.json();

    const result = verifyUserSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { userName, verifyCode } = result.data;

    const user = await User.findOne({ userName });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User does not exist",
        },
        { status: 400 },
      );
    }

    if (user.isVerified) {
      return Response.json(
        {
          success: false,
          message: "User already verified",
        },
        { status: 400 },
      );
    }

    const isCodeValid = user.verifyCodeExpiry! > new Date();

    if (!isCodeValid) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired",
        },
        { status: 400 },
      );
    }

    const isCodeMatch = verifyCode === user.verifyCode;

    if (!isCodeMatch) {
      return Response.json(
        {
          success: false,
          message: "Incorrect verification code",
        },
        { status: 400 },
      );
    }
    user.isVerified = true;

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Account verified successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Something went wrong",
      },
      { status: 500 },
    );
  }
}

import { connectDb } from "@/lib/dbConnect";
import { z } from "zod";
import User from "@/models/user.model";
import { userNameValidation } from "@/schemas/signupSchema";

const userNameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(req: Request) {
  await connectDb();

  try {
    const { searchParams } = new URL(req.url);
    const userName = searchParams.get("username");

    const result = userNameQuerySchema.safeParse({ userName });

    if (result.success === false) {
      return Response.json(
        {
          success: false,
          message: `Username validation error ${result.error.flatten().fieldErrors.userName}`,
        },
        {
          status: 400,
        },
      );
    }

    const user = await User.findOne({
        userName,
        isVerified: true
    })

     if (user) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }


    return Response.json(
      {
        success: true,
        message: `Username is unique`,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: `Unique username api error ${error}`,
      },
      {
        status: 500,
      },
    );
  }
}

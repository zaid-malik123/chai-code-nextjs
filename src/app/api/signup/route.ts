import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { sendVerificationMail } from "@/helpers/sendVerificationMail";
import { connectDb } from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST(req: NextRequest) {
  await connectDb();

  try {
    const { email, userName, password } = await req.json();

    const existingUserByUsername = await User.findOne({ userName });

    if (existingUserByUsername && existingUserByUsername.isVerified) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await User.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Email already registered",
          },
          { status: 400 }
        );
      } else {
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = verifyCodeExpiry;

        await existingUserByEmail.save();
      }
    } else {
      await User.create({
        userName,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
        messages: [],
      });
    }

    const emailResponse = await sendVerificationMail(
      email,
      verifyCode,
      userName
    );

    if (!emailResponse.success) {
      await User.deleteOne({ email });

      return Response.json(
        {
          success: false,
          message: "Failed to send verification email",
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("POST API ERROR:", error);

    return Response.json(
      {
        success: false,
        message: error || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
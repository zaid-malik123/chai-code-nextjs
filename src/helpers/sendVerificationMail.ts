import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";
import { transporter } from "@/lib/nodemailer";
import { render } from "@react-email/render";

export const sendVerificationMail = async (
  email: string,
  verifyCode: string,
  userName: string
): Promise<ApiResponse> => {
  try {
    const html = await render(
      VerificationEmail({ userName, otp: verifyCode })
    );

     await transporter.sendMail({
      from: `"Mystery App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Mystery Message Verification Code",
      html: html,
    });


    return {
      success: true,
      message: "Verification email sent successfully.",
    };
  } catch (error) {
    console.error("Error sending verification email:", error);

    return {
      success: false,
      message: "Failed to send verification email.",
    };
  }
};
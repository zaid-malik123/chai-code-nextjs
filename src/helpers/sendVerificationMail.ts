import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export const sendVerificationMail = async (
  email: string,
  verifyCode: string,
  userName: string,
): Promise<ApiResponse> => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery Message Verification Code",
      react: VerificationEmail({ userName, otp: verifyCode }),
    });
    console.log("send mail")
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
};

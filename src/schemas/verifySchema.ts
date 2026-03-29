import { z } from "zod";

export const verifyCodeSchema = z.string().length(6, {
  message: "Code must be exactly 6 characters long",
});

export const verifyUserSchema = z.object({
  userName: z.string().min(3, {
    message: "Username must be at least 3 characters",
  }),
  verifyCode: verifyCodeSchema,
});
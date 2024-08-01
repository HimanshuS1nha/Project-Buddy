import { z } from "zod";

export const changePasswordValidator = z.object({
  oldPassword: z
    .string({ required_error: "Old Passwod is required" })
    .trim()
    .min(1, { message: "Old Password must be atleast 8 characters long" }),
  newPassword: z
    .string({ required_error: "New Passwod is required" })
    .trim()
    .min(1, { message: "New Password must be atleast 8 characters long" }),
  confirmPassword: z
    .string({ required_error: "Confirm Passwod is required" })
    .trim()
    .min(1, { message: "Confirm Password must be atleast 8 characters long" }),
});

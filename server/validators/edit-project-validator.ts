import { z } from "zod";

export const editProjectValidator = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  description: z.string().optional(),
  status: z.enum(["Live", "Building"]),
  id: z
    .string({ required_error: "Id is required" })
    .trim()
    .min(1, { message: "Id is required" }),
});

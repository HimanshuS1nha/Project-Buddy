import { z } from "zod";

export const changeTaskStatusValidator = z.object({
  id: z
    .string({ required_error: "Id is required" })
    .min(1, { message: "Id is required" }),
  status: z.enum(["Pending", "Review", "Completed"]),
});

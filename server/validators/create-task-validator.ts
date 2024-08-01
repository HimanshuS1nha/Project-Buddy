import { z } from "zod";

export const createTaskValidator = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  status: z.enum(["Pending", "Review", "Completed"]),
  startDate: z
    .string({ required_error: "Start date is required" })
    .trim()
    .min(1, { message: "Start date is required" }),
  endDate: z
    .string({ required_error: "End date is required" })
    .trim()
    .min(1, { message: "End date is required" }),
  projectId: z
    .string({ required_error: "Project Id is required" })
    .trim()
    .min(1, { message: "Project Id is required" }),
  assignedTo: z.array(z.string()),
});

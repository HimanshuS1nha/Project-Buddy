import { z } from "zod";

export const createTaskValidator = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" }),
  description: z.string().optional(),
  startDate: z
    .string({ required_error: "Start date is required" })
    .trim()
    .min(1, { message: "Start date is required" }),
  endDate: z
    .string({ required_error: "End date is required" })
    .trim()
    .min(1, { message: "End date is required" }),
  assignedTo: z.string({
    required_error: "Assigning to a team member is required",
  }),
});

export type createTaskValidatorType = z.infer<typeof createTaskValidator>;

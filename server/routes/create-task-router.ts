import { Router } from "express";
import { ZodError } from "zod";
import { verify } from "jsonwebtoken";

import prisma from "../libs/db";
import { createTaskValidator } from "../validators/create-task-validator";

const createTaskRouter = Router();

createTaskRouter.post("/", async (req, res) => {
  try {
    const { status, assignedTo, endDate, projectId, startDate, title } =
      await createTaskValidator.parseAsync(req.body);

    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const email = verify(token, process.env.JWT_SECRET!) as string;
    if (!email) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Not logged in" });
    }

    await prisma.tasks.create({
      data: {
        projectId,
        endDate,
        startDate,
        status,
        title,
        assignedTo,
      },
    });

    return res.status(201).json({ message: "Task created successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ error: error.errors[0].message });
    } else {
      return res
        .status(500)
        .json({ error: "Some error occured. Please try again later!" });
    }
  }
});

export { createTaskRouter };

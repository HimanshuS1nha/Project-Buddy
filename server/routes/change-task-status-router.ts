import { Router } from "express";
import { verify } from "jsonwebtoken";
import { ZodError } from "zod";

import prisma from "../libs/db";
import { changeTaskStatusValidator } from "../validators/change-task-status-validator";

const changeTaskStatusRouter = Router();

changeTaskStatusRouter.post("/", async (req, res) => {
  try {
    const { id, status } = await changeTaskStatusValidator.parseAsync(req.body);

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

    const task = await prisma.tasks.findUnique({
      where: {
        id,
      },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    const project = await prisma.projects.findUnique({
      where: {
        id: task.projectId,
      },
    });
    if (!project) {
      return res.status(404).json({ error: "Task not found" });
    }
    if (
      project.createdBy !== user.email &&
      !project.teamMembers.includes(user.email)
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    await prisma.tasks.update({
      where: {
        id: task.id,
      },
      data: {
        status,
      },
    });

    return res
      .status(201)
      .json({ message: "Task status updated successfully" });
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

export { changeTaskStatusRouter };

import { Router } from "express";
import { verify } from "jsonwebtoken";
import { ZodError } from "zod";

import prisma from "../libs/db";
import { editProjectValidator } from "../validators/edit-project-validator";

const editProjectRouter = Router();

editProjectRouter.post("/", async (req, res) => {
  try {
    const { id, status, title, description } =
      await editProjectValidator.parseAsync(req.body);

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

    const project = await prisma.projects.findUnique({
      where: {
        id,
      },
    });
    if (!project) {
      return res.status(404).json({ error: "Project nor found" });
    }

    await prisma.projects.update({
      where: { id },
      data: {
        title,
        status,
        description,
      },
    });

    return res.status(201).json({ message: "Project edited successfully" });
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

export { editProjectRouter };

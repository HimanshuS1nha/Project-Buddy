import { Router } from "express";
import { verify } from "jsonwebtoken";
import { ZodError } from "zod";

import prisma from "../libs/db";
import { createProjectValidator } from "../validators/create-project-validator";

const createProjectRouter = Router();

createProjectRouter.post("/", async (req, res) => {
  try {
    const { status, title, description } =
      await createProjectValidator.parseAsync(req.body);

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

    await prisma.projects.create({
      data: {
        status,
        title,
        createdBy: user.email,
        description,
      },
    });

    return res.status(201).json({ message: "Project created successfully" });
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

export { createProjectRouter };

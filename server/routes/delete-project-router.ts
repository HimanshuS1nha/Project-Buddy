import { Router } from "express";
import { verify } from "jsonwebtoken";

import prisma from "../libs/db";

const deleteProjectRouter = Router();

deleteProjectRouter.post("/", async (req, res) => {
  try {
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

    const { id } = req.body;
    if (!id) {
      return res.status(422).json({ error: "Invalid request" });
    }

    const project = await prisma.projects.findUnique({
      where: {
        id,
        createdBy: user.email,
      },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    await prisma.projects.delete({
      where: {
        id: project.id,
      },
    });

    return res.status(201).json({ message: "Project deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { deleteProjectRouter };

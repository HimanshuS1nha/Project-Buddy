import { Router } from "express";
import { verify } from "jsonwebtoken";

import prisma from "../libs/db";

const getAllUsersRouter = Router();

getAllUsersRouter.get("/", async (req, res) => {
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

    const users = await prisma.users.findMany({
      where: {
        id: {
          not: user.id,
        },
      },
      select: {
        name: true,
        id: true,
      },
    });

    return res.status(200).json({ users });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getAllUsersRouter };

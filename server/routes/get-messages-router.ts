import { Router } from "express";
import { ZodError } from "zod";
import { verify } from "jsonwebtoken";

import prisma from "../libs/db";

const getMessagesRouter = Router();

getMessagesRouter.post("/", async (req, res) => {
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

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            sentBy: id,
            sentTo: user.id,
          },
          {
            sentTo: id,
            sentBy: user.id,
          },
        ],
      },
    });

    return res.status(200).json({ messages });
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

export { getMessagesRouter };

import { Router } from "express";
import { verify } from "jsonwebtoken";

import prisma from "../libs/db";

const getAllTeamMembersRouter = Router();

getAllTeamMembersRouter.post("/", async (req, res) => {
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
      return res.status(422).json({ error: "invalid request" });
    }

    const project = await prisma.projects.findUnique({ where: { id } });
    if (!project) {
      return res.status(422).json({ error: "invalid request" });
    }

    let teamMembers: { id: string; name: string }[] = [];

    for await (const email of project.teamMembers) {
      const teamMember = await prisma.users.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
        },
      });
      if (!teamMember) return;

      teamMembers.push(teamMember);
    }

    return res.status(200).json({ teamMembers });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { getAllTeamMembersRouter };

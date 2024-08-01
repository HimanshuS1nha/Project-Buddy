import { Router } from "express";
import { ZodError } from "zod";
import { verify } from "jsonwebtoken";
import { hash, compare } from "bcrypt";

import prisma from "../libs/db";
import { changePasswordValidator } from "../validators/change-password-validator";

const changePasswordRouter = Router();

changePasswordRouter.post("/", async (req, res) => {
  try {
    const { confirmPassword, newPassword, oldPassword } =
      await changePasswordValidator.parseAsync(req.body);
    if (newPassword !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

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

    const doesPasswordMatch = await compare(oldPassword, user.password);
    if (!doesPasswordMatch) {
      return res.status(401).json({ error: "Wrong Password" });
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Password changed successfully" });
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

export { changePasswordRouter };

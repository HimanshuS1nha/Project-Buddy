import { Router } from "express";
import { ZodError } from "zod";
import { hash } from "bcrypt";

import prisma from "../libs/db";
import { signupValidator } from "../validators/signup-validator";

const signupRouter = Router();

signupRouter.post("/", async (req, res) => {
  try {
    const { confirmPassword, email, name, password } =
      await signupValidator.parseAsync(req.body);
    if (password !== confirmPassword) {
      return res.status(422).json({ error: "Passwords do not match" });
    }

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      return res.status(409).json({ error: "Email is already in use" });
    }

    const hashedPassword = await hash(password, 10);

    await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "Account created successfully" });
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

export { signupRouter };

import { Router } from "express";
import { ZodError } from "zod";
import { compare } from "bcrypt";

import { loginValidator } from "../validators/login-validator";
import prisma from "../libs/db";

const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  try {
    const { email, password } = await loginValidator.parseAsync(req.body);

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const doesPasswordMatch = await compare(password, user.password);
    if (!doesPasswordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.cookie("token", user.email, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 1000 * 60 * 24 * 30,
    });

    return res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(422).json({ error: error.errors[0].message });
    } else {
      return res
        .status(422)
        .json({ error: "Some error occured. Please try again later!" });
    }
  }
});

export { loginRouter };

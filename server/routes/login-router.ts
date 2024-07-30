import { Router } from "express";

const loginRouter = Router();

loginRouter.post("/", (req, res) => {
  return res.status(200).json({ message: "Logged in successfully" });
});

export { loginRouter };

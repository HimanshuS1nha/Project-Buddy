import { Router } from "express";

const logoutRouter = Router();

logoutRouter.get("/", (_, res) => {
  try {
    res.cookie("token", "", { httpOnly: true, maxAge: 0 });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Some error occured. Please try again later!" });
  }
});

export { logoutRouter };

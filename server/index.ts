import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import { loginRouter } from "./routes/login-router";
import { signupRouter } from "./routes/signup-router";
import { isLoggedInRouter } from "./routes/is-logged-in-router";
import { createProjectRouter } from "./routes/create-project-router";
import { getProjectsRouter } from "./routes/get-projects-router";
import { deleteProjectRouter } from "./routes/delete-project-router";
import { getProjectRouter } from "./routes/get-project-router";
import { deleteAllProjectsRouter } from "./routes/delete-all-projects-router";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());

app.use("/api/login", loginRouter);
app.use("/api/signup", signupRouter);
app.use("/api/is-logged-in", isLoggedInRouter);
app.use("/api/create-project", createProjectRouter);
app.use("/api/get-projects", getProjectsRouter);
app.use("/api/get-project", getProjectRouter);
app.use("/api/delete-project", deleteProjectRouter);
app.use("/api/delete-all-projects", deleteAllProjectsRouter);

app.get("/", (_, res) => {
  return res.send("Hello World");
});

server.listen(port, () => console.log(`Running at http://localhost:${port}`));

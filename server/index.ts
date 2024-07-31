import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";

import { loginRouter } from "./routes/login-router";
import { signupRouter } from "./routes/signup-router";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/login", loginRouter);
app.use("/api/signup", signupRouter);

app.get("/", (_, res) => {
  return res.send("Hello World");
});

server.listen(port, () => console.log(`Running at http://localhost:${port}`));

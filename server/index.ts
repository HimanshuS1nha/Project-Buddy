import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";

import { loginRouter } from "./routes/login-router";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api/login", loginRouter);

app.get("/", (_, res) => {
  return res.send("Hello World");
});

server.listen(port, () => console.log(`Running at http://localhost:${port}`));

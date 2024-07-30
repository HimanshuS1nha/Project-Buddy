import express from "express";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_, res) => {
  return res.send("Hello World");
});

server.listen(port, () => console.log(`Running at http://localhost:${port}`));

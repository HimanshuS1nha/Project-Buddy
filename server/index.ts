import express from "express";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";

import prisma from "./libs/db";

import { loginRouter } from "./routes/login-router";
import { signupRouter } from "./routes/signup-router";
import { isLoggedInRouter } from "./routes/is-logged-in-router";
import { createProjectRouter } from "./routes/create-project-router";
import { getProjectsRouter } from "./routes/get-projects-router";
import { deleteProjectRouter } from "./routes/delete-project-router";
import { getProjectRouter } from "./routes/get-project-router";
import { deleteAllProjectsRouter } from "./routes/delete-all-projects-router";
import { createTaskRouter } from "./routes/create-task-router";
import { editProjectRouter } from "./routes/edit-project-router";
import { getNotificationsRouter } from "./routes/get-notifications-router";
import { getAllTeamMembersRouter } from "./routes/get-all-team-members-router";
import { changeTaskStatusRouter } from "./routes/change-task-status-router";
import { getAllUsersRouter } from "./routes/get-all-users-router";
import { getMessagesRouter } from "./routes/get-messages-router";
import { logoutRouter } from "./routes/logout-router";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
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
app.use("/api/edit-project", editProjectRouter);
app.use("/api/delete-project", deleteProjectRouter);
app.use("/api/delete-all-projects", deleteAllProjectsRouter);
app.use("/api/change-password", deleteAllProjectsRouter);
app.use("/api/create-task", createTaskRouter);
app.use("/api/change-task-status", changeTaskStatusRouter);
app.use("/api/get-notifications", getNotificationsRouter);
app.use("/api/get-all-team-members", getAllTeamMembersRouter);
app.use("/api/get-all-users", getAllUsersRouter);
app.use("/api/get-messages", getMessagesRouter);
app.use("/api/logout", logoutRouter);

app.get("/", (_, res) => {
  return res.send("Hello World");
});

io.on("connect", (socket) => {
  socket.join(socket.handshake.auth.id);

  socket.on("request-add-member", async ({ email, projectId, userEmail }) => {
    if (email === userEmail) {
      return io.to(socket.id).emit("error", "You cannot add yourself");
    }
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return io.to(socket.id).emit("error", "User not found");
    }
    const project = await prisma.projects.findUnique({
      where: {
        id: projectId,
      },
    });
    if (!project) {
      return io.to(socket.id).emit("error", "Project not found");
    }

    const request = await prisma.joinRequests.findFirst({
      where: {
        userEmail: user!.email,
        projectId: project!.id,
      },
    });
    if (request) {
      return io.to(socket.id).emit("error", "Request already sent");
    }

    await prisma.joinRequests.create({
      data: {
        userEmail: user!.email,
        projectId: project!.id,
        senderEmail: email,
      },
    });

    socket.to(user!.id).emit("join-request", { projectId });
    io.to(socket.id).emit("request-sent");
  });

  socket.on(
    "accept-join-request",
    async ({ senderEmail, projectId, userEmail }) => {
      const user = await prisma.users.findUnique({
        where: { email: senderEmail },
      });

      await prisma.joinRequests.deleteMany({
        where: {
          senderEmail: user?.email,
          projectId,
          userEmail,
        },
      });

      await prisma.projects.update({
        where: {
          id: projectId,
        },
        data: {
          teamMembers: {
            push: userEmail,
          },
        },
      });

      socket.to(user!.id).emit("request-accepted", { userEmail });
      io.to(socket.id).emit("request-accepted");
    }
  );

  socket.on("send-message", async ({ message, to }) => {
    await prisma.messages.create({
      data: {
        content: message.content,
        sentAt: message.sentAt,
        sentBy: message.sentBy,
        sentTo: message.sentTo,
      },
    });
    socket.to(to).emit("receive-message", { message });
  });
});

server.listen(port, () => console.log(`Running at http://localhost:${port}`));

import { Socket } from "socket.io";
import http from "http";

import express from "express";
import { Server } from "socket.io";
import { UserManager } from "./managers/UserManagers";

const app = express();
const server = http.createServer(http);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const userManager = new UserManager();

// STEP 1: The 'connection' event is triggered when a user connects to the server.
// This marks the start of the user’s interaction with the backend.
io.on("connection", (socket: Socket) => {
  console.log("a user connected");

  // STEP 2: The new user is added to the backend via the UserManager.
  // This process involves assigning a name and associating the user's socket.
  userManager.addUser("randomName", socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");

    //STEP 7: When a user disconnects from the server (not necessarily from the room)
  });
  userManager.removeUser(socket.id);
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

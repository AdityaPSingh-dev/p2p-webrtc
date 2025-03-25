import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";

export interface User {
  socket: Socket;
  name: string;
}

export class UserManager {
  private users: User[];
  private queue: string[];
  private roomManager: RoomManager;
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }

  // STEP 3: The user's socket and name are stored in the 'users' array,
  // and the socket ID is added to the 'queue' for room matching.
  addUser(name: string, socket: Socket) {
    this.users.push({ name, socket });
    this.queue.push(socket.id);
    this.clearQueue();
    this.initHandlers(socket);
  }

  // STEP 7: When a user disconnects from the server (not necessarily from the room),
  // the user is removed from the system, and their data is cleaned up from the users array and queue.
  removeUser(socketId: string) {
    this.users = this.users.filter((x) => x.socket.id !== socketId);
    this.queue = this.queue.filter((x) => x === socketId);
  }

  // STEP 4: Once there are at least two users in the queue,
  // their socket IDs are popped from the queue, and a room is created for them.
  clearQueue() {
    if (this.queue.length < 2) return;
    const user1 = this.users.find((x) => x.socket.id === this.queue.pop());
    const user2 = this.users.find((x) => x.socket.id === this.queue.pop());
    if (!user1 || !user2) return;
    const room = this.roomManager.createRoom(user1, user2);
  }
  initHandlers(socket: Socket) {
    socket.on("offer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp);
    });
    socket.on("answer", ({ sdp, roomId }: { sdp: string; roomId: string }) => {
      this.roomManager.onAnswer(roomId, sdp);
    });
  }
}

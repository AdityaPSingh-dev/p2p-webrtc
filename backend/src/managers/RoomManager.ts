import { User } from "./UserManagers";
let GLOBAL_ROOM_ID = 1;
interface Room {
  user1: User;
  user2: User;
}
export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  constructor() {
    this.rooms = new Map<string, Room>();
  }

  // STEP 5: A new room is created with a generated room ID.
  // The 'send-offer' event is emitted to User1, initiating the WebRTC signaling process.
  // User1 and User2 are assigned to the room for the signaling exchange.
  createRoom(user1: User, user2: User) {
    const roomId = this.generate();
    this.rooms.set(roomId.toString(), { user1, user2 });
    user1.socket.emit("send-offer", { roomId });
  }
  // STEP 6: SDP (Session Description Protocol) exchange is initiated by User1.
  // If User2 responds, the backend forwards the SDP answer to User1.
  // The 'onOffer' and 'onAnswer' methods handle this exchange between users.
  onOffer(roomId: string, sdp: string) {
    const user2 = this.rooms.get(roomId)?.user2;
    user2?.socket.emit("offer", {
      sdp,
    });
  }
  onAnswer(roomId: string, sdp: string) {
    const user1 = this.rooms.get(roomId)?.user1;
    user1?.socket.emit("offer", {
      sdp,
    });
  }

  generate() {
    return GLOBAL_ROOM_ID++;
  }
}

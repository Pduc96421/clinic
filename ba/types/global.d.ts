import { Server as IOServer } from "socket.io";

declare global {
  var _io: IOServer;
}
